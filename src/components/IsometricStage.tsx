import React, { Suspense, useEffect, useRef, useMemo, useState } from "react";
import { getFigureComponent } from "../machines/figure-loader.tsx";
import { StageSkeleton } from "./LoadingScreen.tsx";
import type { Beat, Chapter, Language, Theme } from "../types.ts";
import { t, tList } from "../data/chapters.ts";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { cn } from "@/lib/utils.ts";

export interface IsometricStageProps {
  chapter: Chapter;
  activeBeat: Beat;
  beatIndex: number;
  beatProgress: number;
  clampedTime: number;
  figureKey: string;
  isExportMode?: boolean;
  dtMs?: number;
  theme?: Theme;
  lang?: Language;
  // Playback navigation controls
  isPlaying?: boolean;
  onPrevChapter?: () => void;
  onTogglePlay?: () => void;
  onNextChapter?: () => void;
}

export const IsometricStage: React.FC<IsometricStageProps> = ({
  chapter,
  activeBeat,
  beatIndex,
  beatProgress,
  clampedTime,
  figureKey,
  isExportMode = false,
  dtMs = 33.333,
  theme = "dark",
  lang = "zh",
  isPlaying = true,
  onPrevChapter,
  onTogglePlay,
  onNextChapter,
}) => {
  const rigRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastCueKey = useRef<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isIframe = figureKey.startsWith("iframe:");
  const iframeAsset = isIframe ? figureKey.replace("iframe:", "") : "";
  const FigureComp = useMemo(() => (!isIframe ? getFigureComponent(figureKey) : null), [figureKey, isIframe]);

  // Camera transform with gentle floating drift
  const cameraTransform = useMemo(() => {
    const driftX = Math.sin(clampedTime * 0.35) * 5;
    const driftY = Math.cos(clampedTime * 0.35) * 3.5;
    if (chapter.id === "ch01" && beatIndex === 1) {
      return `translate(${(driftX - 18).toFixed(1)}px, ${(driftY + 10).toFixed(1)}px) scale(1.14)`;
    }
    if (chapter.id === "ch04" && beatIndex === 3) {
      return `translate(${(driftX - 24).toFixed(1)}px, ${(driftY + 14).toFixed(1)}px) scale(1.18)`;
    }
    if (chapter.id === "ch10" && beatIndex === 2) {
      return `translate(${(driftX - 26).toFixed(1)}px, ${(driftY + 14).toFixed(1)}px) scale(1.22)`;
    }
    return `translate(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px) scale(1.03)`;
  }, [chapter.id, beatIndex, clampedTime]);

  const figureTokens = useMemo(() => {
    if (theme === "light") {
      return {
        "--anatomy-page": "#f5f4ef",
        "--anatomy-card": "#ffffff",
        "--anatomy-paper": "#ffffff",
        "--anatomy-face": "#f0efe8",
        "--anatomy-top": "#e6e5dc",
        "--anatomy-shade-0": "#faf9f4",
        "--anatomy-shade-1": "#f3f2eb",
        "--anatomy-shade-2": "#ebeae2",
        "--anatomy-shade-3": "#deddd4",
        "--anatomy-lit-top": "#ffffff",
        "--anatomy-lit-shade": "#f2f1ea",
        "--anatomy-hi": "#111110",
        "--anatomy-mid": "#686760",
        "--anatomy-lo": "#9e9d95",
        "--anatomy-faint": "#deddd6",
        "--anatomy-lit": "#000000",
      };
    }
    return {
      "--anatomy-page": "#111110",
      "--anatomy-card": "#111110",
      "--anatomy-paper": "#111110",
      "--anatomy-face": "#1d1d1b",
      "--anatomy-top": "#21211e",
      "--anatomy-shade-0": "#0e0e0d",
      "--anatomy-shade-1": "#131311",
      "--anatomy-shade-2": "#171715",
      "--anatomy-shade-3": "#1c1c19",
      "--anatomy-lit-top": "#2c2c28",
      "--anatomy-lit-shade": "#22221f",
      "--anatomy-hi": "#d8d7d0",
      "--anatomy-mid": "#73726b",
      "--anatomy-lo": "#43423d",
      "--anatomy-faint": "#2b2a27",
      "--anatomy-lit": "#f3f2ed",
    };
  }, [theme]);

  // Synchronize dynamic stage cues to mounted figure or iframe
  useEffect(() => {
    // 1. Drive official <Watch /> figure in Chapter 01 (Winding, 1/20x Slow-Mo, Exploded Bridges)
    if (!isIframe && figureKey === "watch" && mountRef.current) {
      const fireWatchKey = (key: string, shiftKey = false) => {
        const stageEl = mountRef.current?.querySelector(".iso-stage") as HTMLElement | null;
        if (!stageEl) return false;
        stageEl.dispatchEvent(
          new KeyboardEvent("keydown", {
            key,
            code: key === "Escape" ? "Escape" : `Key${key.toUpperCase()}`,
            shiftKey,
            bubbles: true,
            cancelable: true,
          })
        );
        return true;
      };

      const cue = activeBeat.stageCue;
      if (cue !== lastCueKey.current) {
        const applyCue = () => {
          if (!fireWatchKey("Escape")) return false;
          if (cue === "WATCH_WIND") {
            fireWatchKey("w", true);
          } else if (cue === "WATCH_SLOW") {
            fireWatchKey("s");
          } else if (cue === "WATCH_APART") {
            fireWatchKey("e");
          }
          lastCueKey.current = cue;
          return true;
        };

        if (!applyCue()) {
          const timer = window.setTimeout(applyCue, 180);
          return () => window.clearTimeout(timer);
        }
      }

      // Continue winding crown periodically during WATCH_WIND beat
      if (cue === "WATCH_WIND") {
        const windInterval = window.setInterval(() => {
          fireWatchKey("w", true);
        }, 1400);
        return () => window.clearInterval(windInterval);
      }
      return;
    }

    // 2. Drive embedded official iframe figures (raptor-engine.html, turning-dial.html)
    if (!isIframe || !iframeRef.current) return;
    const iframe = iframeRef.current;

    const applyIframeCue = () => {
      try {
        const doc = iframe.contentDocument;
        const win = iframe.contentWindow as any;
        if (!doc || !win) return;

        // Sync theme and transparency to iframe
        const paperBg = theme === "light" ? "#f5f4ef" : "#111110";
        const cardBg = theme === "light" ? "#ffffff" : "#111110";
        doc.documentElement.setAttribute("data-theme", theme);
        doc.documentElement.style.setProperty("color-scheme", "normal", "important");
        doc.documentElement.style.setProperty("background", "transparent", "important");
        doc.documentElement.style.setProperty("--anatomy-paper", paperBg, "important");
        doc.documentElement.style.setProperty("--anatomy-card", cardBg, "important");
        if (doc.body) {
          doc.body.setAttribute("data-theme", theme);
          doc.body.style.setProperty("color-scheme", "normal", "important");
          doc.body.style.setProperty("background", "transparent", "important");
          doc.body.style.setProperty("--anatomy-paper", paperBg, "important");
          doc.body.style.setProperty("--anatomy-card", cardBg, "important");
        }
        doc.querySelectorAll<HTMLElement>(".iso-plate, .rp-card, .td-card").forEach((el) => {
          el.style.setProperty("--anatomy-paper", paperBg, "important");
          el.style.setProperty("--anatomy-card", cardBg, "important");
          el.style.setProperty("background", "transparent", "important");
        });

        if (isExportMode && typeof win.__brollDrive === "function") {
          win.__brollDrive(activeBeat.stageCue, clampedTime, beatProgress, dtMs);
          return;
        }

        const stage = doc.querySelector(".rp-stage, .td-stage, .iso-plate") as HTMLElement | null;
        if (!stage) return;

        const firePtr = (type: string, fx: number, fy: number) => {
          const rect = stage.getBoundingClientRect();
          if (rect.width === 0) return;
          stage.dispatchEvent(
            new PointerEvent(type, {
              bubbles: true,
              cancelable: true,
              pointerId: 1,
              isPrimary: true,
              clientX: rect.left + rect.width * fx,
              clientY: rect.top + rect.height * fy,
              buttons: type === "pointerup" ? 0 : 1,
            })
          );
        };

        if (activeBeat.stageCue === "RAPTOR_EXPLODE") {
          const shutdownBtn = doc.querySelector("[data-fire]") as HTMLElement | null;
          const aria = stage.getAttribute("aria-valuetext") || "";
          if (aria.includes("firing") && shutdownBtn) {
            shutdownBtn.click();
          }
          firePtr("pointerenter", 0.5, 0.45);
          firePtr("pointermove", 0.48 + Math.sin(clampedTime) * 0.06, 0.45);
        } else if (activeBeat.stageCue === "RAPTOR_IGNITE") {
          firePtr("pointerleave", 0.05, 0.05);
          const aria = stage.getAttribute("aria-valuetext") || "";
          if (!aria.includes("firing")) {
            const btn = doc.querySelector("[data-fire]") as HTMLElement | null;
            if (btn) {
              btn.click();
            } else {
              stage.dispatchEvent(
                new KeyboardEvent("keydown", { key: "i", code: "KeyI", bubbles: true, cancelable: true })
              );
            }
          }
        }
      } catch {
        // Cross-origin safety
      }
    };

    const curCue = `${figureKey}:${activeBeat.stageCue}:${theme}:${Math.floor(clampedTime)}`;
    if (curCue !== lastCueKey.current) {
      lastCueKey.current = curCue;
      applyIframeCue();
    }

    const onLoad = () => applyIframeCue();
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [figureKey, activeBeat.stageCue, clampedTime, beatProgress, dtMs, isIframe, isExportMode, theme]);

  const metricsText = tList(activeBeat.metrics, lang).join(" · ");
  const subtitleText = t(chapter.subtitle, lang);

  return (
    <section
      className="isometric-stage-wrap group relative overflow-hidden"
      aria-label="Anatomy Isometric Animation Stage"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="stage-hud-overlay">
        <div className="stage-cue-pill">
          {`FIGURE · ${figureKey.replace("iframe:", "").replace(".html", "").toUpperCase()} · ${activeBeat.stageCue}`}
        </div>
        <div className="stage-spec-box">
          {`${subtitleText} · ${metricsText}`}
        </div>
      </div>

      <div
        ref={rigRef}
        className="stage-camera-rig"
        style={{ transform: cameraTransform }}
      >
        {isIframe ? (
          <iframe
            ref={iframeRef}
            className="official-stage-iframe is-active"
            src={`assets/${iframeAsset}`}
            title={iframeAsset}
          />
        ) : (
          <div ref={mountRef} className="official-pkg-mount" style={{ width: "100%", maxWidth: "920px", margin: "0 auto" }}>
            {FigureComp ? (
              <Suspense fallback={<StageSkeleton label={`MOUNTING [${figureKey.toUpperCase()}]...`} />}>
                <FigureComp
                  theme={theme}
                  tokens={figureTokens}
                  style={{ width: "100%", maxWidth: "920px", margin: "0 auto", display: "block" }}
                />
              </Suspense>
            ) : (
              <StageSkeleton label={`FIGURE [${figureKey}] STANDBY`} />
            )}
          </div>
        )}
      </div>

      {/* Centered Floating Playback Bar (Visible on Hover over Stage, Always Visible on Mobile/Touch) */}
      {!isExportMode && onTogglePlay && (
        <TooltipProvider delayDuration={120}>
          <div
            className={cn(
              "stage-hover-playback-bar",
              "absolute bottom-6 max-lg:bottom-2.5 left-1/2 -translate-x-1/2 z-30",
              "transition-all duration-300 ease-out",
              "max-lg:opacity-100 max-lg:translate-y-0 max-lg:pointer-events-auto",
              isHovered
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border transition-colors",
                theme === "light"
                  ? "bg-white/92 border-black/15 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                  : "bg-neutral-900/85 border-white/15 shadow-2xl"
              )}
            >
              {/* Previous Page */}
              {onPrevChapter && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onPrevChapter}
                      className={cn(
                        "h-8 w-8 rounded-full active:scale-95 transition-all",
                        theme === "light"
                          ? "text-neutral-700 hover:text-neutral-950 hover:bg-black/8"
                          : "text-neutral-300 hover:text-white hover:bg-white/15"
                      )}
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{lang === "zh" ? "上一页 (← 方向键)" : "Previous Page (Left Arrow)"}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <div
                className={cn(
                  "h-4 w-px mx-0.5",
                  theme === "light" ? "bg-black/15" : "bg-white/20"
                )}
              />

              {/* Play / Pause */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onTogglePlay}
                    className={cn(
                      "h-9 w-9 rounded-full active:scale-95 transition-all",
                      theme === "light"
                        ? isPlaying
                          ? "bg-amber-500/18 text-amber-800 border border-amber-600/45 hover:bg-amber-500/28 hover:text-amber-950"
                          : "bg-black/6 text-neutral-800 hover:bg-black/12 hover:text-neutral-950"
                        : isPlaying
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 hover:text-amber-200"
                        : "bg-white/10 text-neutral-100 hover:bg-white/20 hover:text-white"
                    )}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="size-4" />
                    ) : (
                      <Play className="size-4 fill-current ml-0.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>
                    {isPlaying
                      ? lang === "zh"
                        ? "暂停 (空格键)"
                        : "Pause (Space)"
                      : lang === "zh"
                      ? "播放 (空格键)"
                      : "Play (Space)"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <div
                className={cn(
                  "h-4 w-px mx-0.5",
                  theme === "light" ? "bg-black/15" : "bg-white/20"
                )}
              />

              {/* Next Page */}
              {onNextChapter && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onNextChapter}
                      className={cn(
                        "h-8 w-8 rounded-full active:scale-95 transition-all",
                        theme === "light"
                          ? "text-neutral-700 hover:text-neutral-950 hover:bg-black/8"
                          : "text-neutral-300 hover:text-white hover:bg-white/15"
                      )}
                      aria-label="Next Page"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{lang === "zh" ? "下一页 (→ 方向键)" : "Next Page (Right Arrow)"}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </TooltipProvider>
      )}
    </section>
  );
};
