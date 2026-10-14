import React from "react";
import type { Beat, BeatState } from "../types";

interface SlideNarrativeProps {
  thesis: string;
  beats: Beat[];
  beatIndex: number;
  beatProgress: number;
  clampedTime: number;
  takeaway: string;
  isExportMode?: boolean;
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
  onSelectBeat,
}) => {
  return (
    <aside className="slide-narrative-col">
      <div className="thesis-banner">
        <div className="thesis-tag">CHAPTER THESIS · 核心命题</div>
        <div className="thesis-text">{thesis}</div>
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

          return (
            <article
              key={idx}
              className="beat-card"
              data-state={state}
              style={inlineStyle}
              onClick={() => onSelectBeat?.(idx)}
            >
              <div className="beat-card-header">
                <span className="beat-time-badge">{`BEAT 0${idx + 1} · ${b.label}`}</span>
                <span className="beat-cue-tag">{`STAGE: ${b.stageCue}`}</span>
              </div>
              <h2 className="beat-headline">{b.headline}</h2>
              <p className="beat-detail">{b.detail}</p>
              <div className="beat-metrics">
                {b.metrics.map((m, mIdx) => (
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
        <span className="takeaway-label">KEY TAKEAWAY</span>
        <span className="takeaway-content">{takeaway}</span>
      </div>
    </aside>
  );
};
