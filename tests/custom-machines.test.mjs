import test from "node:test";
import assert from "node:assert/strict";
import { buildAllCustomMachines } from "../machines/custom-machines.mjs";

const KEYS = [
  "watch-escapement",
  "box-to-machine",
  "pipeline-gantry",
  "metaphor-carousel",
  "camera-audit",
  "time-truth",
  "code-not-pixels",
  "star-counter",
  "taste-foundry",
];

test("buildAllCustomMachines produces rich isometric SVGs with data-anim hooks for all 9 custom machines", () => {
  const machines = buildAllCustomMachines();
  for (const key of KEYS) {
    assert.ok(machines[key], `missing machine ${key}`);
    assert.ok(machines[key].svg.startsWith("<svg"), `${key} must be an SVG`);
    const pathCount = (machines[key].svg.match(/<path /g) || []).length;
    assert.ok(pathCount >= 40, `${key} should have at least 40 SVG paths, got ${pathCount}`);
    assert.ok(machines[key].svg.includes('data-anim="'), `${key} must expose data-anim hooks`);
  }
});
