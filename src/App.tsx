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
      const scale = Math.min(availW / baseW, availH / baseH);
      document.documentElement.style.setProperty("--stage-scale", scale.toString());
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
