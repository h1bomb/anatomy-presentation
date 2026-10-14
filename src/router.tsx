import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "./App";
import { ChapterPlayer } from "./pages/ChapterPlayer";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/ch01" replace />,
      },
      {
        path: ":chapterId",
        element: <ChapterPlayer />,
      },
      {
        path: "*",
        element: <Navigate to="/ch01" replace />,
      },
    ],
  },
]);
