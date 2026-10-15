import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CHAPTERS, getBeatIndex, getActiveFigureKey } from "../data/chapters.ts";
import { TopBar } from "../components/TopBar.tsx";
import { SlideNarrative } from "../components/SlideNarrative.tsx";
import { IsometricStage } from "../components/IsometricStage.tsx";
import { Teleprompter } from "../components/Teleprompter.tsx";
import { ControlsDock } from "../components/ControlsDock.tsx";
import type { Language, Theme } from "../types.ts";

export const ChapterPlayer: React.FC = () => {
  const { chapterId } = useParams<{ chapterId?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
    if (searchParams.get("speech") === "1") return true;
    try {
      return localStorage.getItem("anatomy-speech") === "1";
    } catch {}
    return false;
  });

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
      const safeIndex = (index + CHAPTERS.length) % CHAPTERS.length;
      const targetCh = CHAPTERS[safeIndex];
      setTimeSec(newTime);
      navigate(`/${targetCh.id}`);
    },
    [navigate]
  );

  const selectBeat = useCallback((idx: number) => {
    setTimeSec(idx * 10 + 0.1);
  }, []);

  // Web Speech API synthesis effect
  const lastSpokenKeyRef = useRef<string>("");
  useEffect(() => {
    if (!isSpeechEnabled || !isPlaying || isExportMode) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const speechKey = `${chapter.id}:${beatIndex}:${lang}`;
    if (speechKey !== lastSpokenKeyRef.current) {
      lastSpokenKeyRef.current = speechKey;
      window.speechSynthesis.cancel();

      const text = typeof activeBeat.scriptText === "string"
        ? activeBeat.scriptText
        : activeBeat.scriptText[lang] || activeBeat.scriptText.zh || "";

      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === "zh" ? "zh-CN" : "en-US";
        utterance.rate = lang === "zh" ? 1.08 : 1.02;
        utterance.pitch = 1.0;

        // Try to pick a natural voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find((v) =>
          lang === "zh"
            ? (v.lang.startsWith("zh") || v.name.includes("Chinese") || v.name.includes("Ting-Ting") || v.name.includes("Sin-ji"))
            : (v.lang.startsWith("en") && (v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Google") || v.name.includes("Natural")))
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    }
  }, [chapter.id, beatIndex, lang, isSpeechEnabled, isPlaying, isExportMode, activeBeat.scriptText]);

  // Clean speech when unmounting or pausing
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
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
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => {
          if (p && typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
          }
          return !p;
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
  }, [currentChapterIndex, goToChapter, selectBeat]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      if (p && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return !p;
    });
  }, []);

  const toggleSpeech = useCallback(() => {
    setIsSpeechEnabled((s) => {
      const next = !s;
      if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "zh" ? "en" : "zh"));
  }, []);

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
