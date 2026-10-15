import React from "react";
import type { Beat, BeatState, Bilingual, BilingualList, Language } from "../types.ts";
import { t, tList } from "../data/chapters.ts";

interface SlideNarrativeProps {
  thesis: Bilingual;
  beats: Beat[];
  beatIndex: number;
  beatProgress: number;
  clampedTime: number;
  takeaway: Bilingual;
  isExportMode?: boolean;
  lang?: Language;
  onSelectBeat?: (index: number) => void;
}

export const SlideNarrative: React.FC<SlideNarrativeProps> = ({
  thesis,
  beats,
  beatIndex,
  beatProgress,
  clampedTime,
  takeaway,
  isExportMode = false,
  lang = "zh",
  onSelectBeat,
}) => {
  const isZh = lang === "zh";

  return (
    <aside className="slide-narrative-col" aria-label="Slide Narrative">
      <div className="thesis-banner">
        <div className="thesis-tag">
          {isZh ? "CHAPTER THESIS · 核心命题" : "CHAPTER THESIS · CORE PROPOSITION"}
        </div>
        <div className="thesis-text">{t(thesis, lang)}</div>
      </div>

      <div className="beat-cards-stack">
        {beats.map((b, idx) => {
          const state: BeatState = idx < beatIndex ? "done" : idx === beatIndex ? "active" : "upcoming";
          let inlineStyle: React.CSSProperties | undefined = undefined;

          if (isExportMode) {
            if (state === "active") {
              const enterT = Math.max(0, Math.min(1, (clampedTime - b.start) / 0.55));
              const ease = 1 - Math.pow(1 - enterT, 3);
              const tx = -18 + 26 * ease;
              const op = 0.16 + 0.84 * ease;
              inlineStyle = {
                transform: `translateX(${tx.toFixed(2)}px) scale(${(0.985 + 0.015 * ease).toFixed(4)})`,
                opacity: op.toFixed(3),
              };
            }
          }

          const labelStr = t(b.label, lang);
          const headlineStr = t(b.headline, lang);
          const detailStr = t(b.detail, lang);
          const metricsArr = tList(b.metrics, lang);

          return (
            <article
              key={idx}
              className="beat-card"
              data-state={state}
              style={inlineStyle}
              onClick={() => onSelectBeat?.(idx)}
              title={isZh ? `点击跳转到第 ${idx + 1} 节拍` : `Jump to Beat 0${idx + 1}`}
            >
              <div className="beat-card-header">
                <span className="beat-time-badge">{`BEAT 0${idx + 1} · ${labelStr}`}</span>
                <span className="beat-cue-tag">{`STAGE: ${b.stageCue}`}</span>
              </div>
              <h2 className="beat-headline">{headlineStr}</h2>
              <p className="beat-detail">{detailStr}</p>
              <div className="beat-metrics">
                {metricsArr.map((m, mIdx) => (
                  <span key={mIdx} className="metric-chip">
                    {m}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <div className={`takeaway-plate ${beatIndex === 3 ? "is-highlighted" : ""}`}>
        <span className="takeaway-label">
          {isZh ? "KEY TAKEAWAY · 核心结论" : "KEY TAKEAWAY · CORE LESSON"}
        </span>
        <span className="takeaway-content">{t(takeaway, lang)}</span>
      </div>
    </aside>
  );
};
