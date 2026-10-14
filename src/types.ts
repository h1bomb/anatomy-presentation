export interface Beat {
  start: number;
  end: number;
  label: string;
  headline: string;
  detail: string;
  metrics: string[];
  stageCue: string;
  scriptText: string;
}

export interface Chapter {
  id: string;
  index: number;
  number: string;
  title: string;
  subtitle: string;
  duration: number;
  stageType: "official-pkg" | "iframe";
  machineKey: string;
  thesis: string;
  takeaway: string;
  readout: (t: number, beat: number) => string;
  beats: Beat[];
}

export interface ChapterState {
  chapter: Chapter;
  beatIndex: number;
  timeSec: number;
  beatProgress: number;
  readout: string;
  activeFigureKey: string;
}

export type BeatState = "upcoming" | "active" | "done";
