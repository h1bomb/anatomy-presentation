import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CHAPTERS, getBeatIndex, getActiveFigureKey, t } from "../data/chapters.ts";
import { TopBar } from "../components/TopBar.tsx";
import { SlideNarrative } from "../components/SlideNarrative.tsx";
import { IsometricStage } from "../components/IsometricStage.tsx";
import { Teleprompter } from "../components/Teleprompter.tsx";
import { playSpeech, stopSpeech, unlockSpeechSynthesis, getAudioElement } from "../utils/speech.ts";
import type { Language, Theme } from "../types.ts";

// Module-level interaction state: once user interacts, preserve across all route changes in the session
let globalUserInteracted = false;

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

  const [hasInteracted, setHasInteracted] = useState<boolean>(() => {
    return (
      globalUserInteracted ||
      (typeof window !== "undefined" && Boolean(window.__speechUnlocked))
    );
  });
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

  const isSpeakingRef = useRef<boolean>(isSpeaking);
  isSpeakingRef.current = isSpeaking;

  const isSpeechEnabledRef = useRef<boolean>(isSpeechEnabled);
  isSpeechEnabledRef.current = isSpeechEnabled;

  const currentChIndexRef = useRef<number>(currentChapterIndex);
  currentChIndexRef.current = currentChapterIndex;

  const lastSpokenKeyRef = useRef<string>("");
  const activeSpeechTargetRef = useRef<string>("");

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
      globalUserInteracted = true;
      setHasInteracted(true);
      const safeIndex = (index + CHAPTERS.length) % CHAPTERS.length;
      const targetCh = CHAPTERS[safeIndex];
      activeSpeechTargetRef.current = "";
      isSpeakingRef.current = false;
      timeSecRef.current = newTime;
      setTimeSec(newTime);
      navigate(`/${targetCh.id}`);
    },
    [navigate]
  );

  const selectBeat = useCallback((idx: number) => {
    unlockSpeechSynthesis();
    globalUserInteracted = true;
    setHasInteracted(true);
    const nextTime = idx * 10 + 0.02;
    activeSpeechTargetRef.current = "";
    isSpeakingRef.current = false;
    timeSecRef.current = nextTime;
    setTimeSec(nextTime);
  }, []);

  const startBeatNarration = useCallback(
    (chId: string, bIdx: number, textToSpeak: string, targetLang: Language) => {
      const key = `${chId}:${bIdx}:${targetLang}`;
      lastSpokenKeyRef.current = key;
      activeSpeechTargetRef.current = `${chId}:${bIdx}`;
      playSpeech(
        textToSpeak,
        targetLang,
        () => {
          isSpeakingRef.current = true;
          setIsSpeaking(true);
        },
        () => {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          if (
            isPlayingRef.current &&
            isSpeechEnabledRef.current &&
            activeSpeechTargetRef.current === `${chId}:${bIdx}`
          ) {
            if (bIdx < 3) {
              const nextBeatTime = (bIdx + 1) * 10 + 0.02;
              timeSecRef.current = nextBeatTime;
              setTimeSec(nextBeatTime);
            } else {
              const nextIndex = (currentChIndexRef.current + 1) % CHAPTERS.length;
              goToChapter(nextIndex, 0);
            }
          }
        },
        () => {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
        },
        chId,
        bIdx
      );
    },
    [goToChapter]
  );

  const handleUnlockAndPlay = useCallback(() => {
    unlockSpeechSynthesis();
    globalUserInteracted = true;
    setHasInteracted(true);
    if (isSpeechEnabled && isPlayingRef.current) {
      const text = t(activeBeat.scriptText, lang);
      startBeatNarration(chapter.id, beatIndex, text, lang);
    }
  }, [isSpeechEnabled, activeBeat.scriptText, lang, chapter.id, beatIndex, startBeatNarration]);

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
        activeSpeechTargetRef.current = "";
        isSpeakingRef.current = false;
        stopSpeech();
        setIsSpeaking(false);
      }
      return;
    }

    const speechKey = `${chapter.id}:${beatIndex}:${lang}`;
    if (speechKey !== lastSpokenKeyRef.current) {
      const text = t(activeBeat.scriptText, lang);
      startBeatNarration(chapter.id, beatIndex, text, lang);
    }
  }, [
    hasInteracted,
    chapter.id,
    beatIndex,
    lang,
    isSpeechEnabled,
    isPlaying,
    isExportMode,
    activeBeat.scriptText,
    startBeatNarration,
  ]);

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
      timeSecRef.current = clamped;
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
        const currentCh = CHAPTERS[currentChIndexRef.current] || CHAPTERS[0];
        const currentBIdx = getBeatIndex(timeSecRef.current);
        const beatStart = currentBIdx * 10;
        const beatBoundary = (currentBIdx + 1) * 10;
        const audio = getAudioElement();

        let nextTime = timeSecRef.current + dt;

        // Lock timeline progression to actual audio narration duration when active
        if (
          isSpeechEnabledRef.current &&
          isSpeakingRef.current &&
          activeSpeechTargetRef.current === `${currentCh.id}:${currentBIdx}`
        ) {
          if (audio && !audio.paused && Number.isFinite(audio.duration) && audio.duration > 0.5) {
            const audioRatio = Math.max(0, Math.min(0.992, audio.currentTime / audio.duration));
            nextTime = beatStart + audioRatio * 10;
          } else if (nextTime >= beatBoundary - 0.05) {
            nextTime = beatBoundary - 0.05;
          }
        }

        if (nextTime >= 40) {
          const nextIndex = (currentChIndexRef.current + 1) % CHAPTERS.length;
          goToChapter(nextIndex, 0);
          nextTime = 0;
        } else {
          timeSecRef.current = nextTime;
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
            activeSpeechTargetRef.current = "";
            isSpeakingRef.current = false;
            stopSpeech();
            setIsSpeaking(false);
          } else if (isSpeechEnabled) {
            const text = t(activeBeat.scriptText, lang);
            startBeatNarration(chapter.id, beatIndex, text, lang);
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
  }, [
    hasInteracted,
    currentChapterIndex,
    goToChapter,
    selectBeat,
    isSpeechEnabled,
    activeBeat.scriptText,
    lang,
    chapter.id,
    beatIndex,
    startBeatNarration,
  ]);

  const togglePlay = useCallback(() => {
    unlockSpeechSynthesis();
    if (!hasInteracted) setHasInteracted(true);
    setIsPlaying((p) => {
      const next = !p;
      if (!next) {
        activeSpeechTargetRef.current = "";
        isSpeakingRef.current = false;
        stopSpeech();
        setIsSpeaking(false);
      } else if (isSpeechEnabled) {
        const text = t(activeBeat.scriptText, lang);
        startBeatNarration(chapter.id, beatIndex, text, lang);
      }
      return next;
    });
  }, [hasInteracted, isSpeechEnabled, activeBeat.scriptText, lang, chapter.id, beatIndex, startBeatNarration]);

  const toggleSpeech = useCallback(() => {
    unlockSpeechSynthesis();
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsSpeechEnabled(true);
      try {
        localStorage.setItem("anatomy-speech", "1");
      } catch {}
      const text = t(activeBeat.scriptText, lang);
      startBeatNarration(chapter.id, beatIndex, text, lang);
      return;
    }

    setIsSpeechEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("anatomy-speech", next ? "1" : "0");
      } catch {}

      if (next) {
        // User clicked to enable speech: speak immediately in user gesture call stack
        const text = t(activeBeat.scriptText, lang);
        startBeatNarration(chapter.id, beatIndex, text, lang);
      } else {
        activeSpeechTargetRef.current = "";
        isSpeakingRef.current = false;
        stopSpeech();
        setIsSpeaking(false);
        lastSpokenKeyRef.current = "";
      }
      return next;
    });
  }, [hasInteracted, chapter.id, beatIndex, lang, activeBeat.scriptText, startBeatNarration]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const toggleLang = useCallback(() => {
    unlockSpeechSynthesis();
    if (!hasInteracted) setHasInteracted(true);
    setLang((l) => {
      const nextLang = l === "zh" ? "en" : "zh";
      if (isSpeechEnabled && isPlayingRef.current) {
        const text = t(activeBeat.scriptText, nextLang);
        startBeatNarration(chapter.id, beatIndex, text, nextLang);
      }
      return nextLang;
    });
  }, [hasInteracted, chapter.id, beatIndex, isSpeechEnabled, activeBeat.scriptText, startBeatNarration]);

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
        isSpeechEnabled={isSpeechEnabled}
        isSpeaking={isSpeaking}
        hasInteracted={hasInteracted}
        showSubtitles={showSubtitles}
        theme={theme}
        isFullscreen={isFullscreen}
        onToggleSpeech={toggleSpeech}
        onToggleLang={toggleLang}
        onToggleSubtitles={toggleSubtitles}
        onToggleTheme={toggleTheme}
        onToggleFullscreen={toggleFullscreen}
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
        isPlaying={isPlaying}
        onPrevChapter={() => goToChapter(currentChapterIndex - 1, 0)}
        onTogglePlay={togglePlay}
        onNextChapter={() => goToChapter(currentChapterIndex + 1, 0)}
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
    </>
  );
};
