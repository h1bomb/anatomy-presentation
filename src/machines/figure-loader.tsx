import { ComponentType, lazy, LazyExoticComponent, CSSProperties } from "react";

export interface FigureProps {
  theme?: "dark" | "light" | any;
  tokens?: Record<string, string>;
  fig?: string;
  className?: string;
  style?: CSSProperties;
}

export type FigureComponent = ComponentType<FigureProps>;

export const FIGURE_REGISTRY: Record<string, LazyExoticComponent<FigureComponent>> = {
  "afterburner": lazy(() => import("anatomy-figures/afterburner")),
  "b-tree": lazy(() => import("anatomy-figures/b-tree")),
  "bevel-offset": lazy(() => import("anatomy-figures/bevel-offset")),
  "binary-search": lazy(() => import("anatomy-figures/binary-search")),
  "bloom-filter": lazy(() => import("anatomy-figures/bloom-filter")),
  "box-model": lazy(() => import("anatomy-figures/box-model")),
  "computer": lazy(() => import("anatomy-figures/computer")),
  "debounce": lazy(() => import("anatomy-figures/debounce")),
  "dns": lazy(() => import("anatomy-figures/dns")),
  "easing": lazy(() => import("anatomy-figures/easing")),
  "fit": lazy(() => import("anatomy-figures/fit")),
  "flex-grow": lazy(() => import("anatomy-figures/flex-grow")),
  "forge": lazy(() => import("anatomy-figures/forge")),
  "foundry": lazy(() => import("anatomy-figures/foundry")),
  "four-frames": lazy(() => import("anatomy-figures/four-frames")),
  "frosted-copy": lazy(() => import("anatomy-figures/frosted-copy")),
  "git-merge": lazy(() => import("anatomy-figures/git-merge")),
  "glass-furnace": lazy(() => import("anatomy-figures/glass-furnace")),
  "gradient-descent": lazy(() => import("anatomy-figures/gradient-descent")),
  "hash-map": lazy(() => import("anatomy-figures/hash-map")),
  "lens-bench": lazy(() => import("anatomy-figures/lens-bench")),
  "lit-by-facing": lazy(() => import("anatomy-figures/lit-by-facing")),
  "lru-cache": lazy(() => import("anatomy-figures/lru-cache")),
  "mark-sweep": lazy(() => import("anatomy-figures/mark-sweep")),
  "merge-sort": lazy(() => import("anatomy-figures/merge-sort")),
  "message-queue": lazy(() => import("anatomy-figures/message-queue")),
  "mutex": lazy(() => import("anatomy-figures/mutex")),
  "one-context": lazy(() => import("anatomy-figures/one-context")),
  "one-stage": lazy(() => import("anatomy-figures/one-stage")),
  "plasma-cutter": lazy(() => import("anatomy-figures/plasma-cutter")),
  "power-station": lazy(() => import("anatomy-figures/power-station")),
  "press-and-pull": lazy(() => import("anatomy-figures/press-and-pull")),
  "process-pump": lazy(() => import("anatomy-figures/process-pump")),
  "profile": lazy(() => import("anatomy-figures/profile")),
  "public-key": lazy(() => import("anatomy-figures/public-key")),
  "rate-limiter": lazy(() => import("anatomy-figures/rate-limiter")),
  "reactor": lazy(() => import("anatomy-figures/reactor")),
  "sampling": lazy(() => import("anatomy-figures/sampling")),
  "seasons": lazy(() => import("anatomy-figures/seasons")),
  "separable-blur": lazy(() => import("anatomy-figures/separable-blur")),
  "shared-canvas": lazy(() => import("anatomy-figures/shared-canvas")),
  "spot-plate": lazy(() => import("anatomy-figures/spot-plate")),
  "studio": lazy(() => import("anatomy-figures/studio")),
  "tcp-handshake": lazy(() => import("anatomy-figures/tcp-handshake")),
  "three-reads": lazy(() => import("anatomy-figures/three-reads")),
  "tokamak": lazy(() => import("anatomy-figures/tokamak")),
  "turbofan": lazy(() => import("anatomy-figures/turbofan")),
  "watch": lazy(() => import("anatomy-figures/watch")),
};

export function getFigureComponent(key: string): LazyExoticComponent<FigureComponent> | null {
  return FIGURE_REGISTRY[key] || null;
}
