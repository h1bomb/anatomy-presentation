import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

// Virtual clock hook for deterministic headless video export
(() => {
  let vNow = performance.now();
  let useVirtual = false;
  let seq = 1;
  const activeCbs = new Map<number, FrameRequestCallback>();
  const origRaf = window.requestAnimationFrame.bind(window);
  const origNow = performance.now.bind(performance);

  performance.now = () => (useVirtual ? vNow : origNow());
  window.requestAnimationFrame = (cb) => {
    const id = seq++;
    activeCbs.set(id, cb);
    if (!useVirtual) {
      origRaf((ts) => {
        if (activeCbs.has(id)) {
          activeCbs.delete(id);
          vNow = Math.max(vNow, ts);
          cb(ts);
        }
      });
    }
    return id;
  };

  window.cancelAnimationFrame = (id) => {
    activeCbs.delete(id);
  };

  (window as any).__stepOfficialClock = (dtMs = 33.333) => {
    useVirtual = true;
    vNow += dtMs;
    const list = [...activeCbs.values()];
    activeCbs.clear();
    for (const cb of list) {
      try {
        cb(vNow);
      } catch (err) {
        // ignore
      }
    }
  };
})();

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
