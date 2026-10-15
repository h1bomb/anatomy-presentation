import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { CHAPTERS, t } from "../src/data/chapters.ts";
import type { Language } from "../src/types.ts";

const API_KEY = process.env.MINIMAX_API_KEY;
if (!API_KEY) {
  console.error("Error: MINIMAX_API_KEY environment variable is required.");
  process.exit(1);
}
const VOICE_ID = process.env.MINIMAX_VOICE_ID || "custom-voice-id";
const MODEL = process.env.MINIMAX_MODEL || "speech-2.8-hd";
const API_URL = "https://api.minimax.cn/v1/t2a_v2";

const PUBLIC_AUDIO_DIR = path.resolve(import.meta.dirname, "../public/audio");

interface T2AResponse {
  data?: {
    audio?: string;
    status?: number;
  };
  extra_info?: {
    audio_length?: number;
    audio_sample_rate?: number;
    audio_size?: number;
    bitrate?: number;
    word_count?: number;
  };
  base_resp?: {
    status_code: number;
    status_msg: string;
  };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function synthesizeText(text: string, maxRetries = 3): Promise<Buffer> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          text,
          stream: false,
          voice_setting: {
            voice_id: VOICE_ID,
            speed: 1.0,
            vol: 1.0,
            pitch: 0,
          },
          audio_setting: {
            sample_rate: 32000,
            bitrate: 128000,
            format: "mp3",
            channel: 1,
          },
        }),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      }

      const json = (await resp.json()) as T2AResponse;
      if (json.base_resp && json.base_resp.status_code !== 0) {
        const code = json.base_resp.status_code;
        const msg = json.base_resp.status_msg;
        // Rate limiting or transient throttle
        if (code === 1002 || code === 1039) {
          console.warn(`[Throttle ${code}] ${msg}, backing off... attempt ${attempt}/${maxRetries}`);
          await sleep(2500 * attempt);
          continue;
        }
        throw new Error(`MiniMax error [${code}]: ${msg}`);
      }

      if (!json.data?.audio) {
        throw new Error("Missing audio in response data");
      }

      return Buffer.from(json.data.audio, "hex");
    } catch (err: any) {
      if (attempt < maxRetries) {
        console.warn(`[Retry ${attempt}/${maxRetries}] ${err.message}`);
        await sleep(2000 * attempt);
      } else {
        throw err;
      }
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

async function convertMp3ToM4a(mp3Path: string, m4aPath: string): Promise<void> {
  execSync(
    `ffmpeg -y -i "${mp3Path}" -c:a aac -b:a 64k -ar 32000 -ac 1 "${m4aPath}" 2>/dev/null`,
    { stdio: "ignore" }
  );
}

async function processQueue(languages: Language[] = ["zh", "en"]): Promise<void> {
  console.log(`\n======================================================`);
  console.log(`MiniMax T2A Batch Audio Generator`);
  console.log(`Endpoint: ${API_URL}`);
  console.log(`Model:    ${MODEL}`);
  console.log(`Voice ID: ${VOICE_ID}`);
  console.log(`Target:   ${PUBLIC_AUDIO_DIR}`);
  console.log(`Langs:    ${languages.join(", ")}`);
  console.log(`======================================================\n`);

  for (const lang of languages) {
    const langDir = path.join(PUBLIC_AUDIO_DIR, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    const tasks: Array<{
      chapterId: string;
      beatIndex: number;
      text: string;
      mp3Path: string;
      m4aPath: string;
    }> = [];

    for (const ch of CHAPTERS) {
      ch.beats.forEach((b, beatIndex) => {
        const text = t(b.scriptText, lang);
        if (text && text.trim()) {
          const mp3Path = path.join(langDir, `${ch.id}_${beatIndex}.mp3`);
          const m4aPath = path.join(langDir, `${ch.id}_${beatIndex}.m4a`);
          tasks.push({
            chapterId: ch.id,
            beatIndex,
            text,
            mp3Path,
            m4aPath,
          });
        }
      });
    }

    console.log(`\nProcessing language: [${lang.toUpperCase()}] (${tasks.length} audio tracks)...`);

    let done = 0;
    for (const task of tasks) {
      done++;
      const prefix = `[${done}/${tasks.length}] [${lang}] ${task.chapterId}_${task.beatIndex}`;
      process.stdout.write(`${prefix}: Synthesizing... `);

      const start = Date.now();
      try {
        const mp3Buffer = await synthesizeText(task.text);
        fs.writeFileSync(task.mp3Path, mp3Buffer);

        // Convert to AAC m4a for maximum browser & legacy compatibility
        await convertMp3ToM4a(task.mp3Path, task.m4aPath);

        const m4aStat = fs.statSync(task.m4aPath);
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        const sizeKb = (m4aStat.size / 1024).toFixed(0);

        console.log(`DONE in ${elapsed}s (${sizeKb} KB)`);
      } catch (err: any) {
        console.error(`FAILED: ${err.message}`);
      }

      // Pacing to stay comfortably under API rate limits
      await sleep(650);
    }
  }

  console.log("\nAll requested voice syntheses completed successfully!");
}

const targetLangs: Language[] = (process.argv[2] ? [process.argv[2] as Language] : ["zh", "en"]);
processQueue(targetLangs).catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
