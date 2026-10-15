import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CHAPTERS, getBeatIndex, getActiveFigureKey, t } from "../data/chapters.ts";
import { TopBar } from "../components/TopBar.tsx";
import { SlideNarrative } from "../components/SlideNarrative.tsx";
import { IsometricStage } from "../components/IsometricStage.tsx";
import { Teleprompter } from "../components/Teleprompter.tsx";
import { ControlsDock } from "../components/ControlsDock.tsx";
import { playSpeech, stopSpeech, unlockSpeechSynthesis } from "../utils/speech.ts";
import type { Language, Theme } from "../types.ts";

export const ChapterPlayer: React.FC = () => {
  const { chapterId } = useParams<{ chapterId?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isExportMode = searchParams.get("export") === "1";
  const subtitlesParam = searchParams.get("subtitles");
  const initialTimeParam = Number(searchParams.get("t") || 0);
  const themeParam = (searchParams.get("theme") as Theme) || null;
  const langParam = (searchParams.get("lang") as Language) || null;

  // Language & Theme state with localStorage fallback
  const [lang, setLang] = useState<Language>(() => {
    if (langParam === "zh" || langParam === "en") return langParam;
    try {
      const stored = localStorage.getItem("anatomy-lang");
      if (stored === "zh" || stored === "en") return stored;
    } catch {}
    return "zh";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    if (themeParam === "dark" || themeParam === "light") return themeParam;
    try {
      const stored = localStorage.getItem("anatomy-theme");
      if (stored === "dark" || stored === "light") return stored;
    } catch {}
    return "dark";
  });

  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(() => {
    if (searchParams.get("speech") === "0") return false;
    if (searchParams.get("speech") === "1") return true;
    try {
      const stored = localStorage.getItem("anatomy-speech");
      if (stored === "0") return false;
      if (stored === "1") return true;
    } catch {}
    // Default to true so speech is enabled for interactive exploration
    return true;
  });

  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync theme to root DOM
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("theme-light", theme === "light");
    try {
      localStorage.setItem("anatomy-theme", theme);
    } catch {}
  }, [theme]);

  // Sync lang to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("anatomy-lang", lang);
    } catch {}
  }, [lang]);

  // Sync speech preference
  useEffect(() => {
    try {
      localStorage.setItem("anatomy-speech", isSpeechEnabled ? "1" : "0");
    } catch {}
  }, [isSpeechEnabled]);

  // Track fullscreen changes
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Find current chapter
  const currentChapterIndex = Math.max(
    0,
    CHAPTERS.findIndex((c) => c.id === (chapterId || "ch01"))
  );
  const chapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  const [timeSec, setTimeSec] = useState<number>(initialTimeParam);
  const [isPlaying, setIsPlaying] = useState<boolean>(!isExportMode);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(subtitlesParam !== "0");

  const lastWallTimeRef = useRef<number>(performance.now());
  const timeSecRef = useRef<number>(timeSec);
  timeSecRef.current = timeSec;

  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentChIndexRef = useRef<number>(currentChapterIndex);
  currentChIndexRef.current = currentChapterIndex;

  // Clamped time and beat calculation
  const clampedTime = Math.max(0, Math.min(chapter.duration - 0.001, timeSec));
  const beatIndex = getBeatIndex(clampedTime);
  const activeBeat = chapter.beats[beatIndex] || chapter.beats[0];
  const beatSpan = Math.max(0.001, activeBeat.end - activeBeat.start);
  const beatProgress = Math.max(0, Math.min(1, (clampedTime - activeBeat.start) / beatSpan));
  const readout = chapter.readout ? chapter.readout(clampedTime, beatIndex, lang) : "";
  const figureKey = getActiveFigureKey(chapter.id, clampedTime, beatIndex);

  // Jump to specific chapter and time
  const goToChapter = useCallback(
    (index: number, newTime: number = 0) => {
      unlockSpeechSynthesis();
      const safeIndex = (index + CHAPTERS.length) % CHAPTERS.length;
      const targetCh = CHAPTERS[safeIndex];
      setTimeSec(newTime);
      navigate(`/${targetCh.id}`);
    },
    [navigate]
  );

  const selectBeat = useCallback((idx: number) => {
    unlockSpeechSynthesis();
    setTimeSec(idx * 10 + 0.1);
  }, []);

  // Web Speech API synthesis effect
  const lastSpokenKeyRef = useRef<string>("");

  const handleUnlockAndPlay = useCallback(() => {
    unlockSpeechSynthesis();
    setHasInteracted(true);
    if (isSpeechEnabled && isPlayingRef.current) {
      const text = t(activeBeat.scriptText, lang);
      lastSpokenKeyRef.current = `${chapter.id}:${beatIndex}:${lang}`;
      playSpeech(
        text,
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  }, [isSpeechEnabled, activeBeat.scriptText, lang, chapter.id, beatIndex]);

  // Global user interaction wakeup: unlock browser audio context on first touch/click
  useEffect(() => {
    const onFirstGesture = () => {
      handleUnlockAndPlay();
    };

    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, [handleUnlockAndPlay]);

  // Play narration whenever beat or chapter transitions (after interaction)
  useEffect(() => {
    if (!hasInteracted || !isSpeechEnabled || !isPlaying || isExportMode) {
      if (!isSpeechEnabled || !isPlaying || isExportMode) {
        stopSpeech();
        setIsSpeaking(false);
      }
      return;
    }

    const speechKey = `${chapter.id}:${beatIndex}:${lang}`;
    if (speechKey !== lastSpokenKeyRef.current) {
      lastSpokenKeyRef.current = speechKey;
      const text = t(activeBeat.scriptText, lang);
      playSpeech(
        text,
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  }, [hasInteracted, chapter.id, beatIndex, lang, isSpeechEnabled, isPlaying, isExportMode, activeBeat.scriptText]);

  // Clean speech when unmounting
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Expose window.__renderFrame for automated video export
  useEffect(() => {
    const win = window as any;
    win.__renderFrame = (chIndex: number, tSec: number, _dtMs: number = 33.333) => {
      const safeIndex = Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(chIndex)));
      const ch = CHAPTERS[safeIndex];
      const clamped = Math.max(0, Math.min(ch.duration - 0.001, Number.isFinite(tSec) ? tSec : 0));
      const bIdx = getBeatIndex(clamped);
      const b = ch.beats[bIdx];
      const fig = getActiveFigureKey(ch.id, clamped, bIdx);

      if (safeIndex !== currentChIndexRef.current) {
        navigate(`/${ch.id}`);
      }
      setTimeSec(clamped);

      return {
        chapterId: ch.id,
        beatIndex: bIdx,
        timeSec: clamped,
        figure: fig,
        cue: b.stageCue,
      };
    };

    return () => {
      delete win.__renderFrame;
    };
  }, [navigate]);

  // Main animation playback loop
  useEffect(() => {
    if (isExportMode) return;

    let animId: number;
    lastWallTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.1, Math.max(0, (now - lastWallTimeRef.current) / 1000));
      lastWallTimeRef.current = now;

      if (isPlayingRef.current) {
        let nextTime = timeSecRef.current + dt;
        if (nextTime >= 40) {
          const nextIndex = (currentChIndexRef.current + 1) % CHAPTERS.length;
          goToChapter(nextIndex, 0);
          nextTime = 0;
        } else {
          setTimeSec(nextTime);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [goToChapter, isExportMode]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      unlockSpeechSynthesis();
      if (!hasInteracted) setHasInteracted(true);

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => {
          const next = !p;
          if (!next) {
            stopSpeech();
            setIsSpeaking(false);
          } else if (isSpeechEnabled) {
            const text = t(activeBeat.scriptText, lang);
            playSpeech(
              text,
              lang,
              () => setIsSpeaking(true),
              () => setIsSpeaking(false)
            );
          }
          return next;
        });
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        goToChapter(currentChapterIndex + 1, 0);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        goToChapter(currentChapterIndex - 1, 0);
      } else if (["Digit1", "Digit2", "Digit3", "Digit4"].includes(e.code)) {
        const beatNum = Number(e.code.replace("Digit", "")) - 1;
        selectBeat(beatNum);
      } else if (e.code === "KeyC") {
        setShowSubtitles((s) => !s);
      } else if (e.code === "KeyF") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasInteracted, currentChapterIndex, goToChapter, selectBeat, isSpeechEnabled, activeBeat.scriptText, lang]);

  const togglePlay = useCallback(() => {
    unlockSpeechSynthesis();
    if (!hasInteracted) setHasInteracted(true);
    setIsPlaying((p) => {
      const next = !p;
      if (!next) {
        stopSpeech();
        setIsSpeaking(false);
      } else if (isSpeechEnabled) {
        const text = t(activeBeat.scriptText, lang);
        playSpeech(
          text,
          lang,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
      return next;
    });
  }, [hasInteracted, isSpeechEnabled, activeBeat.scriptText, lang]);

  const toggleSpeech = useCallback(() => {
    unlockSpeechSynthesis();
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsSpeechEnabled(true);
      try {
        localStorage.setItem("anatomy-speech", "1");
      } catch {}
      const text = t(activeBeat.scriptText, lang);
      lastSpokenKeyRef.current = `${chapter.id}:${beatIndex}:${lang}`;
      playSpeech(
        text,
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
      return;
    }

    setIsSpeechEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("anatomy-speech", next ? "1" : "0");
      } catch {}

      if (next) {
        // User clicked to enable speech: speak immediately in user gesture call stack
        lastSpokenKeyRef.current = `${chapter.id}:${beatIndex}:${lang}`;
        const text = t(activeBeat.scriptText, lang);
        playSpeech(
          text,
          lang,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      } else {
        stopSpeech();
        setIsSpeaking(false);
        lastSpokenKeyRef.current = "";
      }
      return next;
    });
  }, [hasInteracted, chapter.id, beatIndex, lang, activeBeat.scriptText]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const toggleLang = useCallback(() => {
    unlockSpeechSynthesis();
    if (!hasInteracted) setHasInteracted(true);
    setLang((l) => {
      const nextLang = l === "zh" ? "en" : "zh";
      if (isSpeechEnabled && isPlayingRef.current) {
        lastSpokenKeyRef.current = `${chapter.id}:${beatIndex}:${nextLang}`;
        const text = t(activeBeat.scriptText, nextLang);
        playSpeech(
          text,
          nextLang,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
      return nextLang;
    });
  }, [hasInteracted, chapter.id, beatIndex, isSpeechEnabled, activeBeat.scriptText]);

  const toggleSubtitles = useCallback(() => {
    setShowSubtitles((s) => !s);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  return (
    <>
      <TopBar
        chapterNumber={chapter.number}
        chapterTitle={chapter.title}
        chapterSubtitle={chapter.subtitle}
        beatIndex={beatIndex}
        beatLabel={activeBeat.label}
        clampedTime={clampedTime}
        readout={readout}
        beatProgress={beatProgress}
        lang={lang}
        onSelectBeat={selectBeat}
      />

      {!hasInteracted && isSpeechEnabled && !isExportMode && (
        <div
          className="audio-unlock-banner"
          onClick={handleUnlockAndPlay}
          role="button"
          tabIndex={0}
          title={lang === "zh" ? "点击开启原声语音讲解" : "Click to enable audio voiceover"}
        >
          <span className="unlock-pulsing-dot" />
          <span className="unlock-icon">🔊</span>
          <span className="unlock-title">
            {lang === "zh" ? "点击任意处或按空格开启原声语音讲解" : "Click anywhere or press Space to enable voiceover"}
          </span>
          <kbd className="unlock-kbd">{lang === "zh" ? "点击开启" : "SPACE / CLICK"}</kbd>
        </div>
      )}

      <IsometricStage
        chapter={chapter}
        activeBeat={activeBeat}
        beatIndex={beatIndex}
        beatProgress={beatProgress}
        clampedTime={clampedTime}
        figureKey={figureKey}
        isExportMode={isExportMode}
        theme={theme}
        lang={lang}
      />

      <SlideNarrative
        thesis={chapter.thesis}
        beats={chapter.beats}
        beatIndex={beatIndex}
        beatProgress={beatProgress}
        clampedTime={clampedTime}
        takeaway={chapter.takeaway}
        isExportMode={isExportMode}
        lang={lang}
        onSelectBeat={selectBeat}
      />

      <Teleprompter
        chapterNumber={chapter.number}
        clampedTime={clampedTime}
        scriptText={activeBeat.scriptText}
        beatProgress={beatProgress}
        visible={showSubtitles}
        lang={lang}
        isSpeechEnabled={isSpeechEnabled}
      />

      <ControlsDock
        currentChapterIndex={currentChapterIndex}
        totalChapters={CHAPTERS.length}
        isPlaying={isPlaying}
        isSpeechEnabled={isSpeechEnabled}
        isSpeaking={isSpeaking}
        hasInteracted={hasInteracted}
        theme={theme}
        lang={lang}
        showSubtitles={showSubtitles}
        isFullscreen={isFullscreen}
        onPrevChapter={() => goToChapter(currentChapterIndex - 1, 0)}
        onNextChapter={() => goToChapter(currentChapterIndex + 1, 0)}
        onTogglePlay={togglePlay}
        onToggleSpeech={toggleSpeech}
        onToggleTheme={toggleTheme}
        onToggleLang={toggleLang}
        onToggleSubtitles={toggleSubtitles}
        onToggleFullscreen={toggleFullscreen}
      />
    </>
  );
};
