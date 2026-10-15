import test from "node:test";
import assert from "node:assert/strict";
import { CHAPTERS, getBeatIndex, getChapterState, t } from "../src/data/chapters.ts";

test("CHAPTERS contains all 15 chapters with bilingual support covering 0..40s", () => {
  assert.equal(CHAPTERS.length, 15);
  assert.equal(CHAPTERS[0].id, "ch01");
  assert.equal(CHAPTERS[14].id, "ch15");

  for (const ch of CHAPTERS) {
    assert.equal(ch.duration, 40);
    assert.equal(ch.beats.length, 4);
    assert.equal(ch.beats[0].start, 0);
    assert.equal(ch.beats[3].end, 40);

    const titleZh = t(ch.title, "zh");
    const titleEn = t(ch.title, "en");
    assert.ok(titleZh.length > 0, `Missing Chinese title for ${ch.id}`);
    assert.ok(titleEn.length > 0, `Missing English title for ${ch.id}`);

    const takeawayZh = t(ch.takeaway, "zh");
    const takeawayEn = t(ch.takeaway, "en");
    assert.ok(takeawayZh.length > 0, `Missing Chinese takeaway for ${ch.id}`);
    assert.ok(takeawayEn.length > 0, `Missing English takeaway for ${ch.id}`);
  }
});

test("getBeatIndex and getChapterState clamp boundary times accurately in both languages", () => {
  assert.equal(getBeatIndex(-5), 0);
  assert.equal(getBeatIndex(0), 0);
  assert.equal(getBeatIndex(9.99), 0);
  assert.equal(getBeatIndex(10.0), 1);
  assert.equal(getBeatIndex(25.0), 2);
  assert.equal(getBeatIndex(39.9), 3);
  assert.equal(getBeatIndex(45.0), 3);

  const stateZh = getChapterState(7, 25.0, "zh");
  assert.equal(stateZh.chapter.id, "ch08");
  assert.equal(stateZh.beatIndex, 2);
  assert.ok(stateZh.readout.includes("300"));

  const stateEn = getChapterState(7, 25.0, "en");
  assert.equal(stateEn.chapter.id, "ch08");
  assert.ok(stateEn.readout.length > 0);
});
