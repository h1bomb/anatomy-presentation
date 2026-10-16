import React from "react";
import type { Bilingual, Language, Theme } from "../types.ts";
import { t } from "../data/chapters.ts";
import {
  Volume2,
  VolumeX,
  Languages,
  Captions,
  CaptionsOff,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { cn } from "@/lib/utils.ts";

export interface TopBarProps {
  chapterNumber: string;
  chapterTitle: Bilingual;
  chapterSubtitle: Bilingual;
  beatIndex: number;
  beatLabel: Bilingual;
  clampedTime: number;
  readout: string;
  beatProgress: number;
  lang?: Language;
  onSelectBeat?: (index: number) => void;
  // Controls relocated to top-right
  isSpeechEnabled?: boolean;
  isSpeaking?: boolean;
  hasInteracted?: boolean;
  showSubtitles?: boolean;
  theme?: Theme;
  isFullscreen?: boolean;
  onToggleSpeech?: () => void;
  onToggleLang?: () => void;
  onToggleSubtitles?: () => void;
  onToggleTheme?: () => void;
  onToggleFullscreen?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  chapterNumber,
  chapterTitle,
  chapterSubtitle,
  beatIndex,
  beatLabel,
  clampedTime,
  readout,
  beatProgress,
  lang = "zh",
  onSelectBeat,
  isSpeechEnabled = true,
  isSpeaking = false,
  hasInteracted = true,
  showSubtitles = true,
  theme = "dark",
  isFullscreen = false,
  onToggleSpeech,
  onToggleLang,
  onToggleSubtitles,
  onToggleTheme,
  onToggleFullscreen,
}) => {
  const isZh = lang === "zh";
  const displayTitle = t(chapterTitle, lang);
  const displaySubtitle = t(chapterSubtitle, lang);
  const displayBeatLabel = t(beatLabel, lang);

  return (
    <header className="top-bar">
      <div className="top-left">
        <span className="fig-badge">FIG. CH-{chapterNumber} / 15</span>
        <div className="chapter-titles">
          <h1 className="chapter-main-title">{displayTitle}</h1>
          <div className="chapter-sub-title">{displaySubtitle}</div>
        </div>
      </div>

      <div className="top-center">
        <div className="beat-segments">
          {[0, 1, 2, 3].map((idx) => {
            const fillPct =
              idx < beatIndex ? 100 : idx === beatIndex ? Math.max(0, Math.min(100, beatProgress * 100)) : 0;
            return (
              <div
                key={idx}
                className="beat-seg"
                onClick={() => onSelectBeat?.(idx)}
                style={{ cursor: onSelectBeat ? "pointer" : "default" }}
                title={`Beat 0${idx + 1}`}
              >
                <div className="beat-seg-fill" style={{ width: `${fillPct.toFixed(1)}%` }} />
              </div>
            );
          })}
        </div>
        <div className="timeline-meta">
          <span>{`BEAT 0${beatIndex + 1} / 04 · ${displayBeatLabel}`}</span>
          <span>{`00:${clampedTime.toFixed(1).padStart(4, "0")} / 00:40.0`}</span>
        </div>
      </div>

      <div className="top-right">
        {/* Status Readout */}
        <div className="top-readout-cluster flex items-center gap-2">
          <span className="status-dot" />
          <span className="top-readout-text hidden xl:inline text-xs font-mono opacity-80">{readout}</span>
        </div>

        <div className="h-5 w-px bg-white/10 dark:bg-white/15 [data-theme=light]_&:bg-black/15 mx-1" />

        {/* Top-Right Icon Controls with Tooltips */}
        <TooltipProvider delayDuration={120}>
          <div className="top-actions-cluster flex items-center gap-1.5">
            {/* 1. Speech Toggle */}
            {onToggleSpeech && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleSpeech}
                    className={cn(
                      "top-bar-action-btn",
                      isSpeechEnabled && "is-active-speech"
                    )}
                    aria-label="Toggle Voice Reading"
                  >
                    {isSpeechEnabled ? (
                      <Volume2 className={cn("size-4", isSpeaking && "animate-pulse")} />
                    ) : (
                      <VolumeX className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <p>
                    {!hasInteracted && isSpeechEnabled
                      ? isZh ? "点击开启原声语音朗读" : "Click to enable voice narration"
                      : isSpeechEnabled
                      ? isSpeaking
                        ? isZh ? "语音朗读中 (点击静音)" : "Voice Speaking (Click to mute)"
                        : isZh ? "语音朗读已开启 (点击静音)" : "Voice Active (Click to mute)"
                      : isZh ? "语音朗读已静音 (点击开启)" : "Voice Muted (Click to enable)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* 2. Language Switcher */}
            {onToggleLang && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleLang}
                    className="top-bar-action-btn"
                    aria-label="Toggle Language"
                  >
                    <Languages className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <p>{isZh ? "切换为英文 (Switch to EN)" : "切换为中文 (Switch to ZH)"}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* 3. Subtitles Toggle */}
            {onToggleSubtitles && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleSubtitles}
                    className={cn(
                      "top-bar-action-btn",
                      showSubtitles && "is-active-sub"
                    )}
                    aria-label="Toggle Subtitles"
                  >
                    {showSubtitles ? <Captions className="size-4" /> : <CaptionsOff className="size-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <p>
                    {isZh
                      ? showSubtitles
                        ? "隐藏字幕 (快捷键 C)"
                        : "显示字幕 (快捷键 C)"
                      : showSubtitles
                      ? "Hide Subtitles (C)"
                      : "Show Subtitles (C)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* 4. Theme Toggle */}
            {onToggleTheme && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleTheme}
                    className="top-bar-action-btn"
                    aria-label="Toggle Theme"
                  >
                    {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <p>
                    {isZh
                      ? theme === "dark"
                        ? "切换为浅色模式"
                        : "切换为深色模式"
                      : theme === "dark"
                      ? "Switch to Light Mode"
                      : "Switch to Dark Mode"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* 5. Fullscreen Toggle */}
            {onToggleFullscreen && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleFullscreen}
                    className="top-bar-action-btn"
                    aria-label="Toggle Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <p>
                    {isZh
                      ? isFullscreen
                        ? "退出全屏 (ESC)"
                        : "全屏模式 (快捷键 F)"
                      : isFullscreen
                      ? "Exit Fullscreen (ESC)"
                      : "Fullscreen Mode (F)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* 6. GitHub Repository */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    window.open(
                      "https://github.com/h1bomb/anatomy-presentation",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="top-bar-action-btn"
                  aria-label="GitHub Repository"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                <p>{isZh ? "GitHub 开源仓库" : "GitHub Repository"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
};
