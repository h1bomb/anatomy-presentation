import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { getFigureComponent } from "../machines/figure-loader.tsx";
import { StageSkeleton } from "./LoadingScreen.tsx";
import type { Beat, Chapter, Language, Theme } from "../types.ts";
import { t, tList } from "../data/chapters.ts";

interface IsometricStageProps {
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
}) => {
  const rigRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastCueKey = useRef<string>("");

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
        "--anatomy-top": "#ffffff",
        "--anatomy-face": "#f0efe8",
        "--anatomy-hi": "#111110",
        "--anatomy-mid": "#5c5b55",
        "--anatomy-lo": "#8c8a82",
        "--anatomy-faint": "#dcd9ce",
      };
    }
    return {
      "--anatomy-page": "#111110",
      "--anatomy-card": "#111110",
      "--anatomy-paper": "#111110",
      "--anatomy-face": "#1d1d1b",
      "--anatomy-top": "#21211e",
      "--anatomy-hi": "#d8d7d0",
      "--anatomy-mid": "#73726b",
      "--anatomy-lo": "#43423d",
      "--anatomy-faint": "#2b2a27",
    };
  }, [theme]);

  // Keyboard and stage cue driver
  useEffect(() => {
    const cueKey = `${figureKey}:${activeBeat.stageCue}`;
    if (cueKey !== lastCueKey.current) {
      lastCueKey.current = cueKey;

      if (isIframe && iframeRef.current?.contentWindow) {
        const win = iframeRef.current.contentWindow as any;
        if (typeof win.__brollDrive === "function") {
          win.__brollDrive(activeBeat.stageCue, clampedTime, beatProgress, dtMs);
        }
      } else {
        const host = mountRef.current;
        if (!host) return;
        const root = host.shadowRoot || host;
        const stageEl = root.querySelector(".iso-stage") || root.querySelector('[tabindex="0"]') || host;

        if (figureKey === "watch") {
          if (activeBeat.stageCue === "WATCH_SLOW") {
            stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: "s", code: "KeyS", bubbles: true }));
          } else if (activeBeat.stageCue === "WATCH_APART") {
            stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: "e", code: "KeyE", bubbles: true }));
          } else if (activeBeat.stageCue === "WATCH_FULL") {
            stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: "e", code: "KeyE", bubbles: true }));
            stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: "s", code: "KeyS", bubbles: true }));
          }
        } else if (["turbofan", "plasma-cutter", "afterburner", "tokamak"].includes(figureKey)) {
          stageEl.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true }));
        }
      }
    }

    if (isExportMode) {
      const win = window as any;
      if (typeof win.__stepOfficialClock === "function") {
        win.__stepOfficialClock(dtMs);
      }
    }
  }, [figureKey, activeBeat.stageCue, clampedTime, beatProgress, dtMs, isIframe, isExportMode]);

  const metricsText = tList(activeBeat.metrics, lang).join(" · ");
  const subtitleText = t(chapter.subtitle, lang);

  return (
    <section className="isometric-stage-wrap" aria-label="Anatomy Isometric Animation Stage">
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
          <div ref={mountRef} className="official-pkg-mount" style={{ width: "920px", margin: "0 auto" }}>
            {FigureComp ? (
              <Suspense fallback={<StageSkeleton label={`MOUNTING [${figureKey.toUpperCase()}]...`} />}>
                <FigureComp
                  theme={theme}
                  tokens={figureTokens}
                  style={{ width: "920px", maxWidth: "920px", margin: "0 auto", display: "block" }}
                />
              </Suspense>
            ) : (
              <StageSkeleton label={`FIGURE [${figureKey}] STANDBY`} />
            )}
          </div>
        )}
      </div>
    </section>
  );
};
