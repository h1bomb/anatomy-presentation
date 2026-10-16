<div align="center">

# Anatomy Presentation & Isometric B-Roll Player

**Full-screen interactive presentation and B-Roll broadcasting system covering the 15-chapter deep dive into Anatomy.**

[![CI](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml/badge.svg)](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-e5a93c.svg)](package.json)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.18.0-339933?logo=node.js&logoColor=white)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6?logo=typescript&logoColor=white)](tsconfig.json)
[![React 19](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix_UI-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v7-ca4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Studio Voiceover](https://img.shields.io/badge/Voiceover-120_Studio_Tracks-e5a93c)](#studio-voiceover--audio-pipeline)
[![Tests](https://img.shields.io/badge/tests-6%2F6%20passing-brightgreen)](tests/)
[![Live Demo](https://img.shields.io/badge/live%20demo-anatomy.easynote.cc-e5a93c?style=flat&logo=safari&logoColor=white)](https://anatomy.easynote.cc)

**English** · [简体中文](README_zh.md)

<br/>

[![Anatomy Presentation Player](docs/preview.png)](https://anatomy.easynote.cc)

*Live interactive mechanical watch movement (`watch`) with 4-beat slide narrative, real-time stage telemetry, audio-locked karaoke teleprompter, and hover playback controls.*

</div>

---

## Overview

**Anatomy Presentation & Isometric B-Roll Player** is an interactive presentation and B-Roll broadcasting system built for the 15-chapter breakdown of **Anatomy** (by Ryan). Built with **TypeScript 5+, React 19, Vite 8, Tailwind CSS v4, shadcn/ui, and React Router v7**, it combines 48 lazy-loaded official isometric figures and standalone 3D WebGL/SVG assemblies with 120 pre-synthesized bilingual studio voiceover tracks.

### Key Highlights

- 🌐 **Live Interactive Site**: [https://anatomy.easynote.cc](https://anatomy.easynote.cc)
- 🎙️ **Pre-Synthesized Bilingual Studio Voiceover**: 120 custom studio voice tracks (`60 zh` + `60 en` in `.m4a` & `.mp3`) driven by a persistent singleton `<audio>` engine — zero robotic browser TTS fallback.
- ⏱️ **Audio-Locked Timeline & Karaoke Teleprompter**: Beat progress and character-by-character subtitle highlighting lock directly to `audio.currentTime / audio.duration`, advancing seamlessly between beats and chapters as each paragraph finishes.
- 🎬 **Choreographed Stage Cue Automation**: Right-hand isometric figures automatically respond to each beat's narration — winding the watch mainspring (`Shift+W`), switching to `1/20×` slow-motion escapement (`S`), lifting bridges (`E`), exploding SpaceX Raptor 2 into 11 assemblies (`RAPTOR_EXPLODE`), and igniting its 300-bar plume (`RAPTOR_IGNITE`).
- 🧭 **Refined HUD & Hover Controls (`shadcn/ui` + `lucide-react`)**:
  - **Top-Right Icon Toolbar**: Compact icon buttons with tooltips for Voiceover, Language (`ZH`/`EN`), Subtitles, Theme (`Dark`/`Light`), Fullscreen, and GitHub Repository.
  - **Stage-Centered Hover Playback Pill**: Translucent rounded pill (`Prev` / `Play-Pause` / `Next`) centered at the bottom of the right stage, hidden by default and revealed on stage hover.
  - **Non-Overlapping Bottom Teleprompter**: Full-width karaoke subtitle bar paired with 3D mechanical keycap shortcut hints.
- 🌓 **Full Dark & Light Theme Synchronization**: Instant switching between dark (`#111110`) and light (`#f5f4ef`) palettes across UI chrome, SVG isometric tokens, floating controls, and embedded 3D iframes.
- 🖥️ **Full-Bleed Edge-to-Edge Viewport**: Dynamically computes `--stage-scale`, `--stage-w`, and `--stage-h` to fill `100vw × 100vh` without letterbox gaps on 16:9, 16:10, or ultrawide displays, while preserving deterministic `1920×1080` coordinates in `?export=1` mode.
- 🛡️ **100% Pure TypeScript**: Zero `.js` or `.mjs` source files; unit tests execute natively in Node.js 22+ via `--experimental-strip-types`.

---

## Performance Benchmarks

| Metric | Monolithic Bundle (Before) | Modular Code-Split (After) | Improvement |
| :--- | :--- | :--- | :--- |
| **Initial JS Payload** | 21.1 MB (synchronous JS) | **~145 KB (gzip)** | **145× smaller** |
| **First Contentful Paint (FCP)** | 5,000 ~ 15,000 ms | **< 10 ms** (inline CSS skeleton) | **Instant Paint** |
| **Figure Loading** | Bundled synchronously | On-demand dynamic import (`React.lazy`) | Loads only active chapter figure |
| **Audio Continuity** | Cut off on beat switch | Singleton `<audio>` element reuse | Zero autoplay block on transitions |
| **Language & Theme Switching** | Page reload | Reactive DOM + CSS token sync | Zero reload |

---

## Interactive Controls

Controls are accessible via keyboard shortcuts, the **Top-Right Icon Toolbar**, and the **Stage Hover Playback Pill**:

| Location | Control / Icon | Shortcut | Action | Description |
| :---: | :---: | :---: | :--- | :--- |
| **Stage Hover Pill** | `ChevronLeft` | <kbd>←</kbd> | **Previous Chapter** | Navigate to the previous chapter |
| **Stage Hover Pill** | `Play` / `Pause` | <kbd>Space</kbd> | **Play / Pause** | Toggle chapter playback and voice narration |
| **Stage Hover Pill** | `ChevronRight` | <kbd>→</kbd> | **Next Chapter** | Advance to the next chapter (`/ch01` → `/ch02`) |
| **Timeline / Cards** | Beat `01`–`04` | <kbd>1</kbd> ~ <kbd>4</kbd> | **Select Beat** | Jump directly to Beat 01, 02, 03, or 04 |
| **Top-Right Toolbar** | `Volume2` / `VolumeX` | Click | **Toggle Voiceover** | Enable or mute studio audio narration |
| **Top-Right Toolbar** | `Languages` | Click | **Toggle Language** | Switch all UI copy, subtitles, and audio between `ZH` and `EN` |
| **Top-Right Toolbar** | `Captions` | <kbd>C</kbd> | **Toggle Subtitles** | Show or hide the bottom karaoke teleprompter bar |
| **Top-Right Toolbar** | `Sun` / `Moon` | Click | **Toggle Theme** | Switch between Dark (`#111110`) and Light (`#f5f4ef`) themes |
| **Top-Right Toolbar** | `Maximize2` | <kbd>F</kbd> | **Fullscreen** | Enter or exit fullscreen presentation mode |
| **Top-Right Toolbar** | `GitHub` | Click | **GitHub Repo** | Open `https://github.com/h1bomb/anatomy-presentation` |

---

## Technical Architecture

```text
anatomy-presentation/
├── index.html                        # Instant inline CSS skeleton (<3KB), favicon & Vite mount point
├── vite.config.ts                    # Vite 8 config with Tailwind CSS v4, @ alias & chunk splitting
├── tsconfig.json                     # Strict TypeScript compiler configuration
├── package.json                      # Node >= 22.18.0, native TypeScript test & build scripts
├── scripts/
│   └── generate-minimax-audio.ts     # Batch T2A studio voiceover generator (env-configured)
├── public/
│   ├── favicon.svg / favicon.ico     # Isometric mechanical movement blueprint favicon
│   ├── assets/                       # Standalone 3D WebGL/SVG figures (raptor-engine, turning-dial, etc.)
│   └── audio/
│       ├── zh/                       # 60 Chinese voiceover tracks (ch01_0..ch15_3 in .m4a & .mp3)
│       └── en/                       # 60 English voiceover tracks (ch01_0..ch15_3 in .m4a & .mp3)
├── src/
│   ├── main.tsx                      # Application entrypoint & virtual clock bootstrap
│   ├── router.tsx                    # React Router v7 routes (/ch01 ~ /ch15)
│   ├── App.tsx                       # Full-bleed viewport scaler (--stage-scale, --stage-w, --stage-h)
│   ├── App.css                       # Tailwind CSS v4, dark/light tokens, HUD & keycap styles
│   ├── types.ts                      # Core TypeScript interfaces (Chapter, Beat, Bilingual, Theme)
│   ├── data/
│   │   └── chapters.ts               # Authentic 15-chapter bilingual script, metrics, readout & figure mapping
│   ├── utils/
│   │   └── speech.ts                 # Singleton HTMLAudioElement narrator & Web Audio chime unlock
│   ├── kit/
│   │   ├── iso-kit.ts                # Pure TypeScript isometric geometry & projection helpers
│   │   └── iso.css                   # Official Anatomy isometric CSS tokens
│   ├── machines/
│   │   ├── figure-loader.tsx         # React.lazy() registry for 48 official figures from anatomy-figures
│   │   └── custom-machines.ts        # Custom isometric SVG generators written in strict TypeScript
│   ├── components/
│   │   ├── TopBar.tsx                # Header HUD, beat progress bar & top-right shadcn icon toolbar
│   │   ├── SlideNarrative.tsx        # Thesis banner, 4 interactive beat cards & key takeaway plate
│   │   ├── IsometricStage.tsx        # Lazy figure mount, automated stage cue driver & hover playback pill
│   │   ├── Teleprompter.tsx          # Audio-synchronized karaoke subtitle bar & 3D keycap hints
│   │   ├── LoadingScreen.tsx         # Stage suspense skeleton & fullscreen loader
│   │   ├── CornerMarks.tsx           # Technical corner crosshairs
│   │   └── ui/                       # shadcn/ui Button and Tooltip components
│   └── pages/
│       └── ChapterPlayer.tsx         # Master controller synchronizing audio duration, timeline & routes
└── tests/
    ├── chapters-data.test.ts         # Verifies 15 chapters, beat structure & bilingual completeness
    ├── custom-machines.test.ts       # Verifies custom isometric SVG generation
    ├── i18n-theme-speech.test.ts     # Verifies ZH/EN parity & headless speech utility safety
    └── vite-build.test.ts            # Verifies production bundle splitting & instant skeleton
```

For an in-depth look at the rendering pipeline, audio-locked timeline state machine, and virtual clock export protocol, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Getting Started

### Prerequisites

- **Node.js**: `>= 22.18.0` (uses native `--experimental-strip-types`)
- **npm**: `>= 10.0.0`

### Installation & Local Development

```bash
git clone https://github.com/h1bomb/anatomy-presentation.git
cd anatomy-presentation
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Running Tests & Production Build

```bash
# Run native TypeScript test suite (6/6 tests)
npm test

# Type-check and build production static bundle into dist/
npm run build
npm run preview
```

---

## Studio Voiceover & Audio Pipeline

Pre-synthesized audio files are already included under `public/audio/zh/` and `public/audio/en/`. To regenerate voiceovers after editing `scriptText` in [`src/data/chapters.ts`](src/data/chapters.ts), provide your MiniMax credentials via environment variables (`ffmpeg` is required to produce `.m4a` alongside `.mp3`):

```bash
MINIMAX_API_KEY="your_api_key" \
MINIMAX_VOICE_ID="your_voice_id" \
node --experimental-strip-types scripts/generate-minimax-audio.ts
```

Optional environment variables:
- `MINIMAX_MODEL`: Defaults to `speech-2.8-hd`.
- `MINIMAX_CONCURRENCY`: Worker concurrency (defaults to `1` to respect RPM limits).
- `SKIP_RECENT_MINUTES`: Skip tracks already synthesized within the last $N$ minutes for fast resume.

---

## License

ISC License. Visual figures based on the Anatomy project by Ryan.
