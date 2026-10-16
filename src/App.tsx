import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { CornerMarks } from "./components/CornerMarks";
import "./kit/iso.css";
import "./App.css";

export const App: React.FC = () => {
  useEffect(() => {
    function fitViewport() {
      const baseW = 1920;
      const baseH = 1080;
      const availW = window.innerWidth || document.documentElement.clientWidth || 1920;
      const availH = window.innerHeight || document.documentElement.clientHeight || 1080;
      const isExport = window.location.search.includes("export=1");
      const isMobile = !isExport && availW <= 1024;

      if (isMobile) {
        document.documentElement.dataset.mobile = "true";
        document.documentElement.style.setProperty("--stage-scale", "1");
        document.documentElement.style.setProperty("--stage-w", "100%");
        document.documentElement.style.setProperty("--stage-h", "auto");
        return;
      }

      delete document.documentElement.dataset.mobile;
      const scale = Math.min(availW / baseW, availH / baseH);
      const stageW = isExport ? baseW : Math.round((availW / scale) * 100) / 100;
      const stageH = isExport ? baseH : Math.round((availH / scale) * 100) / 100;
      document.documentElement.style.setProperty("--stage-scale", scale.toString());
      document.documentElement.style.setProperty("--stage-w", `${stageW}px`);
      document.documentElement.style.setProperty("--stage-h", `${stageH}px`);
    }

    fitViewport();
    window.addEventListener("resize", fitViewport, { passive: true });
    window.addEventListener("orientationchange", fitViewport, { passive: true });

    return () => {
      window.removeEventListener("resize", fitViewport);
      window.removeEventListener("orientationchange", fitViewport);
    };
  }, []);

  return (
    <div className="broll-viewport" id="viewport">
      <CornerMarks />
      <Outlet />
    </div>
  );
};
