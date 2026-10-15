# Architecture & Technical Design

> Technical architecture documentation for the Anatomy 15-Chapter Presentation & Isometric B-Roll Player.
> [English](ARCHITECTURE.md) · [简体中文](ARCHITECTURE_zh.md)

---

## 1. System Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Browser                                   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ index.html (Inline Skeleton Loader: < 10ms FCP, < 3KB)         │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │ Hydrates                          │
│                                    ▼                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ App.tsx (Viewport Auto-fit Matrix Scale: 1920×1080 16:9 Canvas)│   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│            ┌───────────────────────┴───────────────────────┐           │
│            ▼                                               ▼           │
│  ┌────────────────────┐                         ┌───────────────────┐  │
│  │  React Router v7   │                         │ Virtual Clock API │  │
│  │  (/ch01 ~ /ch15)   │                         │  (__renderFrame)  │  │
│  └─────────┬──────────┘                         └─────────┬─────────┘  │
│            │                                              │            │
│            ▼                                              │            │
│  ┌────────────────────────────────────────────────────────┴─────────┐  │
│  │ ChapterPlayer.tsx (40s Timeline, 4-Beat Loop, Telemetry, Keys)   │  │
│  └──────┬───────────────────────┬─────────────────────────┬─────────┘  │
│         │                       │                         │            │
│         ▼                       ▼                         ▼            │
│   ┌───────────┐         ┌──────────────┐          ┌────────────────┐   │
│   │  TopBar   │         │SlideNarrative│          │  Teleprompter  │   │
│   │  (HUD)    │         │  (4 Beats)   │          │ (Karaoke HUD)  │   │
│   └───────────┘         └──────────────┘          └────────────────┘   │
│                                 │                                      │
│                                 ▼                                      │
│                  ┌──────────────────────────────┐                      │
│                  │  IsometricStage.tsx          │                      │
│                  │  - Camera Rig Floating Drift │                      │
│                  │  - React.Suspense Skeleton   │                      │
│                  │  - Stage Cue Keyboard Driver │                      │
│                  └──────────────┬───────────────┘                      │
│                                 │ Dynamic chunk import                 │
│                                 ▼                                      │
│                  ┌──────────────────────────────┐                      │
│                  │  figure-loader.tsx           │                      │
│                  │  (48 on-demand chunks)       │                      │
│                  └──────────────────────────────┘                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Zero-White-Screen Performance Strategy

### 2.1 The Problem in Legacy Architectures
In typical data-dense visual presentations, heavy 3D or intricate vector dependencies are often bundled together. In the initial build, 48 isometric figure models resulted in a **21.1 MB** bundle. Because the `<script>` tag was loaded synchronously in `<head>`, browser HTML parsing was blocked, resulting in a blank white screen lasting between 5 to 15 seconds.

### 2.2 The Three-Tier Solution
1. **Tier 1: Inlined HTML Skeleton (< 10ms FCP)**:
   - Self-contained `<style>` block in `index.html` (no external font or stylesheet dependencies).
   - Rendered immediately into `<div id="root">` prior to any JS evaluation.
   - Features the Anatomy dark palette (`#111110`), animated pulse dial, and gold loading tracker.
2. **Tier 2: Code-Split Vendor Chunks**:
   - `vendor-react`: Shared React 19 core (`~68 KB gzip`).
   - `vendor-router`: React Router v7 (`~31 KB gzip`).
   - `index`: Core presentation shell and layout (`~25 KB gzip`).
   - Total initial load: **~130 KB (gzip)** (a 160× reduction).
3. **Tier 3: Dynamic Per-Figure Chunks**:
   - Each of the 48 figure components is registered as a `React.lazy()` dynamic import in `src/machines/figure-loader.tsx`.
   - When switching chapters, only the specific component chunk (e.g. `watch-*.js`, `~149 KB gzip`) is fetched over the network.
   - During the fetch, `<Suspense fallback={<StageSkeleton />}>` displays an inline HUD skeleton within the stage area, preserving layout stability and preventing UI flash.

---

## 3. Deterministic Virtual Clock & Video Export

For high-definition video export and automated regression testing via Chrome DevTools Protocol (CDP):
- `window.__renderFrame(chIndex, timeSec, dtMs)`:
  - Takes the exact chapter index (0..14) and time in seconds (0..40).
  - Synchronously updates beat cards, timeline progress, karaoke subtitles, and mounts the corresponding isometric figure.
  - Returns an audit payload: `{ chapterId, beatIndex, timeSec, figure, cue }`.
- `window.__stepOfficialClock(dtMs)`:
  - Replaces `requestAnimationFrame` and `performance.now` with a deterministic tick mechanism.
  - Ensures continuous particle systems, gear escapements, and 3D rotations render identically across all hardware without dropped frames.

---

## 4. Responsive Viewport Scaling

The presentation is designed for a native broadcast resolution of **1920 × 1080** (16:9).
To ensure flawless presentation across laptops, ultra-wide monitors, projectors, and mobile screens:
- CSS variables define `--stage-scale`:
  $$\text{scale} = \min\left(\frac{W_{\text{avail}}}{1920}, \frac{H_{\text{avail}}}{1080}\right)$$
- The stage container uses CSS matrix transform centering:
  ```css
  .broll-viewport {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1920px;
    height: 1080px;
    transform: translate(-50%, -50%) scale(var(--stage-scale, 1));
  }
  ```
- Resizing, zoom changes, and orientation changes recalculate `--stage-scale` via passive window listeners without layout thrashing.
