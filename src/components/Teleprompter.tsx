import React, { useMemo } from "react";
import type { Bilingual, Language } from "../types.ts";
import { t } from "../data/chapters.ts";

interface TeleprompterProps {
  chapterNumber: string;
  clampedTime: number;
  scriptText: Bilingual;
  beatProgress: number;
  visible?: boolean;
  lang?: Language;
  isSpeechEnabled?: boolean;
}

export const Teleprompter: React.FC<TeleprompterProps> = ({
  chapterNumber,
  clampedTime,
  scriptText,
  beatProgress,
  visible = true,
  lang = "zh",
  isSpeechEnabled = false,
}) => {
  const isZh = lang === "zh";
  const rawText = t(scriptText, lang);

  const { spoken, current, rest } = useMemo(() => {
    const chars = [...(rawText || "")];
    const cut = Math.floor(chars.length * Math.max(0, Math.min(1, beatProgress)));
    return {
      spoken: chars.slice(0, Math.max(0, cut - 2)).join(""),
      current: chars.slice(Math.max(0, cut - 2), cut + 3).join(""),
      rest: chars.slice(cut + 3).join(""),
    };
  }, [rawText, beatProgress]);

  if (!visible) return null;

  return (
    <footer className="teleprompter-hud" aria-label="Teleprompter and Subtitles">
      <div className="teleprompter-left">
        <span className="voice-wave-badge">
          {isSpeechEnabled ? "🔊 " : "💬 "}
          {isZh ? `CH${chapterNumber} 原声解说 · ${Math.floor(clampedTime)}s` : `CH${chapterNumber} SCRIPT · ${Math.floor(clampedTime)}s`}
        </span>
        <p className="subtitle-line" title={rawText}>
          <span className="sub-spoken">{spoken}</span>
          <span className="sub-current">{current}</span>
          <span>{rest}</span>
        </p>
      </div>

      <div className="controls-hint">
        <span className="keycap-hint-item">
          <kbd className="key-cap-mech">Space</kbd>
          <span className="hint-label">{isZh ? "播放/暂停" : "Play/Pause"}</span>
        </span>
        <span className="keycap-hint-item">
          <kbd className="key-cap-mech">← / →</kbd>
          <span className="hint-label">{isZh ? "上一章/下一章" : "Prev/Next"}</span>
        </span>
        <span className="keycap-hint-item">
          <kbd className="key-cap-mech">1-4</kbd>
          <span className="hint-label">{isZh ? "节拍" : "Beat"}</span>
        </span>
        <span className="keycap-hint-item">
          <kbd className="key-cap-mech">C</kbd>
          <span className="hint-label">{isZh ? "字幕" : "CC"}</span>
        </span>
        <span className="keycap-hint-item">
          <kbd className="key-cap-mech">F</kbd>
          <span className="hint-label">{isZh ? "全屏" : "Full"}</span>
        </span>
      </div>
    </footer>
  );
};
