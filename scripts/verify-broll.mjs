import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
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

async function main() {
  const playerPath = join(ROOT, "dist", "broll-player.html");
  const shotsDir = join(ROOT, "output", "shots");
  mkdirSync(shotsDir, { recursive: true });

  const binary = findChrome();
  if (!binary) {
    throw new Error("Chrome/Chromium binary not found");
  }

  const profile = mkdtempSync(join(tmpdir(), "broll-verify-"));
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
  const errors = [];
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
      } else if (msg.method === "Runtime.exceptionThrown") {
        errors.push(msg.params.exceptionDetails?.text || "Runtime exception");
      } else if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
        errors.push(msg.params.args.map((a) => a.value ?? a.description).join(" "));
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

    const url = `${pathToFileURL(playerPath).href}?export=1`;
    await send("Page.navigate", { url });

    // Wait for player & all iframes to finish loading
    await send("Runtime.evaluate", {
      expression: `new Promise((resolve) => {
        const check = () => {
          const iframes = [...document.querySelectorAll("iframe")];
          const allLoaded = iframes.every((f) => f.contentDocument && f.contentDocument.readyState === "complete");
          if (typeof window.__renderFrame === "function" && allLoaded) resolve(true);
          else setTimeout(check, 60);
        };
        check();
      })`,
      awaitPromise: true,
    });

    const sampleTimes = [4, 14, 24, 34];
    for (let chIdx = 0; chIdx < 15; chIdx++) {
      const sampleTime = sampleTimes[chIdx % sampleTimes.length];
      // Step several frames so springs/shaders settle nicely
      for (let step = 0; step < 6; step++) {
        const t = sampleTime + step * 0.08;
        await send("Runtime.evaluate", {
          expression: `window.__renderFrame(${chIdx}, ${t.toFixed(2)}, 33.333)`,
        });
      }
      const { data } = await send("Page.captureScreenshot", { format: "png" });
      const chName = `ch${String(chIdx + 1).padStart(2, "0")}.png`;
      writeFileSync(join(shotsDir, chName), Buffer.from(data, "base64"));
    }

    console.log(`verified 15/15 chapters, console errors: ${errors.length}`);
    if (errors.length > 0) {
      console.error("Console errors:", errors);
      process.exit(1);
    }
    process.exit(0);
  } finally {
    try { ws?.close(); } catch {}
    chrome.kill("SIGKILL");
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
  }
}

await main();
