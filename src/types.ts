export type Language = "zh" | "en";
export type Theme = "dark" | "light";

export type Bilingual = string | { zh: string; en: string };
export type BilingualList = string[] | { zh: string[]; en: string[] };

export interface Beat {
  start: number;
  end: number;
  label: Bilingual;
  headline: Bilingual;
  detail: Bilingual;
  metrics: BilingualList;
  stageCue: string;
  scriptText: Bilingual;
}

export interface Chapter {
  id: string;
  index: number;
  number: string;
  title: Bilingual;
  subtitle: Bilingual;
  duration: number;
  stageType: "official-pkg" | "custom-iso";
  machineKey: string;
  thesis: Bilingual;
  takeaway: Bilingual;
  readout?: (t: number, beat: number, lang?: Language) => string;
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
