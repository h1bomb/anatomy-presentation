import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CHAPTERS, getActiveFigureKey } from "../src/data/chapters.ts";
import { FIGURE_REGISTRY, getFigureComponent } from "../src/machines/figure-loader.tsx";
import { cn } from "../src/lib/utils.ts";
import { Button, buttonVariants } from "../src/components/ui/button.tsx";
import { CornerMarks } from "../src/components/CornerMarks.tsx";
import { StageSkeleton, FullscreenLoading } from "../src/components/LoadingScreen.tsx";
import { Teleprompter } from "../src/components/Teleprompter.tsx";
import { SlideNarrative } from "../src/components/SlideNarrative.tsx";
import { TopBar } from "../src/components/TopBar.tsx";
import { ControlsDock } from "../src/components/ControlsDock.tsx";
import { IsometricStage } from "../src/components/IsometricStage.tsx";

const ROOT = join(import.meta.dirname, "..");

test("cn() and Button component merge Tailwind classes and render all variants/sizes", () => {
  assert.equal(cn("px-2 py-1", "px-4", false && "hidden"), "py-1 px-4");

  const defaultBtn = renderToStaticMarkup(
    React.createElement(Button, { variant: "outline", size: "icon", "aria-label": "Test" }, "X")
  );
  assert.ok(defaultBtn.includes("<button"));
  assert.ok(defaultBtn.includes("h-8 w-8"));

  const asChildBtn = renderToStaticMarkup(
    React.createElement(
      Button,
      { asChild: true, variant: "ghost", size: "sm" },
      React.createElement("a", { href: "https://github.com/h1bomb/anatomy-presentation" }, "GitHub")
    )
  );
  assert.ok(asChildBtn.startsWith("<a "));
  assert.ok(buttonVariants({ variant: "subtle", size: "lg" }).includes("backdrop-blur-sm"));
});

test("CornerMarks and LoadingScreen components render expected HUD markup", () => {
  const corners = renderToStaticMarkup(React.createElement(CornerMarks));
  assert.ok(corners.includes("corner-mark tl"));
  assert.ok(corners.includes("corner-mark br"));

  const skelDefault = renderToStaticMarkup(React.createElement(StageSkeleton));
  assert.ok(skelDefault.includes("LOADING FIGURE ASSETS..."));
  const skelCustom = renderToStaticMarkup(React.createElement(StageSkeleton, { label: "LOADING WATCH..." }));
  assert.ok(skelCustom.includes("LOADING WATCH..."));

  const fullDefault = renderToStaticMarkup(React.createElement(FullscreenLoading));
  assert.ok(fullDefault.includes("INITIALIZING ANATOMY SYSTEM..."));
  const fullCustom = renderToStaticMarkup(React.createElement(FullscreenLoading, { message: "READY" }));
  assert.ok(fullCustom.includes("READY"));
});

test("Teleprompter renders karaoke progressive text in zh/en and hides when visible=false", () => {
  const hiddenHtml = renderToStaticMarkup(
    React.createElement(Teleprompter, {
      chapterNumber: "01",
      clampedTime: 5.2,
      scriptText: CHAPTERS[0].beats[0].scriptText,
      beatProgress: 0.5,
      visible: false,
    })
  );
  assert.equal(hiddenHtml, "");

  const zhHtml = renderToStaticMarkup(
    React.createElement(Teleprompter, {
      chapterNumber: "01",
      clampedTime: 5.2,
      scriptText: CHAPTERS[0].beats[0].scriptText,
      beatProgress: 0.45,
      visible: true,
      lang: "zh",
      isSpeechEnabled: true,
    })
  );
  assert.ok(zhHtml.includes("CH01 原声解说 · 5s"));
  assert.ok(zhHtml.includes("sub-spoken"));
  assert.ok(zhHtml.includes("sub-current"));

  const enHtml = renderToStaticMarkup(
    React.createElement(Teleprompter, {
      chapterNumber: "01",
      clampedTime: 14.8,
      scriptText: CHAPTERS[0].beats[1].scriptText,
      beatProgress: 0.75,
      visible: true,
      lang: "en",
      isSpeechEnabled: false,
    })
  );
  assert.ok(enHtml.includes("CH01 SCRIPT · 14s"));
  assert.ok(enHtml.includes("Play/Pause"));
});

test("SlideNarrative renders thesis, 4 beat cards, takeaway highlight, and export-mode transitions", () => {
  const ch = CHAPTERS[0];
  const htmlZh = renderToStaticMarkup(
    React.createElement(SlideNarrative, {
      thesis: ch.thesis,
      beats: ch.beats,
      beatIndex: 3,
      beatProgress: 0.2,
      clampedTime: 30.2,
      takeaway: ch.takeaway,
      isExportMode: true,
      lang: "zh",
    })
  );
  assert.ok(htmlZh.includes("CHAPTER THESIS · 核心命题"));
  assert.ok(htmlZh.includes('data-state="done"'));
  assert.ok(htmlZh.includes('data-state="active"'));
  assert.ok(htmlZh.includes("takeaway-plate is-highlighted"));
  assert.ok(htmlZh.includes("translateX("));

  const htmlEn = renderToStaticMarkup(
    React.createElement(SlideNarrative, {
      thesis: ch.thesis,
      beats: ch.beats,
      beatIndex: 1,
      beatProgress: 0.5,
      clampedTime: 15.0,
      takeaway: ch.takeaway,
      isExportMode: false,
      lang: "en",
    })
  );
  assert.ok(htmlEn.includes("CHAPTER THESIS · CORE PROPOSITION"));
  assert.ok(htmlEn.includes('data-state="upcoming"'));
  assert.ok(htmlEn.includes("KEY TAKEAWAY · CORE LESSON"));
});

test("TopBar and ControlsDock render bilingual controls, progress segments, and GitHub link", () => {
  const ch = CHAPTERS[0];
  const noop = () => {};

  const topZh = renderToStaticMarkup(
    React.createElement(TopBar, {
      chapterNumber: ch.number,
      chapterTitle: ch.title,
      chapterSubtitle: ch.subtitle,
      beatIndex: 1,
      beatLabel: ch.beats[1].label,
      clampedTime: 15.0,
      readout: "KEY [S] · 1/20× SLOW SPEED",
      beatProgress: 0.5,
      lang: "zh",
      isSpeechEnabled: true,
      isSpeaking: true,
      hasInteracted: true,
      showSubtitles: true,
      theme: "dark",
      isFullscreen: false,
      onToggleSpeech: noop,
      onToggleLang: noop,
      onToggleSubtitles: noop,
      onToggleTheme: noop,
      onToggleFullscreen: noop,
    })
  );
  assert.ok(topZh.includes("FIG. CH-01 / 15"));
  assert.ok(topZh.includes("width:100.0%"));
  assert.ok(topZh.includes("width:50.0%"));
  assert.ok(topZh.includes("width:0.0%"));
  assert.ok(topZh.includes('aria-label="GitHub Repository"'));

  const topEnLight = renderToStaticMarkup(
    React.createElement(TopBar, {
      chapterNumber: ch.number,
      chapterTitle: ch.title,
      chapterSubtitle: ch.subtitle,
      beatIndex: 0,
      beatLabel: ch.beats[0].label,
      clampedTime: 2.0,
      readout: "OFFICIAL [watch]",
      beatProgress: 0.2,
      lang: "en",
      isSpeechEnabled: false,
      isSpeaking: false,
      hasInteracted: false,
      showSubtitles: false,
      theme: "light",
      isFullscreen: true,
      onToggleSpeech: noop,
      onToggleLang: noop,
      onToggleSubtitles: noop,
      onToggleTheme: noop,
      onToggleFullscreen: noop,
    })
  );
  assert.ok(topEnLight.includes("A Machine from a Single Prompt"));

  const dockZh = renderToStaticMarkup(
    React.createElement(ControlsDock, {
      currentChapterIndex: 0,
      totalChapters: 15,
      isPlaying: true,
      isSpeechEnabled: true,
      isSpeaking: true,
      hasInteracted: true,
      theme: "dark",
      lang: "zh",
      showSubtitles: true,
      isFullscreen: false,
      onPrevChapter: noop,
      onNextChapter: noop,
      onTogglePlay: noop,
      onToggleSpeech: noop,
      onToggleTheme: noop,
      onToggleLang: noop,
      onToggleSubtitles: noop,
      onToggleFullscreen: noop,
    })
  );
  assert.ok(dockZh.includes("朗读中"));

  const dockEn = renderToStaticMarkup(
    React.createElement(ControlsDock, {
      currentChapterIndex: 2,
      totalChapters: 15,
      isPlaying: false,
      isSpeechEnabled: false,
      isSpeaking: false,
      hasInteracted: false,
      theme: "light",
      lang: "en",
      showSubtitles: false,
      isFullscreen: true,
      onPrevChapter: noop,
      onNextChapter: noop,
      onTogglePlay: noop,
      onToggleSpeech: noop,
      onToggleTheme: noop,
      onToggleLang: noop,
      onToggleSubtitles: noop,
      onToggleFullscreen: noop,
    })
  );
  assert.ok(dockEn.includes("VOICE OFF"));
});

test("IsometricStage renders official figures, iframe figures, camera zooms, and light/dark playback pill", () => {
  const noop = () => {};

  // 1. Official figure with ch01 beat 1 camera zoom (scale 1.14) in dark mode
  const stageWatch = renderToStaticMarkup(
    React.createElement(IsometricStage, {
      chapter: CHAPTERS[0],
      activeBeat: CHAPTERS[0].beats[1],
      beatIndex: 1,
      beatProgress: 0.5,
      clampedTime: 15.0,
      figureKey: "watch",
      theme: "dark",
      lang: "zh",
      isPlaying: true,
      onPrevChapter: noop,
      onTogglePlay: noop,
      onNextChapter: noop,
    })
  );
  assert.ok(stageWatch.includes("FIGURE · WATCH · WATCH_SLOW"));
  assert.ok(stageWatch.includes("scale(1.14)"));
  assert.ok(stageWatch.includes("stage-hover-playback-bar"));

  // 2. Iframe figure (raptor-engine.html) in light mode with paused playback pill
  const stageIframe = renderToStaticMarkup(
    React.createElement(IsometricStage, {
      chapter: CHAPTERS[7],
      activeBeat: CHAPTERS[7].beats[1],
      beatIndex: 1,
      beatProgress: 0.3,
      clampedTime: 13.0,
      figureKey: "iframe:raptor-engine.html",
      theme: "light",
      lang: "en",
      isPlaying: false,
      onPrevChapter: noop,
      onTogglePlay: noop,
      onNextChapter: noop,
    })
  );
  assert.ok(stageIframe.includes('src="assets/raptor-engine.html"'));
  assert.ok(stageIframe.includes("FIGURE · RAPTOR-ENGINE · RAPTOR_EXPLODE"));
  assert.ok(stageIframe.includes("bg-white/92"));

  // 3. ch04 beat 3 and ch10 beat 2 camera zoom presets + standby fallback in export mode
  const stageCh04 = renderToStaticMarkup(
    React.createElement(IsometricStage, {
      chapter: CHAPTERS[3],
      activeBeat: CHAPTERS[3].beats[3],
      beatIndex: 3,
      beatProgress: 0.5,
      clampedTime: 35.0,
      figureKey: "unknown-key",
      isExportMode: true,
    })
  );
  assert.ok(stageCh04.includes("scale(1.18)"));
  assert.ok(stageCh04.includes("FIGURE [unknown-key] STANDBY"));
  assert.ok(!stageCh04.includes("stage-hover-playback-bar"));

  const stageCh10 = renderToStaticMarkup(
    React.createElement(IsometricStage, {
      chapter: CHAPTERS[9],
      activeBeat: CHAPTERS[9].beats[2],
      beatIndex: 2,
      beatProgress: 0.5,
      clampedTime: 25.0,
      figureKey: "turbofan",
    })
  );
  assert.ok(stageCh10.includes("scale(1.22)"));
});

test("Every figure referenced across all 15 chapters resolves to FIGURE_REGISTRY or public/assets/*.html", () => {
  assert.equal(Object.keys(FIGURE_REGISTRY).length, 48);
  assert.equal(getFigureComponent("non-existent-figure"), null);
  assert.ok(getFigureComponent("watch") !== null);

  for (const ch of CHAPTERS) {
    for (let beat = 0; beat < 4; beat++) {
      for (const offset of [1.5, 7.5]) {
        const key = getActiveFigureKey(ch.id, beat * 10 + offset, beat);
        if (key.startsWith("iframe:")) {
          const htmlFile = key.slice("iframe:".length);
          const fullPath = join(ROOT, "public", "assets", htmlFile);
          assert.ok(existsSync(fullPath), `Missing standalone iframe figure: ${fullPath}`);
        } else {
          const comp = getFigureComponent(key);
          assert.ok(comp !== null, `${ch.id} beat ${beat} references unregistered figure "${key}"`);
        }
      }
    }
  }
});

test("All 240 bilingual studio audio tracks (.m4a + .mp3), 3D iframe figures, and favicons exist and are valid", () => {
  for (const lang of ["zh", "en"] as const) {
    for (const ch of CHAPTERS) {
      for (let beat = 0; beat < 4; beat++) {
        for (const ext of ["m4a", "mp3"] as const) {
          const audioPath = join(ROOT, "public", "audio", lang, `${ch.id}_${beat}.${ext}`);
          assert.ok(existsSync(audioPath), `Missing audio asset: ${audioPath}`);
          const size = statSync(audioPath).size;
          assert.ok(size > 5000, `Audio asset too small (${size} bytes): ${audioPath}`);
        }
      }
    }
  }

  // Verify standalone 3D figures support light/dark theme sync
  const raptorHtml = readFileSync(join(ROOT, "public", "assets", "raptor-engine.html"), "utf8");
  assert.ok(raptorHtml.includes('[data-theme="light"]'), "raptor-engine.html must support light theme");
  assert.ok(raptorHtml.includes("data-fire"), "raptor-engine.html must expose [data-fire] ignition hook");

  const dialHtml = readFileSync(join(ROOT, "public", "assets", "turning-dial.html"), "utf8");
  assert.ok(dialHtml.includes('[data-theme="light"]'), "turning-dial.html must support light theme");

  // Verify favicons exist
  assert.ok(existsSync(join(ROOT, "public", "favicon.svg")), "public/favicon.svg must exist");
  assert.ok(existsSync(join(ROOT, "public", "favicon.ico")), "public/favicon.ico must exist");
});
