# Architecture & Technical Design

> Technical architecture documentation for the Anatomy 15-Chapter Presentation & Isometric B-Roll Player.
> **English** · [简体中文](ARCHITECTURE_zh.md)

---

## 1. System Topology

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                   Browser                                    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ index.html (Inline CSS Skeleton Loader: < 10ms FCP, < 3KB, Favicon)    │  │
│  └───────────────────────────────────┬────────────────────────────────────┘  │
│                                      │ Hydrates                              │
│                                      ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ App.tsx (Full-Bleed Viewport Scaler: --stage-scale, --stage-w/h)       │  │
│  └───────────────────────────────────┬────────────────────────────────────┘  │
│                                      │                                       │
│             ┌────────────────────────┴────────────────────────┐              │
│             ▼                                                 ▼              │
│  ┌─────────────────────┐                           ┌──────────────────────┐  │
│  │   React Router v7   │                           │  Virtual Clock API   │  │
│  │   (/ch01 ~ /ch15)   │                           │   (__renderFrame)    │  │
│  └──────────┬──────────┘                           └──────────┬───────────┘  │
│             │                                                 │              │
│             ▼                                                 │              │
│  ┌────────────────────────────────────────────────────────────┴───────────┐  │
│  │ ChapterPlayer.tsx                                                      │  │
│  │ - Audio-Locked Timeline (syncs beatProgress to audio.currentTime)      │  │
│  │ - Auto Beat/Chapter Advancement on Audio Ended                         │  │
│  │ - Global Keyboard Shortcuts & Gesture Audio Unlock                     │  │
│  └──┬───────────────────┬─────────────────────────┬────────────────────┬──┘  │
│     │                   │                         │                    │     │
│     ▼                   ▼                         ▼                    ▼     │
│ ┌────────┐     ┌────────────────┐        ┌─────────────────┐  ┌────────────┐ │
│ │ TopBar │     │ SlideNarrative │        │  Teleprompter   │  │ speech.ts  │ │
│ │(shadcn │     │ (Thesis, 4     │        │ (Karaoke HUD &  │  │(Singleton  │ │
│ │Toolbar)│     │  Beat Cards)   │        │  3D Keycaps)    │  │ <audio>)   │ │
│ └────────┘     └────────────────┘        └─────────────────┘  └────────────┘ │
│                         │                                                    │
│                         ▼                                                    │
│          ┌──────────────────────────────────────────┐                        │
│          │ IsometricStage.tsx                       │                        │
│          │ - Camera Rig Floating Drift              │                        │
│          │ - Stage Hover Playback Pill (Prev/Play)  │                        │
│          │ - Automated Stage Cue Driver             │                        │
│          └──────────────┬───────────────────────────┘                        │
│                         │                                                    │
│            ┌────────────┴────────────┐                                       │
│            ▼                         ▼                                       │
│  ┌───────────────────┐     ┌────────────────────────┐                        │
│  │ figure-loader.tsx │     │ Standalone 3D Iframes  │                        │
│  │ (48 React.lazy    │     │ - raptor-engine.html   │                        │
│  │  official chunks) │     │ - turning-dial.html    │                        │
│  └───────────────────┘     └────────────────────────┘                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Zero-White-Screen Performance Strategy

### 2.1 The Legacy Monolithic Bottleneck
Bundling 48 intricate isometric SVG/3D figures into a single synchronous script previously produced a **21.1 MB** JavaScript payload, blocking initial rendering for 5–15 seconds.

### 2.2 Three-Tier Progressive Loading
1. **Tier 1: Inlined HTML Skeleton (< 10ms FCP)**:
   - Self-contained `<style>` block in `index.html` (`< 3 KB`, zero external font or CSS requests).
   - Paints the dark engineering canvas (`#111110`), pulsing dial ring, and progress bar before any JS is downloaded.
2. **Tier 2: Code-Split Core Shell**:
   - `vendor-react`: React 19 core (`~68 KB gzip`).
   - `vendor-router`: React Router v7 (`~31 KB gzip`).
   - `index`: Presentation shell, shadcn UI primitives, and chapter metadata (`~77 KB gzip`).
3. **Tier 3: On-Demand Per-Figure Chunks**:
   - All 48 official figures from `anatomy-figures` are registered via `React.lazy()` in [`src/machines/figure-loader.tsx`](../src/machines/figure-loader.tsx).
   - Switching chapters fetches only the active figure chunk while `<Suspense fallback={<StageSkeleton />}>` keeps the stage HUD stable.

---

## 3. Audio-Locked Timeline & Stage Choreography

### 3.1 Singleton Studio Audio Engine (`src/utils/speech.ts`)
- **Zero Web Speech API Fallback**: Browser `window.speechSynthesis` is permanently disabled and cancelled so rapid beat or chapter switching never triggers robotic fallback voices.
- **Persistent `<audio id="anatomy-audio-narrator">`**: Reuses a single DOM `<audio>` element across all 15 chapters and 60 beats. Once unlocked on the user's first pointer or keyboard gesture (`unlockSpeechSynthesis()`), subsequent beat and chapter transitions play automatically without browser autoplay rejections.
- **Dual-Format Pre-Synthesized Assets**: Plays `/audio/{zh,en}/chXX_Y.m4a` with automatic fallback to `.mp3`, generated via [`scripts/generate-minimax-audio.ts`](../scripts/generate-minimax-audio.ts).

### 3.2 Audio-Driven Beat Progress (`src/pages/ChapterPlayer.tsx`)
Instead of relying on a rigid 10-second wall-clock timer when voiceover is active:
- While the current beat's audio is playing (`!audio.paused && Number.isFinite(audio.duration)`), `ChapterPlayer.tsx` maps `timeSec` within the active beat $[10b, 10(b+1))$ directly to the audio completion ratio:
  $$t_{\text{sec}} = 10b + 10 \cdot \min\left(0.992, \frac{t_{\text{audio}}}{D_{\text{audio}}}\right)$$
- This guarantees that:
  - Long voiceover paragraphs (e.g. 16 seconds) progress smoothly from $0\%$ to $100\%$ without freezing at the end of a 10s window.
  - Short voiceover sentences (e.g. 6 seconds) highlight karaoke subtitles at the exact speaking rate and immediately advance to the next beat (`(b + 1) * 10 + 0.02`) or chapter as soon as `audio.onended` fires, eliminating dead air.

### 3.3 Automated Stage Cue Driver (`src/components/IsometricStage.tsx`)
`IsometricStage.tsx` translates each beat's `stageCue` into real DOM/pointer/keyboard interactions on the mounted figure:
- **Chapter 01 (`watch`)**:
  - `WATCH_WIND` (Beat 0): Dispatches `Escape` to reset state and periodically dispatches `Shift + KeyW` on `.iso-stage` to wind the mainspring and increment power reserve.
  - `WATCH_SLOW` (Beat 1): Dispatches `KeyS` to engage `1/20×` slow-motion escapement inspection.
  - `WATCH_APART` (Beat 2): Dispatches `KeyE` to elevate the top bridges along guide pillars.
  - `WATCH_FULL` (Beat 3): Dispatches `Escape` to reassemble the movement at `1×` speed.
- **Chapter 07 (`CHAPTER_FIGURES.ch07`)**:
  - Beat 0 splits dynamically at $55\%$ beat progress (`t < 5.5`), transitioning from `hash-map` (mail sorting room) to `bloom-filter` (mechanical probe array) right as the narration shifts topics.
- **Chapters 08, 11, 15 (Standalone 3D Iframe Figures)**:
  - `raptor-engine.html`: Dispatches pointer hover events on `.rp-stage` for `RAPTOR_EXPLODE` (exploding the engine into 11 assemblies) and triggers `[data-fire]` for `RAPTOR_IGNITE` (igniting the 300-bar WebGL Mach-diamond plume).
  - `turning-dial.html`: Mounts the 3D combination dial with articulated mechanical hand and synchronizes `data-theme`, `--anatomy-paper`, and `color-scheme: normal` across parent and iframe documents so light and dark themes render seamlessly.

---

## 4. Full-Bleed Edge-to-Edge Viewport Scaling

To fill $100\%$ of any display (`16:9`, `16:10` MacBook, or `21:9` ultrawide) without letterbox bars while preserving broadcast proportions:
- [`src/App.tsx`](../src/App.tsx) computes:
  $$\text{scale} = \min\left(\frac{W_{\text{avail}}}{1920}, \frac{H_{\text{avail}}}{1080}\right), \quad W_{\text{stage}} = \frac{W_{\text{avail}}}{\text{scale}}, \quad H_{\text{stage}} = \frac{H_{\text{avail}}}{\text{scale}}$$
- `.broll-viewport` uses `width: var(--stage-w); height: var(--stage-h); transform: translate(-50%, -50%) scale(var(--stage-scale));`, resulting in an exact $W_{\text{avail}} \times H_{\text{avail}}$ full-bleed canvas.
- When `?export=1` is present in the URL, $W_{\text{stage}}$ and $H_{\text{stage}}$ lock strictly to `1920px × 1080px`.

---

## 5. Deterministic Virtual Clock & Video Export

For automated video capture via Chrome DevTools Protocol (CDP):
- `window.__renderFrame(chIndex, timeSec, dtMs)` deterministically seeks to chapter `chIndex` (`0..14`) and `timeSec` (`0..40`), returning `{ chapterId, beatIndex, timeSec, figure, cue }`.
- `window.__stepOfficialClock(dtMs)` advances the virtual `requestAnimationFrame` and `performance.now()` clock by `dtMs` milliseconds per frame.
