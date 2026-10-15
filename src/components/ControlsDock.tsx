import React from "react";
import type { Language, Theme } from "../types.ts";

interface ControlsDockProps {
  currentChapterIndex: number;
  totalChapters: number;
  isPlaying: boolean;
  isSpeechEnabled: boolean;
  isSpeaking?: boolean;
  hasInteracted?: boolean;
  theme: Theme;
  lang: Language;
  showSubtitles: boolean;
  isFullscreen: boolean;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onTogglePlay: () => void;
  onToggleSpeech: () => void;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onToggleSubtitles: () => void;
  onToggleFullscreen: () => void;
}

export const ControlsDock: React.FC<ControlsDockProps> = ({
  currentChapterIndex,
  totalChapters,
  isPlaying,
  isSpeechEnabled,
  isSpeaking = false,
  hasInteracted = true,
  theme,
  lang,
  showSubtitles,
  isFullscreen,
  onPrevChapter,
  onNextChapter,
  onTogglePlay,
  onToggleSpeech,
  onToggleTheme,
  onToggleLang,
  onToggleSubtitles,
  onToggleFullscreen,
}) => {
  const isZh = lang === "zh";

  return (
    <aside className="controls-dock-station" aria-label="Playback Controls and Settings">
      <div className="dock-buttons-group">
        {/* Previous Chapter */}
        <button
          type="button"
          className="keycap-btn keycap-nav"
          onClick={onPrevChapter}
          title={isZh ? "上一章 (← 方向键)" : "Previous Chapter (Left Arrow)"}
          aria-label="Previous Chapter"
        >
          <span className="keycap-symbol">◀</span>
          <span className="keycap-label">{isZh ? "上一章" : "PREV"}</span>
          <kbd className="keycap-kbd">←</kbd>
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          className={`keycap-btn keycap-play ${isPlaying ? "is-playing" : "is-paused"}`}
          onClick={onTogglePlay}
          title={isZh ? "播放 / 暂停 (空格键)" : "Play / Pause (Space)"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <span className="keycap-symbol">{isPlaying ? "⏸" : "▶"}</span>
          <span className="keycap-label">{isPlaying ? (isZh ? "暂停" : "PAUSE") : (isZh ? "播放" : "PLAY")}</span>
          <kbd className="keycap-kbd">SPACE</kbd>
        </button>

        {/* Next Chapter */}
        <button
          type="button"
          className="keycap-btn keycap-nav"
          onClick={onNextChapter}
          title={isZh ? "下一章 (→ 方向键)" : "Next Chapter (Right Arrow)"}
          aria-label="Next Chapter"
        >
          <span className="keycap-label">{isZh ? "下一章" : "NEXT"}</span>
          <span className="keycap-symbol">▶</span>
          <kbd className="keycap-kbd">→</kbd>
        </button>

        <div className="dock-divider" />

        {/* Web Speech API Voice Reading Toggle */}
        <button
          type="button"
          className={`keycap-btn keycap-speech ${isSpeechEnabled ? "is-active-accent" : ""} ${isSpeaking ? "is-speaking" : ""}`}
          onClick={onToggleSpeech}
          title={
            !hasInteracted && isSpeechEnabled
              ? isZh ? "点击开启原声语音朗读" : "Click to enable voice narration"
              : isSpeechEnabled
              ? isZh ? "语音朗读已开启（点击静音）" : "Voice narration active (Click to mute)"
              : isZh ? "语音朗读已静音（点击开启）" : "Voice muted (Click to enable)"
          }
          aria-label="Toggle Voice Reading"
        >
          {isSpeaking ? (
            <span className="speech-wave-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          ) : (
            <span className="keycap-symbol">{isSpeechEnabled ? "🔊" : "🔇"}</span>
          )}
          <span className="keycap-label">
            {isSpeechEnabled
              ? isSpeaking
                ? isZh ? "朗读中" : "SPEAKING"
                : !hasInteracted
                ? isZh ? "开启语音" : "UNMUTE"
                : isZh ? "语音开" : "VOICE ON"
              : isZh ? "语音关" : "VOICE OFF"}
          </span>
        </button>

        {/* Bilingual Language Switcher */}
        <button
          type="button"
          className="keycap-btn keycap-lang"
          onClick={onToggleLang}
          title={isZh ? "切换至英文 (English)" : "Switch to Chinese (中文)"}
          aria-label="Toggle Language"
        >
          <span className="keycap-symbol">🌐</span>
          <span className="keycap-label">{isZh ? "中 / EN" : "EN / 中"}</span>
        </button>

        {/* Dark / Light Theme Switcher */}
        <button
          type="button"
          className={`keycap-btn keycap-theme ${theme === "light" ? "is-light-active" : ""}`}
          onClick={onToggleTheme}
          title={theme === "dark" ? (isZh ? "切换至浅色模式" : "Switch to Light Theme") : (isZh ? "切换至深色模式" : "Switch to Dark Theme")}
          aria-label="Toggle Theme"
        >
          <span className="keycap-symbol">{theme === "dark" ? "🌙" : "☀️"}</span>
          <span className="keycap-label">{theme === "dark" ? (isZh ? "深色" : "DARK") : (isZh ? "浅色" : "LIGHT")}</span>
        </button>

        <div className="dock-divider" />

        {/* Subtitles Toggle */}
        <button
          type="button"
          className={`keycap-btn keycap-subtitles ${showSubtitles ? "is-sub-active" : ""}`}
          onClick={onToggleSubtitles}
          title={isZh ? "显示/隐藏字幕 (C 键)" : "Toggle Subtitles (C)"}
          aria-label="Toggle Subtitles"
        >
          <span className="keycap-symbol">💬</span>
          <span className="keycap-label">{isZh ? "字幕" : "CC"}</span>
          <kbd className="keycap-kbd">C</kbd>
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          className="keycap-btn keycap-fullscreen"
          onClick={onToggleFullscreen}
          title={isFullscreen ? (isZh ? "退出全屏 (ESC)" : "Exit Fullscreen") : (isZh ? "全屏模式 (F 键)" : "Fullscreen Mode")}
          aria-label="Toggle Fullscreen"
        >
          <span className="keycap-symbol">{isFullscreen ? "⤦" : "⛶"}</span>
          <span className="keycap-label">{isFullscreen ? (isZh ? "退出" : "EXIT") : (isZh ? "全屏" : "FULL")}</span>
          <kbd className="keycap-kbd">F</kbd>
        </button>
      </div>

      <div className="dock-hint-footer">
        <span className="dock-hint-text">
          {isZh
            ? `第 ${currentChapterIndex + 1} / ${totalChapters} 章 · 使用键盘快捷键快速导航`
            : `CH ${currentChapterIndex + 1} OF ${totalChapters} · QUICK NAVIGATION WITH KEYBOARD SHORTCUTS`}
        </span>
      </div>
    </aside>
  );
};
