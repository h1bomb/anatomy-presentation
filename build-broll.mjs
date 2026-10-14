import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";
import { ISO_CSS } from "./kit/iso-kit.mjs";
import { CHAPTERS, getActiveFigureKey } from "./chapters-data.mjs";
import { buildAllCustomMachines } from "./machines/custom-machines.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ANATOMY_EXAMPLES = join(HERE, "vendor-examples");

const OFFICIAL_ASSETS = [
  { dir: "raptor-engine", file: "raptor-engine.html" },
  { dir: "turning-dial", file: "turning-dial.html" },
  { dir: "arcade-cabinet", file: "arcade-cabinet.html" },
  { dir: "ripple-tank", file: "ripple-tank.html" },
  { dir: "desk-computer", file: "desk-computer.html" },
  { dir: "dial-indicator", file: "dial-indicator.html" },
];

function buildOfficialPatchSnippet(assetName) {
  return `<style id="broll-stage-patch">
html, body, body.iso {
  background: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  width: 100% !important;
  height: 100% !important;
}
.iso-page, main {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100vh !important;
}
.iso-figure, figure, .rp, .td, .ac, .rt {
  margin: 0 !important;
  width: 100% !important;
  max-width: none !important;
}
.iso-plate, .rp-card, .td-card, .ac-card, .rt-card {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 16px !important;
  --anatomy-paper: #111110 !important;
  --anatomy-card: #111110 !important;
}
.iso-plate-corners, .iso-legend, .rp-bar, .rp-parts, .rt-bar, .ac-bar, .td-bar, figcaption {
  display: none !important;
}
[data-fire], .rp-foot, .rp-controls, .rp-actions, .rp-hint {
  opacity: 0 !important;
  pointer-events: none !important;
  height: 0 !important;
  overflow: hidden !important;
}
svg.iso-svg, .rp-stage, .td-stage, .rt-stage, .ac-stage {
  max-height: 820px !important;
  margin: 0 auto !important;
}
</style>
<script id="broll-bridge">
(() => {
  let vNow = performance.now();
  let useVirtual = false;
  const activeCbs = new Map();
  let seq = 1;
  const origRaf = window.requestAnimationFrame.bind(window);
  const origCancel = window.cancelAnimationFrame.bind(window);
  const origNow = performance.now.bind(performance);

  performance.now = () => (useVirtual ? vNow : origNow());
  window.requestAnimationFrame = (cb) => {
    const id = seq++;
    activeCbs.set(id, cb);
    if (!useVirtual) {
      origRaf((ts) => {
        if (activeCbs.has(id)) {
          activeCbs.delete(id);
          vNow = Math.max(vNow, ts);
          cb(ts);
        }
      });
    }
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    activeCbs.delete(id);
  };

  window.__stepVirtualClock = (dtMs = 33.333) => {
    useVirtual = true;
    vNow += dtMs;
    const list = [...activeCbs.values()];
    activeCbs.clear();
    for (const cb of list) {
      try { cb(vNow); } catch (err) {}
    }
  };

  let lastCue = "";
  let cueTick = 0;

  function firePointer(el, type, fx, fy) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const clientX = rect.left + rect.width * fx;
    const clientY = rect.top + rect.height * fy;
    el.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      isPrimary: true,
      clientX,
      clientY,
      buttons: type === "pointerup" ? 0 : 1
    }));
  }

  function fireKey(key, code = "") {
    const target = document.querySelector('[tabindex="0"]') || document.querySelector(".rp-stage, .td-stage, .iso-plate") || document.body;
    target.dispatchEvent(new KeyboardEvent("keydown", { key, code: code || key, bubbles: true, cancelable: true }));
    target.dispatchEvent(new KeyboardEvent("keyup", { key, code: code || key, bubbles: true, cancelable: true }));
  }

  window.__brollDrive = (cue, timeSec = 0, beatProgress = 0, dtMs = 33.333) => {
    const stage = document.querySelector(".rp-stage, .td-stage, .rt-stage, .ac-stage, .iso-plate") || document.body;
    const isNewCue = cue !== lastCue;
    lastCue = cue;
    cueTick++;

    if (${JSON.stringify(assetName)} === "raptor-engine.html") {
      if (cue === "RAPTOR_EXPLODE") {
        if (isNewCue || cueTick % 12 === 0) {
          firePointer(stage, "pointerenter", 0.5, 0.45);
          firePointer(stage, "pointermove", 0.48 + Math.sin(timeSec) * 0.08, 0.45);
        }
      } else if (cue === "RAPTOR_IGNITE" || cue === "RAPTOR_BURN_HOLD") {
        firePointer(stage, "pointerleave", 0.1, 0.1);
        const aria = stage.getAttribute("aria-valuetext") || "";
        if (!aria.includes("firing")) {
          const btn = document.querySelector("[data-fire]");
          if (btn) btn.click();
          else fireKey("i", "KeyI");
        }
      }
    } else if (${JSON.stringify(assetName)} === "turning-dial.html") {
      if (typeof window.__isoTurn === "function") {
        window.__isoTurn((timeSec * 32) % 360);
      } else {
        firePointer(stage, "pointermove", 0.35 + 0.3 * Math.sin(timeSec * 1.1), 0.45 + 0.2 * Math.cos(timeSec * 1.1));
      }
    }
    window.__stepVirtualClock(dtMs);
  };
})();
</script>`;
}

export function buildBrollSystem() {
  const distDir = join(HERE, "dist");
  const assetsDir = join(distDir, "assets");
  mkdirSync(assetsDir, { recursive: true });

  // 1. Patch official standalone HTML examples
  for (const { dir, file } of OFFICIAL_ASSETS) {
    const src = join(ANATOMY_EXAMPLES, dir, file);
    if (!existsSync(src)) {
      throw new Error(`Official example not found: ${src}`);
    }
    const rawHtml = readFileSync(src, "utf8");
    const patch = buildOfficialPatchSnippet(file);
    const patchedHtml = rawHtml.includes("</head>")
      ? rawHtml.replace("</head>", `${patch}</head>`)
      : `${patch}${rawHtml}`;
    writeFileSync(join(assetsDir, file), patchedHtml, "utf8");
  }

  // 2. Bundle official anatomy-figures package components
  const bundlePath = join(assetsDir, "official-figures-bundle.js");
  buildSync({
    entryPoints: [join(HERE, "machines", "official-registry.mjs")],
    bundle: true,
    format: "iife",
    platform: "browser",
    outfile: bundlePath,
    minify: true,
  });

  // 3. Also keep custom machines available if needed by tests
  buildAllCustomMachines();

  // 4. Serialize chapters with precomputed readout samples and activeFigureKey table
  const serializedChapters = CHAPTERS.map((ch) => ({
    ...ch,
    readoutSamples: Array.from({ length: 40 }, (_, sec) => {
      const beat = sec < 10 ? 0 : sec < 20 ? 1 : sec < 30 ? 2 : 3;
      return ch.readout(sec, beat);
    }),
    figureBySec: Array.from({ length: 40 }, (_, sec) => {
      const beat = sec < 10 ? 0 : sec < 20 ? 1 : sec < 30 ? 2 : 3;
      return getActiveFigureKey(ch.id, sec, beat);
    }),
  }));

  const playerHtml = generatePlayerHtml(serializedChapters);
  const playerPath = join(distDir, "broll-player.html");
  const indexPath = join(distDir, "index.html");
  writeFileSync(playerPath, playerHtml, "utf8");
  writeFileSync(indexPath, playerHtml, "utf8");

  return { distDir, assetsDir, playerPath, indexPath, bundlePath };
}

function generatePlayerHtml(chapters) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anatomy 深度解析 · 15章官方原版等轴测动态 B-Roll 演播系统</title>
<style>
${ISO_CSS}

:root {
  --stage-scale: 1;
  --bg-canvas: #111110;
  --bg-glass: rgba(22, 22, 20, 0.84);
  --bg-card-active: rgba(32, 32, 29, 0.92);
  --bg-card-idle: rgba(20, 20, 18, 0.66);
  --border-dim: rgba(255, 255, 255, 0.08);
  --border-mid: rgba(255, 255, 255, 0.16);
  --border-lit: rgba(243, 242, 237, 0.78);
  --accent-amber: #e5a93c;
  --accent-red: #e05a47;
  --accent-green: #6be0a0;
  --text-lit: #f3f2ed;
  --text-hi: #d6d5ce;
  --text-mid: #94938b;
  --text-lo: #5c5b55;
  --font-sans: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: var(--bg-canvas);
  color: var(--text-hi);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

body.iso {
  --anatomy-page: #111110;
  --anatomy-card: #111110;
  --anatomy-paper: #111110;
  --anatomy-face: #1d1d1b;
  --anatomy-top: #21211e;
  --anatomy-shade-0: #0e0e0d;
  --anatomy-shade-1: #131311;
  --anatomy-shade-2: #171715;
  --anatomy-shade-3: #1c1c19;
  --anatomy-lit-top: #2c2c28;
  --anatomy-lit-shade: #22221f;
  --anatomy-hi: #d8d7d0;
  --anatomy-mid: #73726b;
  --anatomy-lo: #43423d;
  --anatomy-faint: #2b2a27;
  --anatomy-lit: #f3f2ed;
}

.broll-viewport {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1920px;
  height: 1080px;
  transform-origin: center center;
  transform: translate(-50%, -50%) scale(var(--stage-scale, 1));
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.7);
  background:
    radial-gradient(circle at 68% 52%, rgba(229, 169, 60, 0.055) 0%, rgba(243, 242, 237, 0.03) 34%, transparent 68%),
    linear-gradient(30deg, rgba(255,255,255,0.016) 1px, transparent 1px),
    linear-gradient(150deg, rgba(255,255,255,0.016) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px),
    var(--bg-canvas);
  background-size: 100% 100%, 64px 37px, 64px 37px, 64px 64px;
}

.corner-mark {
  position: absolute;
  width: 14px;
  height: 14px;
  pointer-events: none;
  z-index: 30;
  opacity: 0.42;
}
.corner-mark::before, .corner-mark::after {
  content: "";
  position: absolute;
  background: var(--text-mid);
}
.corner-mark::before { top: 6px; left: 0; width: 14px; height: 1px; }
.corner-mark::after { top: 0; left: 6px; width: 1px; height: 14px; }
.corner-mark.tl { top: 22px; left: 22px; }
.corner-mark.tr { top: 22px; right: 22px; }
.corner-mark.bl { bottom: 22px; left: 22px; }
.corner-mark.br { bottom: 22px; right: 22px; }

/* 1. Top Instrument Plate Bar */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 82px;
  padding: 0 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-dim);
  background: linear-gradient(180deg, rgba(17,17,16,0.95) 0%, rgba(17,17,16,0.6) 100%);
  backdrop-filter: blur(8px);
  z-index: 25;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.fig-badge {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--bg-canvas);
  background: var(--text-lit);
  padding: 5px 11px;
  border-radius: 2px;
}

.chapter-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chapter-main-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-lit);
  letter-spacing: 0.02em;
}

.chapter-sub-title {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-mid);
  letter-spacing: 0.14em;
}

.top-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  width: 460px;
}

.beat-segments {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  width: 100%;
}

.beat-seg {
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  border-radius: 1px;
}

.beat-seg-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 0%;
  background: var(--accent-amber);
  box-shadow: 0 0 8px var(--accent-amber);
}

.timeline-meta {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-mid);
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
}

.top-right {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-lit);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-mid);
  padding: 8px 16px;
  border-radius: 3px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-amber);
  box-shadow: 0 0 10px var(--accent-amber);
}

/* 2. Right Isometric Stage */
.isometric-stage-wrap {
  position: absolute;
  top: 82px;
  right: 0;
  width: 1200px;
  height: 910px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  overflow: hidden;
}

.isometric-stage-wrap::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, #111110 0%, rgba(17,17,16,0.38) 12%, transparent 28%),
    linear-gradient(0deg, #111110 0%, transparent 10%);
  pointer-events: none;
  z-index: 12;
}

.stage-camera-rig {
  width: 1120px;
  height: 850px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.official-pkg-mount {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Seamless integration overrides for mounted anatomy-figures components */
.official-pkg-mount > * {
  width: 940px !important;
  max-width: 940px !important;
  margin: 0 auto !important;
  --anatomy-card: transparent !important;
  --anatomy-paper: #111110 !important;
  background: transparent !important;
}

.official-pkg-mount .iso,
.official-pkg-mount .iso-figure,
.official-pkg-mount figure {
  width: 940px !important;
  max-width: 940px !important;
  margin: 0 auto !important;
  background: transparent !important;
}

.official-pkg-mount .iso-plate {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 8px !important;
  --anatomy-card: transparent !important;
  --anatomy-paper: #111110 !important;
}

.official-pkg-mount .iso-plate-corners {
  display: none !important;
}

.official-pkg-mount .iso-legend,
.official-pkg-mount figcaption {
  display: none !important;
}

.official-pkg-mount svg.iso-svg,
.official-pkg-mount .iso-stage svg {
  width: 100% !important;
  height: auto !important;
  max-height: 820px !important;
  margin: 0 auto !important;
}

.official-stage-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  pointer-events: none;
}

.official-stage-iframe.is-active {
  opacity: 1;
  pointer-events: auto;
}

.stage-hud-overlay {
  position: absolute;
  top: 24px;
  right: 56px;
  z-index: 18;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  pointer-events: none;
}

.stage-cue-pill {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--accent-amber);
  background: rgba(229, 169, 60, 0.1);
  border: 1px solid rgba(229, 169, 60, 0.42);
  padding: 5px 12px;
  border-radius: 2px;
}

.stage-spec-box {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-hi);
  background: rgba(17, 17, 16, 0.82);
  border: 1px solid var(--border-dim);
  padding: 10px 14px;
  border-radius: 3px;
  backdrop-filter: blur(6px);
  max-width: 380px;
  text-align: right;
  line-height: 1.5;
}

/* 3. Left Progressive Slide Narrative Stack */
.slide-narrative-col {
  position: absolute;
  top: 104px;
  left: 56px;
  width: 720px;
  bottom: 108px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.thesis-banner {
  background: linear-gradient(90deg, rgba(229, 169, 60, 0.14) 0%, rgba(26, 26, 24, 0.82) 100%);
  border-left: 3px solid var(--accent-amber);
  border-top: 1px solid var(--border-dim);
  border-right: 1px solid var(--border-dim);
  border-bottom: 1px solid var(--border-dim);
  padding: 14px 20px;
  backdrop-filter: blur(10px);
}

.thesis-tag {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  color: var(--accent-amber);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.thesis-text {
  font-size: 16.5px;
  font-weight: 600;
  color: var(--text-lit);
  line-height: 1.45;
}

.beat-cards-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0;
  flex: 1;
  justify-content: center;
}

.beat-card {
  position: relative;
  background: var(--bg-card-idle);
  border: 1px solid var(--border-dim);
  padding: 15px 20px;
  border-radius: 3px;
  backdrop-filter: blur(12px);
  transition:
    opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.35s ease,
    background-color 0.35s ease;
}

body.export-mode .beat-card,
body.export-mode .stage-camera-rig {
  transition: none !important;
}

.beat-card[data-state="upcoming"] {
  opacity: 0.16;
  transform: translateX(-18px) scale(0.985);
  filter: saturate(0.2);
}

.beat-card[data-state="done"] {
  opacity: 0.58;
  transform: translateX(0) scale(0.992);
  border-color: rgba(255, 255, 255, 0.12);
}

.beat-card[data-state="active"] {
  opacity: 1;
  transform: translateX(8px) scale(1);
  background: var(--bg-card-active);
  border-color: var(--border-lit);
  box-shadow:
    -4px 0 0 0 var(--accent-amber),
    0 14px 34px rgba(0, 0, 0, 0.55);
}

.beat-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.beat-time-badge {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--accent-amber);
  font-weight: 600;
}

.beat-card[data-state="done"] .beat-time-badge {
  color: var(--text-mid);
}

.beat-cue-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--text-mid);
  padding: 2px 7px;
  border: 1px solid var(--border-dim);
  border-radius: 2px;
}

.beat-headline {
  font-size: 19px;
  font-weight: 700;
  color: var(--text-lit);
  margin-bottom: 5px;
  line-height: 1.35;
}

.beat-detail {
  font-size: 13.5px;
  color: var(--text-hi);
  line-height: 1.5;
  margin-bottom: 10px;
}

.beat-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.metric-chip {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-lit);
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 3px 10px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.beat-card[data-state="active"] .metric-chip {
  border-color: rgba(229, 169, 60, 0.45);
  background: rgba(229, 169, 60, 0.09);
}

.metric-chip::before {
  content: "";
  width: 5px;
  height: 5px;
  background: var(--accent-amber);
  display: inline-block;
}

.takeaway-plate {
  background: rgba(22, 22, 20, 0.9);
  border: 1px solid var(--border-mid);
  padding: 13px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.takeaway-plate.is-highlighted {
  border-color: var(--accent-amber);
  box-shadow: 0 0 24px rgba(229, 169, 60, 0.18);
}

.takeaway-label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  color: var(--accent-amber);
  white-space: nowrap;
}

.takeaway-content {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-lit);
  letter-spacing: 0.02em;
}

/* 4. Bottom Synchronized Voiceover Teleprompter Bar */
.teleprompter-hud {
  position: absolute;
  left: 56px;
  right: 56px;
  bottom: 22px;
  height: 64px;
  background: rgba(15, 15, 14, 0.9);
  border: 1px solid var(--border-mid);
  border-radius: 4px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  z-index: 28;
  backdrop-filter: blur(12px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

body.hide-subtitles .teleprompter-hud {
  opacity: 0;
  pointer-events: none;
  transform: translateY(12px);
}

.teleprompter-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  overflow: hidden;
}

.voice-wave-badge {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent-amber);
  border: 1px solid rgba(229, 169, 60, 0.4);
  padding: 4px 9px;
  border-radius: 2px;
  white-space: nowrap;
}

.subtitle-line {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--text-mid);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle-line .sub-spoken {
  color: var(--text-lit);
  font-weight: 600;
}

.subtitle-line .sub-current {
  color: var(--accent-amber);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.controls-hint {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-mid);
  white-space: nowrap;
  display: flex;
  gap: 10px;
}

.key-cap {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  color: var(--text-hi);
}
</style>
<script>
// Virtual clock hook so mounted anatomy-figures components step deterministically during video export
(() => {
  let vNow = performance.now();
  let useVirtual = false;
  let seq = 1;
  const activeCbs = new Map();
  const origRaf = window.requestAnimationFrame.bind(window);
  const origNow = performance.now.bind(performance);

  performance.now = () => (useVirtual ? vNow : origNow());
  window.requestAnimationFrame = (cb) => {
    const id = seq++;
    activeCbs.set(id, cb);
    if (!useVirtual) {
      origRaf((ts) => {
        if (activeCbs.has(id)) {
          activeCbs.delete(id);
          vNow = Math.max(vNow, ts);
          cb(ts);
        }
      });
    }
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    activeCbs.delete(id);
  };

  window.__stepOfficialClock = (dtMs = 33.333) => {
    useVirtual = true;
    vNow += dtMs;
    const list = [...activeCbs.values()];
    activeCbs.clear();
    for (const cb of list) {
      try { cb(vNow); } catch (err) {}
    }
  };
})();

// Auto-fit 1920x1080 stage to any browser window size
function fitViewport() {
  const baseW = 1920;
  const baseH = 1080;
  const availW = window.innerWidth || document.documentElement.clientWidth || 1920;
  const availH = window.innerHeight || document.documentElement.clientHeight || 1080;
  const scale = Math.min(availW / baseW, availH / baseH);
  document.documentElement.style.setProperty("--stage-scale", scale.toString());
}
window.addEventListener("resize", fitViewport, { passive: true });
window.addEventListener("orientationchange", fitViewport, { passive: true });
window.addEventListener("DOMContentLoaded", fitViewport);
fitViewport();
</script>
<script src="assets/official-figures-bundle.js"></script>
</head>
<body class="iso" data-theme="dark">
  <div class="broll-viewport" id="viewport">
    <div class="corner-mark tl"></div>
    <div class="corner-mark tr"></div>
    <div class="corner-mark bl"></div>
    <div class="corner-mark br"></div>

    <!-- 1. Top Instrument Plate Bar -->
    <header class="top-bar">
      <div class="top-left">
        <span class="fig-badge" id="ui-fig-badge">FIG. CH-01 / 15</span>
        <div class="chapter-titles">
          <h1 class="chapter-main-title" id="ui-chapter-title">一行字造一台机器</h1>
          <div class="chapter-sub-title" id="ui-chapter-subtitle">OFFICIAL FIGURE: WATCH MOVEMENT</div>
        </div>
      </div>

      <div class="top-center">
        <div class="beat-segments">
          <div class="beat-seg"><div class="beat-seg-fill" id="seg-fill-0"></div></div>
          <div class="beat-seg"><div class="beat-seg-fill" id="seg-fill-1"></div></div>
          <div class="beat-seg"><div class="beat-seg-fill" id="seg-fill-2"></div></div>
          <div class="beat-seg"><div class="beat-seg-fill" id="seg-fill-3"></div></div>
        </div>
        <div class="timeline-meta">
          <span id="ui-beat-label">BEAT 01 / 04 · 00s–10s</span>
          <span id="ui-timecode">00:00.0 / 00:40.0</span>
        </div>
      </div>

      <div class="top-right">
        <span class="status-dot" id="ui-status-dot"></span>
        <span id="ui-readout">OFFICIAL [watch]</span>
      </div>
    </header>

    <!-- 2. Right Isometric Stage -->
    <section class="isometric-stage-wrap" aria-label="Anatomy Isometric Animation Stage">
      <div class="stage-hud-overlay">
        <div class="stage-cue-pill" id="ui-stage-cue">OFFICIAL FIGURE · watch</div>
        <div class="stage-spec-box" id="ui-stage-spec">
          ORTHOGRAPHIC 45° / 30° · 4-TONE SHADING · MODEL-DRIVEN
        </div>
      </div>
      <div class="stage-camera-rig" id="stage-camera-rig">
        <div class="official-pkg-mount" id="official-pkg-mount"></div>
        <iframe class="official-stage-iframe" data-asset="raptor-engine.html" data-src="assets/raptor-engine.html" src="about:blank" title="raptor-engine"></iframe>
        <iframe class="official-stage-iframe" data-asset="turning-dial.html" data-src="assets/turning-dial.html" src="about:blank" title="turning-dial"></iframe>
      </div>
    </section>

    <!-- 3. Left Progressive Slide Narrative Stack -->
    <aside class="slide-narrative-col">
      <div class="thesis-banner">
        <div class="thesis-tag" id="ui-thesis-tag">CHAPTER THESIS · 核心命题</div>
        <div class="thesis-text" id="ui-thesis-text"></div>
      </div>

      <div class="beat-cards-stack" id="ui-beat-cards"></div>

      <div class="takeaway-plate" id="ui-takeaway-plate">
        <span class="takeaway-label">KEY TAKEAWAY</span>
        <span class="takeaway-content" id="ui-takeaway-text"></span>
      </div>
    </aside>

    <!-- 4. Bottom Synchronized Voiceover Teleprompter Bar -->
    <footer class="teleprompter-hud" id="ui-teleprompter">
      <div class="teleprompter-left">
        <span class="voice-wave-badge" id="ui-voice-badge">VOICEOVER · 00s</span>
        <p class="subtitle-line" id="ui-subtitle-line"></p>
      </div>
      <div class="controls-hint">
        <span><b class="key-cap">Space</b> 播放/暂停</span>
        <span><b class="key-cap">←/→</b> 章节</span>
        <span><b class="key-cap">1-4</b> 节拍</span>
        <span><b class="key-cap">C</b> 字幕</span>
      </div>
    </footer>
  </div>

<script>
const CHAPTERS = ${JSON.stringify(chapters)};

const urlParams = new URLSearchParams(location.search);
if (urlParams.get("subtitles") === "0") {
  document.body.classList.add("hide-subtitles");
}
const isExportMode = urlParams.get("export") === "1";
if (isExportMode) {
  document.body.classList.add("export-mode");
}

let currentChapterIndex = Math.max(0, Math.min(14, Number(urlParams.get("ch") || 1) - 1));
let currentTimeSec = Number(urlParams.get("t") || 0);
let isPlaying = !isExportMode;
let lastWallTime = performance.now();
let renderedChapterIndex = -1;
let mountedFigureKey = "";
let mountedDispose = null;
let lastWatchCue = "";

const uiFigBadge = document.getElementById("ui-fig-badge");
const uiChapterTitle = document.getElementById("ui-chapter-title");
const uiChapterSubtitle = document.getElementById("ui-chapter-subtitle");
const uiBeatLabel = document.getElementById("ui-beat-label");
const uiTimecode = document.getElementById("ui-timecode");
const uiReadout = document.getElementById("ui-readout");
const uiStageCue = document.getElementById("ui-stage-cue");
const uiStageSpec = document.getElementById("ui-stage-spec");
const uiThesisText = document.getElementById("ui-thesis-text");
const uiBeatCards = document.getElementById("ui-beat-cards");
const uiTakeawayPlate = document.getElementById("ui-takeaway-plate");
const uiTakeawayText = document.getElementById("ui-takeaway-text");
const uiVoiceBadge = document.getElementById("ui-voice-badge");
const uiSubtitleLine = document.getElementById("ui-subtitle-line");
const stageCameraRig = document.getElementById("stage-camera-rig");
const pkgMount = document.getElementById("official-pkg-mount");

const segFills = [
  document.getElementById("seg-fill-0"),
  document.getElementById("seg-fill-1"),
  document.getElementById("seg-fill-2"),
  document.getElementById("seg-fill-3"),
];

const officialIframes = Object.fromEntries(
  [...document.querySelectorAll(".official-stage-iframe")].map((el) => [el.dataset.asset, el])
);

function getBeatIndex(t) {
  const clamped = Math.max(0, Math.min(39.999, Number.isFinite(t) ? t : 0));
  if (clamped < 10) return 0;
  if (clamped < 20) return 1;
  if (clamped < 30) return 2;
  return 3;
}

function buildBeatCardsDom(chapter) {
  uiBeatCards.innerHTML = chapter.beats
    .map(
      (b, idx) => \`
      <article class="beat-card" id="beat-card-\${idx}" data-state="upcoming">
        <div class="beat-card-header">
          <span class="beat-time-badge">BEAT 0\${idx + 1} · \${b.label}</span>
          <span class="beat-cue-tag">STAGE: \${b.stageCue}</span>
        </div>
        <h2 class="beat-headline">\${b.headline}</h2>
        <p class="beat-detail">\${b.detail}</p>
        <div class="beat-metrics">
          \${b.metrics.map((m) => \`<span class="metric-chip">\${m}</span>\`).join("")}
        </div>
      </article>\`
    )
    .join("");
}

function mountActiveFigure(figKey) {
  if (mountedFigureKey === figKey) return;
  mountedFigureKey = figKey;
  lastWatchCue = "";

  if (typeof mountedDispose === "function") {
    try { mountedDispose(); } catch (e) {}
    mountedDispose = null;
  }
  pkgMount.innerHTML = "";

  for (const [assetName, iframe] of Object.entries(officialIframes)) {
    const want = figKey === \`iframe:\${assetName}\`;
    iframe.classList.toggle("is-active", want);
    const targetSrc = want ? iframe.dataset.src : "about:blank";
    if (iframe.getAttribute("src") !== targetSrc) {
      iframe.setAttribute("src", targetSrc);
    }
  }

  if (!figKey.startsWith("iframe:")) {
    const renderFn = window.ANATOMY_OFFICIAL_FIGURES?.[figKey];
    if (typeof renderFn === "function") {
      const host = document.createElement("div");
      host.style.cssText = "width:920px;max-width:920px;margin:0 auto;display:block;";
      pkgMount.appendChild(host);

      mountedDispose = renderFn(host, {
        fig: \`FIG \${figKey.toUpperCase()}\`,
        theme: {
          base: "dark",
          tokens: {
            "--anatomy-card": "#111110",
            "--anatomy-paper": "#111110",
          },
        },
      });

      const shadowStyle = \`
        :host { display: block !important; width: 920px !important; }
        .iso, .iso-figure, figure {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          background: transparent !important;
          --anatomy-card: #111110 !important;
          --anatomy-paper: #111110 !important;
        }
        .iso-plate, .iso .iso-plate, .iso .iso-plate[data-plate="dark"] {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          padding: 16px 24px !important;
          --anatomy-card: #111110 !important;
          --anatomy-paper: #111110 !important;
        }
        .iso-plate-corners {
          opacity: 0.38 !important;
        }
        .iso-legend, figcaption {
          display: none !important;
        }
        .iso-stage svg, svg.iso-svg {
          width: 100% !important;
          height: auto !important;
          max-height: 760px !important;
        }
      \`;

      const injectShadowStyle = () => {
        const root = host.shadowRoot || host;
        if (!root) return;
        if (!root.querySelector("#broll-shadow-override")) {
          const st = document.createElement("style");
          st.id = "broll-shadow-override";
          st.textContent = shadowStyle;
          root.appendChild(st);
        }
        if (host.shadowRoot && "adoptedStyleSheets" in host.shadowRoot && !host.shadowRoot.__brollStyled) {
          try {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(shadowStyle);
            host.shadowRoot.adoptedStyleSheets = [...host.shadowRoot.adoptedStyleSheets, sheet];
            host.shadowRoot.__brollStyled = true;
          } catch (e) {}
        }
      };
      injectShadowStyle();
      setTimeout(injectShadowStyle, 30);
    }
  }
}

function driveMountedOfficialPkg(figKey, stageCue, timeSec, beatProgress) {
  const host = pkgMount.firstElementChild;
  const root = host?.shadowRoot || host || pkgMount;
  const stageEl = root.querySelector(".iso-stage") || root.querySelector('[tabindex="0"]');
  if (!stageEl) return;

  const cueKey = \`\${figKey}:\${stageCue}\`;
  if (cueKey !== lastWatchCue) {
    lastWatchCue = cueKey;
    if (figKey === "watch") {
      if (stageCue === "WATCH_SLOW") {
        stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: "s", code: "KeyS", bubbles: true }));
      } else if (stageCue === "WATCH_APART") {
        stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: "e", code: "KeyE", bubbles: true }));
      } else if (stageCue === "WATCH_FULL") {
        stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: "e", code: "KeyE", bubbles: true }));
        stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: "s", code: "KeyS", bubbles: true }));
      }
    } else if (figKey === "turbofan") {
      stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true }));
    } else if (figKey === "plasma-cutter" || figKey === "afterburner" || figKey === "tokamak") {
      stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true }));
    }
  }
}

function getCameraTransform(ch, beatIndex, beatProgress, t) {
  const driftX = Math.sin(t * 0.35) * 5;
  const driftY = Math.cos(t * 0.35) * 3.5;
  if (ch.id === "ch01" && beatIndex === 1) {
    return \`translate(\${(driftX - 18).toFixed(1)}px, \${(driftY + 10).toFixed(1)}px) scale(1.14)\`;
  }
  if (ch.id === "ch04" && beatIndex === 3) {
    return \`translate(\${(driftX - 24).toFixed(1)}px, \${(driftY + 14).toFixed(1)}px) scale(1.18)\`;
  }
  if (ch.id === "ch10" && beatIndex === 2) {
    return \`translate(\${(driftX - 26).toFixed(1)}px, \${(driftY + 14).toFixed(1)}px) scale(1.22)\`;
  }
  return \`translate(\${driftX.toFixed(1)}px, \${driftY.toFixed(1)}px) scale(1.03)\`;
}

function updateSubtitleProgress(scriptText, beatProgress) {
  const chars = [...scriptText];
  const cut = Math.floor(chars.length * Math.max(0, Math.min(1, beatProgress)));
  const spoken = chars.slice(0, Math.max(0, cut - 2)).join("");
  const current = chars.slice(Math.max(0, cut - 2), cut + 3).join("");
  const rest = chars.slice(cut + 3).join("");
  uiSubtitleLine.innerHTML = \`<span class="sub-spoken">\${spoken}</span><span class="sub-current">\${current}</span><span>\${rest}</span>\`;
}

window.__renderFrame = function(chIndex, timeSec, dtMs = 33.333) {
  const safeChIndex = Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(chIndex)));
  const ch = CHAPTERS[safeChIndex];
  const clampedTime = Math.max(0, Math.min(ch.duration - 0.001, Number.isFinite(timeSec) ? timeSec : 0));
  const beatIndex = getBeatIndex(clampedTime);
  const activeBeat = ch.beats[beatIndex];
  const beatProgress = Math.max(0, Math.min(1, (clampedTime - activeBeat.start) / (activeBeat.end - activeBeat.start)));

  currentChapterIndex = safeChIndex;
  currentTimeSec = clampedTime;

  if (renderedChapterIndex !== safeChIndex) {
    renderedChapterIndex = safeChIndex;
    uiFigBadge.textContent = \`FIG. CH-\${ch.number} / 15\`;
    uiChapterTitle.textContent = ch.title;
    uiChapterSubtitle.textContent = ch.subtitle;
    uiThesisText.textContent = ch.thesis;
    uiTakeawayText.textContent = ch.takeaway;
    buildBeatCardsDom(ch);
  }

  for (let i = 0; i < 4; i++) {
    const pct = i < beatIndex ? 100 : i === beatIndex ? beatProgress * 100 : 0;
    segFills[i].style.width = \`\${pct.toFixed(1)}%\`;
    const card = document.getElementById(\`beat-card-\${i}\`);
    if (card) {
      const state = i < beatIndex ? "done" : i === beatIndex ? "active" : "upcoming";
      card.dataset.state = state;
      if (isExportMode) {
        if (state === "active") {
          const enterT = Math.max(0, Math.min(1, (clampedTime - ch.beats[i].start) / 0.55));
          const ease = 1 - Math.pow(1 - enterT, 3);
          const tx = -18 + 26 * ease;
          const op = 0.16 + 0.84 * ease;
          card.style.transform = \`translateX(\${tx.toFixed(2)}px) scale(\${(0.985 + 0.015 * ease).toFixed(4)})\`;
          card.style.opacity = op.toFixed(3);
        } else {
          card.style.transform = "";
          card.style.opacity = "";
        }
      }
    }
  }

  const secIdx = Math.min(39, Math.floor(clampedTime));
  const figKey = ch.figureBySec[secIdx] || ch.machineKey;

  uiBeatLabel.textContent = \`BEAT 0\${beatIndex + 1} / 04 · \${activeBeat.label}\`;
  uiTimecode.textContent = \`00:\${clampedTime.toFixed(1).padStart(4, "0")} / 00:40.0\`;
  uiReadout.textContent = ch.readoutSamples[secIdx] || "";
  uiStageCue.textContent = \`OFFICIAL FIGURE · \${figKey.replace("iframe:", "").replace(".html", "")} · \${activeBeat.stageCue}\`;
  uiStageSpec.textContent = \`\${ch.subtitle} · \${activeBeat.metrics.join(" · ")}\`;
  uiTakeawayPlate.classList.toggle("is-highlighted", beatIndex === 3);

  uiVoiceBadge.textContent = \`CH\${ch.number} 口播 · \${Math.floor(clampedTime)}s\`;
  updateSubtitleProgress(activeBeat.scriptText, beatProgress);

  mountActiveFigure(figKey);

  if (figKey.startsWith("iframe:")) {
    const assetName = figKey.slice("iframe:".length);
    const iframe = officialIframes[assetName];
    if (iframe && iframe.contentWindow && typeof iframe.contentWindow.__brollDrive === "function") {
      iframe.contentWindow.__brollDrive(activeBeat.stageCue, clampedTime, beatProgress, dtMs);
    }
  } else {
    driveMountedOfficialPkg(figKey, activeBeat.stageCue, clampedTime, beatProgress);
    if (isExportMode && typeof window.__stepOfficialClock === "function") {
      window.__stepOfficialClock(dtMs);
    }
  }

  stageCameraRig.style.transform = getCameraTransform(ch, beatIndex, beatProgress, clampedTime);
  return { chapterId: ch.id, beatIndex, timeSec: clampedTime, figure: figKey };
};

window.__renderFrame(currentChapterIndex, currentTimeSec, 0);

function loop(now) {
  const dt = Math.min(0.1, Math.max(0, (now - lastWallTime) / 1000));
  lastWallTime = now;
  if (isPlaying && !isExportMode) {
    let nextTime = currentTimeSec + dt;
    let nextCh = currentChapterIndex;
    if (nextTime >= 40) {
      nextTime = 0;
      nextCh = (currentChapterIndex + 1) % CHAPTERS.length;
    }
    window.__renderFrame(nextCh, nextTime, dt * 1000);
  }
  if (!isExportMode) {
    requestAnimationFrame(loop);
  }
}
if (!isExportMode) {
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    isPlaying = !isPlaying;
  } else if (e.code === "ArrowRight") {
    e.preventDefault();
    window.__renderFrame((currentChapterIndex + 1) % CHAPTERS.length, 0, 0);
  } else if (e.code === "ArrowLeft") {
    e.preventDefault();
    window.__renderFrame((currentChapterIndex - 1 + CHAPTERS.length) % CHAPTERS.length, 0, 0);
  } else if (["Digit1", "Digit2", "Digit3", "Digit4"].includes(e.code)) {
    const beat = Number(e.code.replace("Digit", "")) - 1;
    window.__renderFrame(currentChapterIndex, beat * 10 + 0.1, 0);
  } else if (e.code === "KeyC") {
    document.body.classList.toggle("hide-subtitles");
  } else if (e.code === "KeyF") {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
});
</script>
</body>
</html>`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const out = buildBrollSystem();
  console.log(`Built B-roll player at ${out.playerPath}`);
}
