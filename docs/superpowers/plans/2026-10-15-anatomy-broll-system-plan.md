# Anatomy 15-Chapter Dynamic B-Roll & Video Export System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 1920×1080 dark-theme HTML5 presentation & isometric animation engine (`dist/broll-player.html`) covering all 15 chapters of `Anatomy深度解析_口播稿与文案包.md` (40s per chapter, 4 progressive beats per chapter) plus a deterministic Chrome CDP + `ffmpeg` video exporter (`scripts/export-mp4.mjs`).

**Architecture:** A zero-dependency Node.js build pipeline (`build-broll.mjs`) compiles 9 custom isometric machines using `kit/iso-kit.mjs`, patches 6 official Anatomy dark-theme examples into seamless borderless stage assets under `dist/assets/`, and bundles `chapters-data.mjs` + deterministic timeline runtime into `dist/broll-player.html`. `scripts/export-mp4.mjs` drives `window.__renderFrame(chIndex, timeSec)` over Chrome DevTools Protocol and streams JPEG frames into `ffmpeg` to produce `output/videos/ch01.mp4`–`ch15.mp4`.

**Tech Stack:** Node.js (v20.10+ ESM, `node:test`), Anatomy `kit/iso-kit.mjs`, HTML5 SVG/CSS/WebGL, Chrome DevTools Protocol (native WebSocket), `ffmpeg`.

**Spec:** `docs/superpowers/specs/2026-10-15-anatomy-broll-system-design.md`

## Global Constraints

- Canvas resolution: `1920 × 1080` (16:9 landscape), Anatomy dark theme background `#111110`, four-tone ramp (`lo: #1b1b19`, `mid: #272724`, `hi: #3a3a35`, `lit: #f3f2ed`, accent `#e5a93c`, alert `#e05a47`).
- Chapter count & duration: Exactly 15 chapters (`ch01`–`ch15`), `40.0` seconds per chapter, 4 beats per chapter (`0s`, `10s`, `20s`, `30s`).
- Zero external npm packages required: use Node built-in modules and `kit/iso-kit.mjs`.
- Deterministic frame stepping: `window.__renderFrame(chIndex, timeSec)` must deterministically update slide beat state, isometric SVG transforms, embedded official machine state, live readout, and subtitle progress without relying on real-time wall clock.

## Review Focus

1. Out-of-range or boundary `timeSec` values (`timeSec = 0`, `timeSec = 39.99`, `timeSec = 40.0`, `timeSec < 0`) passed to `getBeatIndex(timeSec)` and `window.__renderFrame(chIndex, timeSec)` must clamp cleanly to valid beat indices `0..3` and progress `0..1`.
2. Embedded official example iframes (`raptor-engine.html`, `turning-dial.html`, `arcade-cabinet.html`, `ripple-tank.html`, `desk-computer.html`, `dial-indicator.html`) must have transparent/borderless `#111110` backgrounds with `.iso-card` chrome stripped or restyled so no nested box border clashes with the 1920×1080 stage.
3. Subtitle toggle state (`?subtitles=0` or key `KeyC`) must cleanly hide `.teleprompter-hud` without shifting the slide stack or isometric stage layout.
4. Custom `iso-kit.mjs` machines must generate valid SVG strings with non-empty `<path>` and `[data-anim]` groups so runtime animation hooks never throw null reference errors.
5. `scripts/export-mp4.mjs` must verify iframe readiness before capturing frames so `ch03/ch04/ch05/ch08/ch10/ch15` never export blank iframe stages.

---

### Task 1: Chapter Narrative, Beat Timeline & Readout Data (`chapters-data.mjs`)

**Files:**
- Create: `chapters-data.mjs`
- Test: `tests/chapters-data.test.mjs`

**Interfaces:**
- Produces:
  - `CHAPTERS`: Array of 15 chapter objects `{ id: "ch01".."ch15", index: 0..14, number: "01".."15", title: string, subtitle: string, duration: 40, stageType: "custom" | "official", machineKey: string, takeaway: string, readoutTemplate: (t: number, beat: number) => string, beats: Array<{ start: number, end: number, label: string, headline: string, detail: string, metrics: string[], scriptText: string, stageCue: string }> }`
  - `getBeatIndex(timeSec: number): 0 | 1 | 2 | 3`
  - `getChapterState(chIndex: number, timeSec: number): { chapter, clampedTime, progress, beatIndex, beatProgress, activeBeat, readout }`

- [ ] **Step 1: Write the failing test in `tests/chapters-data.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { CHAPTERS, getBeatIndex, getChapterState } from "../chapters-data.mjs";

test("CHAPTERS contains all 15 chapters with 4 beats covering 0..40s", () => {
  assert.equal(CHAPTERS.length, 15);
  assert.equal(CHAPTERS[0].id, "ch01");
  assert.equal(CHAPTERS[14].id, "ch15");
  for (const ch of CHAPTERS) {
    assert.equal(ch.duration, 40);
    assert.equal(ch.beats.length, 4);
    assert.equal(ch.beats[0].start, 0);
    assert.equal(ch.beats[3].end, 40);
    assert.ok(ch.title.length > 0);
    assert.ok(ch.takeaway.length > 0);
  }
});

test("getBeatIndex and getChapterState clamp boundary times accurately", () => {
  assert.equal(getBeatIndex(-5), 0);
  assert.equal(getBeatIndex(0), 0);
  assert.equal(getBeatIndex(9.99), 0);
  assert.equal(getBeatIndex(10.0), 1);
  assert.equal(getBeatIndex(25.0), 2);
  assert.equal(getBeatIndex(39.9), 3);
  assert.equal(getBeatIndex(45.0), 3);

  const state = getChapterState(7, 25.0);
  assert.equal(state.chapter.id, "ch08");
  assert.equal(state.beatIndex, 2);
  assert.ok(state.readout.includes("300"));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/chapters-data.test.mjs`
Expected: FAIL (`Cannot find module '../chapters-data.mjs'`)

- [ ] **Step 3: Implement `chapters-data.mjs`**

Populate all 15 chapters (`ch01`–`ch15`) directly from `Anatomy深度解析_口播稿与文案包.md` and Section 3 of the spec.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/chapters-data.test.mjs`
Expected: PASS

---

### Task 2: Custom `iso-kit.mjs` Isometric Machine Builders (`machines/custom-machines.mjs`)

**Files:**
- Create: `machines/custom-machines.mjs`
- Test: `tests/custom-machines.test.mjs`

**Interfaces:**
- Consumes: `kit/iso-kit.mjs`
- Produces:
  - `buildAllCustomMachines(): Record<string, { svg: string, meta: object }>` generating dark-theme isometric SVGs (`width=1120, height=860`) with `data-anim="..."` groups for the 9 custom chapters:
    - `watch-escapement` (`ch01`): brass movement baseplate, 4 corner screws, knurled crown, ratchet & pawl, 8-segment power reserve scale, 15-tooth escapement wheel (`data-anim="escape-wheel"`), pallet fork (`data-anim="pallet-fork"`), balance wheel (`data-anim="balance-wheel"`), center/seconds wheels, lifting top bridge (`data-anim="top-bridge"`).
    - `box-to-machine` (`ch02`): folding flat diagram plate (`data-anim="flat-diagram"`) + rising twin-piston differential gearbox (`data-anim="real-machine"`, `data-anim="piston-a"`, `data-anim="piston-b"`, `data-anim="gear-rotor"`).
    - `pipeline-gantry` (`ch06`): 10-station precision assembly bed with scale ticks, 3 tier calibration weights (Figure/Hero/Epic), sliding gantry head (`data-anim="gantry-carriage"`), and 4× inspection lens (`data-anim="critic-lens"`).
    - `metaphor-carousel` (`ch07`): 5-station octagonal indexing turntable (`data-anim="turntable"`) with 5 miniature isometric mechanisms (`data-anim="meta-0"`..`data-anim="meta-4"`: Pigeonhole Sorter, Bloom Slot Machine, Mutex Interlock Tank, TCP Ropeway Cars, Temperature Roulette).
    - `camera-audit` (`ch09`): 45°/30° orthographic camera rig, 4-tone reference solids (`lo/mid/hi/lit`), split helical coil wrapping a central post (`data-anim="coil-back"`, `data-anim="center-post"`, `data-anim="coil-front"`), and laser ray-cast scanner (`data-anim="audit-rays"`).
    - `time-truth` (`ch11`): 4 proportional work-hour columns (`1h54m`, `1h57m`, `10h33m`, `14h00m`) with `1h` golden threshold collars (`data-anim="hour-one-ring"`) and sliding 4× defect magnifier carriage (`data-anim="zoom-carriage"`).
    - `code-not-pixels` (`ch12`): disintegrating pixel-grid block (`data-anim="pixel-grid"`) vs parametric SVG generator with rotating master knurled dial (`data-anim="param-knob"`) and linked cylinder/gear/gauge (`data-anim="linked-part"`).
    - `star-counter` (`ch13`): 5-drum mechanical odometer (`data-anim="drum-0"`..`data-anim="drum-4"`), star growth cam staircase, 1.4M views auxiliary dial (`data-anim="views-needle"`), and human-eye calibration slider (`data-anim="eye-slider"`).
    - `taste-foundry` (`ch14`): 3 feed rails (`155L SKILL.md`, `8 REFS`, `16,000L KIT`), hydraulic stamping press (`data-anim="press-ram"`), and outgoing conveyor of stamped precision modules (`data-anim="stamped-module"`).

- [ ] **Step 1: Write the failing test in `tests/custom-machines.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { buildAllCustomMachines } from "../machines/custom-machines.mjs";

const KEYS = [
  "watch-escapement",
  "box-to-machine",
  "pipeline-gantry",
  "metaphor-carousel",
  "camera-audit",
  "time-truth",
  "code-not-pixels",
  "star-counter",
  "taste-foundry",
];

test("buildAllCustomMachines produces rich isometric SVGs with data-anim hooks for all 9 custom machines", () => {
  const machines = buildAllCustomMachines();
  for (const key of KEYS) {
    assert.ok(machines[key], `missing machine ${key}`);
    assert.ok(machines[key].svg.startsWith("<svg"), `${key} must be an SVG`);
    const pathCount = (machines[key].svg.match(/<path /g) || []).length;
    assert.ok(pathCount >= 40, `${key} should have at least 40 SVG paths, got ${pathCount}`);
    assert.ok(machines[key].svg.includes('data-anim="'), `${key} must expose data-anim hooks`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/custom-machines.test.mjs`
Expected: FAIL (`Cannot find module '../machines/custom-machines.mjs'`)

- [ ] **Step 3: Implement `machines/custom-machines.mjs` using `kit/iso-kit.mjs`**

Use `k.fitProjection`, `k.slabOf`, `k.cylinder`, `k.extrude`, `k.knurl`, `k.coil`, `k.topTicks`, `k.radialTicks`, `k.solidSvg`, `k.lineSvg`, `k.dotsSvg`, `k.wireSvg`, and `k.faceTextSvg` to build all 9 machines in authentic Anatomy dark-theme craft style.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/custom-machines.test.mjs`
Expected: PASS

---

### Task 3: Official Examples Seamless Stage Patching & Master B-Roll Player Builder (`build-broll.mjs`)

**Files:**
- Create: `build-broll.mjs`
- Test: `tests/build-broll.test.mjs`

**Interfaces:**
- Consumes: `CHAPTERS` from `./chapters-data.mjs`, `buildAllCustomMachines()` from `./machines/custom-machines.mjs`, `ISO_CSS` from `kit/iso-kit.mjs`, and official examples from `examples/`.
- Produces:
  - `dist/assets/<name>.html` (`desk-computer.html`, `dial-indicator.html`, `ripple-tank.html`, `turning-dial.html`, `raptor-engine.html`, `arcade-cabinet.html`) patched with borderless `#111110` stage CSS and a deterministic `window.__brollDrive(action)` controller (supporting pointer glide, key dispatch like `"i"` for Raptor ignition, and 3D turn angle).
  - `dist/broll-player.html`: 1920×1080 dark-theme presentation & video player exposing `window.__renderFrame(chIndex, timeSec)`, keyboard controls (`Space`, `ArrowLeft`, `ArrowRight`, `1..4`, `KeyC`, `KeyF`), animated 4-beat slide cards, synchronized teleprompter HUD, and live isometric stage controller.

- [ ] **Step 1: Write the failing test in `tests/build-broll.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildBrollSystem } from "../build-broll.mjs";

test("buildBrollSystem writes dist/broll-player.html and patched official assets", () => {
  const out = buildBrollSystem();
  assert.ok(existsSync(out.playerPath));
  const html = readFileSync(out.playerPath, "utf8");
  assert.ok(html.includes("__renderFrame"));
  assert.ok(html.includes("ch01"));
  assert.ok(html.includes("ch15"));
  for (const asset of ["raptor-engine.html", "turning-dial.html", "arcade-cabinet.html", "ripple-tank.html", "desk-computer.html", "dial-indicator.html"]) {
    const p = join(out.assetsDir, asset);
    assert.ok(existsSync(p), `missing patched asset ${asset}`);
    assert.ok(readFileSync(p, "utf8").includes("__brollDrive"));
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/build-broll.test.mjs`
Expected: FAIL (`Cannot find module '../build-broll.mjs'`)

- [ ] **Step 3: Implement `build-broll.mjs` and run it**

Implement `buildBrollSystem()` and execute it when run directly (`node build-broll.mjs`).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/build-broll.test.mjs`
Expected: PASS

---

### Task 4: Headless Browser Verification & Deterministic MP4 Video Exporter (`scripts/verify-broll.mjs` & `scripts/export-mp4.mjs`)

**Files:**
- Create: `scripts/verify-broll.mjs`
- Create: `scripts/export-mp4.mjs`

**Interfaces:**
- Consumes: `dist/broll-player.html`
- Produces:
  - Verification screenshots `output/shots/ch01.png`..`ch15.png` at 1920×1080 with zero console errors.
  - MP4 video files `output/videos/ch01.mp4`..`ch15.mp4` (`1920×1080`, `40.0s` duration, `H.264 yuv420p`) plus a combined or per-chapter index.

- [ ] **Step 1: Implement `scripts/verify-broll.mjs` and run across all 15 chapters**

Run: `node scripts/verify-broll.mjs`
Expected: Captures 1920×1080 screenshots for `ch01`–`ch15`, prints `verified 15/15 chapters, console errors: 0`.

- [ ] **Step 2: Inspect generated screenshots with `read` tool to visually verify dark-theme fusion, typography, and isometric machines**

Read representative screenshots from `output/shots/` and refine any visual overlap or contrast issues.

- [ ] **Step 3: Implement `scripts/export-mp4.mjs` and render `output/videos/ch01.mp4`..`ch15.mp4`**

Run: `node scripts/export-mp4.mjs`
Expected: Produces `output/videos/ch01.mp4`..`ch15.mp4`, each verified via `ffprobe` as `1920x1080`, `40.0s`, `h264`.
