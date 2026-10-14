import React, { useMemo } from "react";

interface TeleprompterProps {
  chapterNumber: string;
  clampedTime: number;
  scriptText: string;
  beatProgress: number;
  visible?: boolean;
}

export const Teleprompter: React.FC<TeleprompterProps> = ({
  chapterNumber,
  clampedTime,
  scriptText,
  beatProgress,
  visible = true,
}) => {
  const { spoken, current, rest } = useMemo(() => {
    const chars = [...(scriptText || "")];
    const cut = Math.floor(chars.length * Math.max(0, Math.min(1, beatProgress)));
    return {
      spoken: chars.slice(0, Math.max(0, cut - 2)).join(""),
      current: chars.slice(Math.max(0, cut - 2), cut + 3).join(""),
      rest: chars.slice(cut + 3).join(""),
    };
  }, [scriptText, beatProgress]);

  if (!visible) return null;

  return (
    <footer className="teleprompter-hud">
      <div className="teleprompter-left">
        <span className="voice-wave-badge">{`CH${chapterNumber} 口播 · ${Math.floor(clampedTime)}s`}</span>
        <p className="subtitle-line">
          <span className="sub-spoken">{spoken}</span>
          <span className="sub-current">{current}</span>
          <span>{rest}</span>
        </p>
      </div>
      <div className="controls-hint">
        <span>
          <b className="key-cap">Space</b> 播放/暂停
        </span>
        <span>
          <b className="key-cap">←/→</b> 章节
        </span>
        <span>
          <b className="key-cap">1-4</b> 节拍
        </span>
        <span>
          <b className="key-cap">C</b> 字幕
        </span>
        <span>
          <b className="key-cap">F</b> 全屏
        </span>
      </div>
    </footer>
  );
};
