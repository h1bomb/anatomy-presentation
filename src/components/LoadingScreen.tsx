import React from "react";

export const StageSkeleton: React.FC<{ label?: string }> = ({ label = "LOADING FIGURE ASSETS..." }) => {
  return (
    <div className="stage-skeleton-hud">
      <div className="skeleton-dial-ring">
        <div className="skeleton-dial-spinner" />
      </div>
      <div className="skeleton-meta">
        <span className="skeleton-tag">ANATOMY ISOMETRIC CORE</span>
        <span className="skeleton-label">{label}</span>
      </div>
    </div>
  );
};

export const FullscreenLoading: React.FC<{ message?: string }> = ({ message = "INITIALIZING ANATOMY SYSTEM..." }) => {
  return (
    <div className="fullscreen-loading-cover">
      <div className="fullscreen-dial-wrap">
        <div className="dial-glow" />
        <div className="dial-outer-ring" />
        <div className="dial-spinner" />
      </div>
      <div className="fullscreen-meta">
        <div className="fullscreen-badge">ANATOMY · B-ROLL PLAYER</div>
        <div className="fullscreen-message">{message}</div>
      </div>
      <div className="fullscreen-track">
        <div className="fullscreen-bar" />
      </div>
    </div>
  );
};
