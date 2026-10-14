import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromePort } from "./chrome-port.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);
  const playwright = join(homedir(), "Library/Caches/ms-playwright");
  if (existsSync(playwright)) {
    for (const dir of readdirSync(playwright).sort().reverse()) {
      for (const sub of [
        "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
        "chrome-mac/Chromium.app/Contents/MacOS/Chromium",
      ]) {
        candidates.push(join(playwright, dir, sub));
      }
    }
  }
  return candidates.find((p) => existsSync(p));
}

async function renderChapterRange(binary, playerUrl, videosDir, chapterIndices, captureFps = 12, durationSec = 40) {
  const profile = mkdtempSync(join(tmpdir(), "broll-export-"));
  const chrome = spawn(binary, [
    "--headless=new",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--window-size=1920,1080",
    "about:blank",
  ]);

  let ws;
  try {
    const port = await chromePort(chrome);
    const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
    const pageTarget = targets.find((t) => t.type === "page");
    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener("open", res, { once: true });
      ws.addEventListener("error", rej, { once: true });
    });

    let seq = 1;
    const pending = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve: r, reject: j } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) j(new Error(msg.error.message));
        else r(msg.result);
      }
    });

    const send = (method, params = {}) =>
      new Promise((r, j) => {
        const id = seq++;
        pending.set(id, { resolve: r, reject: j });
        ws.send(JSON.stringify({ id, method, params }));
      });

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send("Page.navigate", { url: `${playerUrl}?export=1` });

    await send("Runtime.evaluate", {
      expression: `new Promise((resolve) => {
        const check = () => {
          if (typeof window.__renderFrame === "function" && window.ANATOMY_OFFICIAL_FIGURES) resolve(true);
          else setTimeout(check, 50);
        };
        check();
      })`,
      awaitPromise: true,
    });

    const totalFrames = Math.round(durationSec * captureFps);
    const dtMs = 1000 / captureFps;

    for (const chIdx of chapterIndices) {
      const chNum = String(chIdx + 1).padStart(2, "0");
      const outMp4 = join(videosDir, `ch${chNum}.mp4`);

      const ff = spawn(
        "ffmpeg",
        [
          "-y",
          "-f",
          "image2pipe",
          "-vcodec",
          "mjpeg",
          "-framerate",
          String(captureFps),
          "-i",
          "-",
          "-r",
          "30",
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-preset",
          "ultrafast",
          "-crf",
          "20",
          outMp4,
        ],
        { stdio: ["pipe", "ignore", "ignore"] }
      );

      const ffDone = new Promise((res, rej) => {
        ff.on("close", (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`))));
        ff.on("error", rej);
      });

      for (let f = 0; f < totalFrames; f++) {
        const t = f / captureFps;
        await send("Runtime.evaluate", {
          expression: `window.__renderFrame(${chIdx}, ${t.toFixed(4)}, ${dtMs.toFixed(2)})`,
        });
        const { data } = await send("Page.captureScreenshot", {
          format: "jpeg",
          quality: 84,
          optimizeForSpeed: true,
        });
        const buf = Buffer.from(data, "base64");
        if (!ff.stdin.write(buf)) {
          await new Promise((r) => ff.stdin.once("drain", r));
        }
      }

      ff.stdin.end();
      await ffDone;
      console.log(`Exported ${outMp4} (${durationSec}s, 1920x1080 @ 30fps)`);
    }
  } finally {
    try { ws?.close(); } catch {}
    chrome.kill("SIGKILL");
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
  }
}

async function main() {
  const argv = process.argv.slice(2);
  let chaptersArg = null;
  let fps = 10;
  let concurrency = 5;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--chapters") chaptersArg = argv[++i];
    else if (argv[i] === "--fps") fps = Number(argv[++i]);
    else if (argv[i] === "--concurrency") concurrency = Number(argv[++i]);
  }

  const targetIndices = chaptersArg
    ? chaptersArg.split(",").map((n) => Number(n.trim()) - 1)
    : Array.from({ length: 15 }, (_, i) => i);

  const playerPath = join(ROOT, "dist", "broll-player.html");
  const videosDir = join(ROOT, "output", "videos");
  mkdirSync(videosDir, { recursive: true });

  const binary = findChrome();
  if (!binary) throw new Error("No Chrome binary found");

  const playerUrl = pathToFileURL(playerPath).href;

  // Split targetIndices across concurrent headless Chrome workers
  const workers = Math.min(concurrency, targetIndices.length);
  const buckets = Array.from({ length: workers }, () => []);
  targetIndices.forEach((chIdx, i) => {
    buckets[i % workers].push(chIdx);
  });

  console.log(`Starting MP4 export for ${targetIndices.length} chapter(s) across ${workers} parallel Chrome workers...`);
  await Promise.all(
    buckets.map((bucket) => renderChapterRange(binary, playerUrl, videosDir, bucket, fps, 40))
  );
  console.log("All requested chapters exported successfully.");
  process.exit(0);
}

await main();
