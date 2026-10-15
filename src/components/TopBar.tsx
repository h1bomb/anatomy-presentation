import React from "react";
import type { Bilingual, Language } from "../types.ts";
import { t } from "../data/chapters.ts";

interface TopBarProps {
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
}) => {
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
        <span className="status-dot" />
        <span className="top-readout-text">{readout}</span>
      </div>
    </header>
  );
};
