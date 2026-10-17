import test from "node:test";
import assert from "node:assert/strict";
import {
  CHAPTERS,
  CHAPTER_FIGURES,
  getActiveFigureKey,
  getBeatIndex,
  getChapterState,
  t,
  tList,
} from "../src/data/chapters.ts";

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

test("t() and tList() handle undefined, plain strings/arrays, and fallback languages", () => {
  assert.equal(t(undefined, "zh"), "");
  assert.equal(t("plain text", "en"), "plain text");
  assert.equal(t({ zh: "仅中文", en: "" }, "en"), "仅中文");
  assert.equal(t({ zh: "", en: "English only" }, "zh"), "English only");
  assert.equal(t({ zh: "", en: "" }, "zh"), "");

  assert.deepEqual(tList(undefined, "zh"), []);
  assert.deepEqual(tList(["a", "b"], "en"), ["a", "b"]);
  assert.deepEqual(tList({ zh: ["甲"], en: ["A"] }, "zh"), ["甲"]);
  assert.deepEqual(tList({ zh: ["甲"], en: ["A"] }, "en"), ["A"]);
  assert.deepEqual(tList({ zh: ["回退中文"], en: undefined as any }, "en"), ["回退中文"]);
});

test("getBeatIndex clamps boundary and non-finite times accurately", () => {
  assert.equal(getBeatIndex(Number.NaN), 0);
  assert.equal(getBeatIndex(Number.POSITIVE_INFINITY), 0);
  assert.equal(getBeatIndex(-5), 0);
  assert.equal(getBeatIndex(0), 0);
  assert.equal(getBeatIndex(9.99), 0);
  assert.equal(getBeatIndex(10.0), 1);
  assert.equal(getBeatIndex(19.99), 1);
  assert.equal(getBeatIndex(20.0), 2);
  assert.equal(getBeatIndex(25.0), 2);
  assert.equal(getBeatIndex(29.99), 2);
  assert.equal(getBeatIndex(30.0), 3);
  assert.equal(getBeatIndex(39.9), 3);
  assert.equal(getBeatIndex(45.0), 3);
});

test("getActiveFigureKey resolves all 15 chapters, ch07 sub-beat transition, and unknown chapter fallback", () => {
  // ch07 Beat 0 transitions at t = 5.5s from hash-map to bloom-filter
  assert.equal(getActiveFigureKey("ch07", 2.0, 0), "hash-map");
  assert.equal(getActiveFigureKey("ch07", 5.49, 0), "hash-map");
  assert.equal(getActiveFigureKey("ch07", 5.5, 0), "bloom-filter");
  assert.equal(getActiveFigureKey("ch07", 8.5, 0), "bloom-filter");
  assert.equal(getActiveFigureKey("ch07", 12.0, 1), "mutex");
  assert.equal(getActiveFigureKey("ch07", 22.0, 2), "tcp-handshake");
  assert.equal(getActiveFigureKey("ch07", 32.0, 3), "sampling");

  // Unknown chapter ID defaults to "watch"
  assert.equal(getActiveFigureKey("unknown-chapter", 0, 0), "watch");

  for (const ch of CHAPTERS) {
    assert.ok(CHAPTER_FIGURES[ch.id], `Missing CHAPTER_FIGURES entry for ${ch.id}`);
    for (let beat = 0; beat < 4; beat++) {
      const figKey = getActiveFigureKey(ch.id, beat * 10 + 2, beat);
      assert.ok(typeof figKey === "string" && figKey.length > 0, `Empty figure key for ${ch.id} beat ${beat}`);
    }
  }
});

test("getChapterState evaluates readouts across all 15 chapters, 4 beats, and both languages", () => {
  const sampleTimes = [2.5, 12.5, 22.5, 32.5];

  for (let chIdx = 0; chIdx < CHAPTERS.length; chIdx++) {
    const chId = CHAPTERS[chIdx].id;
    for (let beatIdx = 0; beatIdx < sampleTimes.length; beatIdx++) {
      const tSec = sampleTimes[beatIdx];
      const stateZh = getChapterState(chIdx, tSec, "zh");
      const stateEn = getChapterState(chId, tSec, "en");

      assert.equal(stateZh.chapter.id, chId);
      assert.equal(stateEn.chapter.id, chId);
      assert.equal(stateZh.beatIndex, beatIdx);
      assert.equal(stateEn.beatIndex, beatIdx);
      assert.ok(stateZh.beatProgress >= 0 && stateZh.beatProgress <= 1);
      assert.ok(stateZh.readout.length > 0, `${chId} beat ${beatIdx} zh readout must not be empty`);
      assert.ok(stateEn.readout.length > 0, `${chId} beat ${beatIdx} en readout must not be empty`);
      assert.ok(stateZh.activeFigureKey.length > 0);
    }
  }

  // Boundary index / unknown ID clamping
  assert.equal(getChapterState(-10, 5, "zh").chapter.id, "ch01");
  assert.equal(getChapterState(999, 5, "zh").chapter.id, "ch15");
  assert.equal(getChapterState("non-existent", Number.NaN, "zh").chapter.id, "ch01");
});
