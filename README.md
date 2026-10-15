<div align="center">

# Anatomy Presentation & Isometric B-Roll Player

**High-precision 1920×1080 interactive presentation and B-Roll broadcasting system covering the entire 15-chapter deep dive into Anatomy.**

[![CI](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml/badge.svg)](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-e5a93c.svg)](package.json)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.18.0-339933?logo=node.js&logoColor=white)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6?logo=typescript&logoColor=white)](tsconfig.json)
[![React 19](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v7-ca4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Web Speech API](https://img.shields.io/badge/Web_Speech_API-native-e5a93c)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![Tests](https://img.shields.io/badge/tests-5%2F5%20passing-brightgreen)](tests/)
[![Live Demo](https://img.shields.io/badge/live%20demo-anatomy.easynote.cc-e5a93c?style=flat&logo=safari&logoColor=white)](https://anatomy.easynote.cc)

**English** · [简体中文](README_zh.md)

<br/>

[![Anatomy Presentation Player](docs/preview.png)](https://anatomy.easynote.cc)

*Live interactive watch movement calibre 15T with 4-beat slide narrative, real-time telemetry, 3D mechanical keycaps, and synchronized teleprompter HUD.*

</div>

---

## Overview

**Anatomy Presentation & Isometric B-Roll Player** is a next-generation interactive presentation system built specifically for the 15-chapter video breakdown of Anatomy. Built on **TypeScript 5+, React 19, Vite 8, Tailwind CSS v4, and React Router v7**, it delivers an uncompromising dark/light dual-theme aesthetic, zero-white-screen initial load, per-chapter lazy loading, and complete bilingual copy.

### Key Highlights

- 🌐 **Live Interactive Site**: [https://anatomy.easynote.cc](https://anatomy.easynote.cc)
- 🌏 **Full Bilingual Copy (中英双语)**: Complete synchronized Chinese and English text across all 15 chapters, 60 beats, titles, theses, metrics, and scripts.
- 🌓 **Dual Theme Engine (深色/浅色主题)**: Seamlessly toggle between dark (`#111110`) and light (`#f5f4ef`) palettes via the bottom-right dock.
- ⌨️ **3D Mechanical Keycaps (机械键盘按钮样式)**: Realistic tactile keyboard keycaps with beveled borders, depth shadows, active click feedback, and enlarged high-contrast typography.
- 🎙️ **Web Speech API Voiceover (浏览器语音朗读)**: Native in-browser voice synthesis reads chapter script narrations in `zh-CN` or `en-US` with start/stop/pause controls.
- ◀▶ **Chapter Navigation Controls (上一页下一页按钮)**: Dedicated prev/next chapter buttons alongside keyboard arrow keys.
- 🎨 **Tailwind CSS v4 Integration**: Clean utility-first styling powered by `@tailwindcss/vite`.
- 🛡️ **Zero JavaScript Policy (纯 TypeScript)**: 100% TypeScript codebase with zero `.js` / `.mjs` files in source; tests run natively in Node.js 22+ via `--experimental-strip-types`.
- 🖥️ **Responsive 1920×1080 Stage**: Fixed 16:9 physical coordinate canvas scaled dynamically with matrix transforms to fit any display window.
- ⚡ **Instant Loading Experience**: Inline CSS skeleton loader renders in `< 10ms` before JavaScript parses, eliminating initial white screens.
- 📦 **Per-Figure Code Splitting**: 48 vector & 3D isometric components dynamically imported via `React.lazy()`.

---

## Performance Benchmarks

| Metric | Monolithic Bundle (Before) | Modular Code-Split (After) | Improvement |
| :--- | :--- | :--- | :--- |
| **Initial Bundle Size** | 21.1 MB (synchronous JS) | **130 KB (gzip)** | **160× smaller** |
| **First Contentful Paint (FCP)** | 5,000 ~ 15,000 ms | **< 10 ms** (inline skeleton) | **Instant Paint** |
| **Figure Loading** | Bundled synchronously | On-demand dynamic import (`React.lazy`) | Loads only current chapter chunk |
| **Asset Transition** | White flash on navigation | Suspense skeleton with HUD pulse ring | Seamless dark transition |
| **Language & Theme Switching** | N/A | Instant DOM attribute update | Zero page reload |

---

## Interactive Controls

All controls are available via keyboard shortcuts and clickable 3D mechanical keycaps in the bottom-right dock:

| Control | Shortcut | Action | Description |
| :---: | :---: | :--- | :--- |
| **PREV** | <kbd>←</kbd> | **Previous Chapter** | Return to previous chapter |
| **PLAY / PAUSE** | <kbd>Space</kbd> | **Play / Pause** | Toggle playback loop for the current chapter |
| **NEXT** | <kbd>→</kbd> | **Next Chapter** | Advance to next chapter and update browser route (`/ch01` → `/ch02`) |
| **VOICE** | Click | **Toggle Voiceover** | Enable/disable Web Speech API automatic voice reading |
| **LANG** | Click | **Toggle Language** | Switch between 中文 (Chinese) and English |
| **THEME** | Click | **Toggle Theme** | Switch between Dark (`#111110`) and Light (`#f5f4ef`) |
| **BEAT** | <kbd>1</kbd> ~ <kbd>4</kbd> | **Jump to Beat** | Jump to Beat 01 (0s), Beat 02 (10s), Beat 03 (20s), or Beat 04 (30s) |
| **CC** | <kbd>C</kbd> | **Toggle Captions** | Show or hide the bottom karaoke teleprompter bar |
| **FULL** | <kbd>F</kbd> | **Fullscreen** | Enter or exit full-screen presentation mode |

---

## Technical Architecture

```
anatomy-presentation/
├── index.html                  # Instant inline CSS skeleton loader (<3KB) & Vite mount point
├── vite.config.ts              # Vite 8 config with Tailwind CSS v4 & manual chunk splitting
├── tsconfig.json               # TypeScript strict compiler config (allowImportingTsExtensions)
├── package.json                # "engines": { "node": ">=22.18.0" }, native TS test script
├── public/
│   └── assets/                 # Patched standalone 3D isometric models (raptor-engine, etc.)
├── src/
│   ├── main.tsx                # Application entrypoint & virtual clock hook
│   ├── router.tsx              # React Router v7 route definitions (/ch01 ~ /ch15)
│   ├── App.tsx                 # Auto-fit viewport scale container & layout
│   ├── App.css                 # Tailwind CSS v4, dark/light theme tokens, 3D mechanical keycaps
│   ├── types.ts                # Strong typing: Language, Theme, Chapter, Beat, Bilingual
│   ├── data/
│   │   └── chapters.ts         # Complete bilingual metadata, scripts, and cues for 15 chapters
│   ├── kit/
│   │   ├── iso-kit.ts          # Pure TypeScript isometric geometry & projection engine
│   │   └── iso.css             # Official Anatomy design tokens and CSS variables
│   ├── machines/
│   │   ├── figure-loader.tsx   # React.lazy() registry for 48 official figures
│   │   └── custom-machines.ts  # 9 custom isometric machines written in strict TypeScript
│   ├── components/
│   │   ├── TopBar.tsx          # Bilingual header, FIG badge, beat segments & telemetry
│   │   ├── SlideNarrative.tsx  # Thesis banner, 4 synchronized beat cards & key takeaway
│   │   ├── Teleprompter.tsx    # Synchronized karaoke voiceover line & keyboard hints
│   │   ├── IsometricStage.tsx  # Dynamic figure loader with Suspense fallback & camera rig
│   │   ├── ControlsDock.tsx    # Bottom-right dock with 3D mechanical keycaps
│   │   ├── LoadingScreen.tsx   # HUD skeleton & fullscreen loading spinner
│   │   └── CornerMarks.tsx     # 4 technical corner crosshairs
│   └── pages/
│       └── ChapterPlayer.tsx   # Master chapter player driving timeline, speech synthesis & controls
└── tests/
    ├── chapters-data.test.ts   # Verifies 15 chapters, beat boundaries, and bilingual copy
    ├── custom-machines.test.ts # Verifies SVG isometric machine builders (TypeScript)
    ├── i18n-theme-speech.test.ts # Verifies Chinese/English parity & speech properties
    └── vite-build.test.ts      # Verifies code-splitting and instant loading screen
```

---

## Getting Started

### Prerequisites

- **Node.js**: `>= 22.18.0` (required for native TypeScript `--experimental-strip-types`)
- **npm**: `>= 10.0.0`

### Installation

```bash
git clone https://github.com/h1bomb/anatomy-presentation.git
cd anatomy-presentation
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to interact with the presentation player.

### Native TypeScript Tests

Tests run directly on `.ts` files with Node.js 22+ type stripping — zero transpilation or compilation step needed:

```bash
npm test
```

### Production Build

```bash
npm run build
npm run preview
```

---

## License

ISC License. Based on the Anatomy visual explanation system.
