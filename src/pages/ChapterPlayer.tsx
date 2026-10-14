import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CHAPTERS, getBeatIndex, getActiveFigureKey } from "../data/chapters";
import { TopBar } from "../components/TopBar";
import { SlideNarrative } from "../components/SlideNarrative";
import { IsometricStage } from "../components/IsometricStage";
import { Teleprompter } from "../components/Teleprompter";

export const ChapterPlayer: React.FC = () => {
  const { chapterId } = useParams<{ chapterId?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isExportMode = searchParams.get("export") === "1";
  const subtitlesParam = searchParams.get("subtitles");
  const initialTimeParam = Number(searchParams.get("t") || 0);

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
  const readout = chapter.readout(clampedTime, beatIndex);
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
        setIsPlaying((p) => !p);
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
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChapterIndex, goToChapter, selectBeat]);

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
      />

      <SlideNarrative
        thesis={chapter.thesis}
        beats={chapter.beats}
        beatIndex={beatIndex}
        beatProgress={beatProgress}
        clampedTime={clampedTime}
        takeaway={chapter.takeaway}
        isExportMode={isExportMode}
        onSelectBeat={selectBeat}
      />

      <Teleprompter
        chapterNumber={chapter.number}
        clampedTime={clampedTime}
        scriptText={activeBeat.scriptText}
        beatProgress={beatProgress}
        visible={showSubtitles}
      />
    </>
  );
};
