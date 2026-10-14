import test from "node:test";
import assert from "node:assert/strict";
import { CHAPTERS, getBeatIndex, getChapterState } from "../chapters-data.mjs";

test("CHAPTERS contains all 15 chapters with 4 beats covering 0..40s", () => {
  assert.equal(CHAPTERS.length, 15);
  assert.equal(CHAPTERS[0].id, "ch01");
  assert.equal(CHAPTERS[14].id, "ch15");
  for (const ch of CHAPTERS) {
    assert.equal(ch.duration, 40);
    assert.equal(ch.beats.length, 4);
    assert.equal(ch.beats[0].start, 0);
    assert.equal(ch.beats[3].end, 40);
    assert.ok(ch.title.length > 0);
    assert.ok(ch.takeaway.length > 0);
  }
});

test("getBeatIndex and getChapterState clamp boundary times accurately", () => {
  assert.equal(getBeatIndex(-5), 0);
  assert.equal(getBeatIndex(0), 0);
  assert.equal(getBeatIndex(9.99), 0);
  assert.equal(getBeatIndex(10.0), 1);
  assert.equal(getBeatIndex(25.0), 2);
  assert.equal(getBeatIndex(39.9), 3);
  assert.equal(getBeatIndex(45.0), 3);

  const state = getChapterState(7, 25.0);
  assert.equal(state.chapter.id, "ch08");
  assert.equal(state.beatIndex, 2);
  assert.ok(state.readout.includes("300"));
});
