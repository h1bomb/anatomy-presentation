import test from "node:test";
import assert from "node:assert/strict";
import { CHAPTERS, t, tList } from "../src/data/chapters.ts";
import {
  getAudioElement,
  playAudioChime,
  playSpeech,
  resolveVoice,
  stopSpeech,
  unlockSpeechSynthesis,
} from "../src/utils/speech.ts";

test("Every chapter has complete bilingual copy (Chinese & English)", () => {
  assert.equal(CHAPTERS.length, 15);

  for (const ch of CHAPTERS) {
    const zhTitle = t(ch.title, "zh");
    const enTitle = t(ch.title, "en");
    assert.ok(zhTitle && zhTitle.length > 0, `${ch.id} missing zh title`);
    assert.ok(enTitle && enTitle.length > 0, `${ch.id} missing en title`);
    assert.notEqual(zhTitle, enTitle, `${ch.id} title should be bilingual`);

    const zhThesis = t(ch.thesis, "zh");
    const enThesis = t(ch.thesis, "en");
    assert.ok(zhThesis.length > 0, `${ch.id} missing zh thesis`);
    assert.ok(enThesis.length > 0, `${ch.id} missing en thesis`);

    for (let i = 0; i < ch.beats.length; i++) {
      const b = ch.beats[i];
      const zhHl = t(b.headline, "zh");
      const enHl = t(b.headline, "en");
      assert.ok(zhHl.length > 0, `${ch.id} beat ${i} missing zh headline`);
      assert.ok(enHl.length > 0, `${ch.id} beat ${i} missing en headline`);

      const zhScript = t(b.scriptText, "zh");
      const enScript = t(b.scriptText, "en");
      assert.ok(zhScript.length > 0, `${ch.id} beat ${i} missing zh script`);
      assert.ok(enScript.length > 0, `${ch.id} beat ${i} missing en script`);

      const zhMetrics = tList(b.metrics, "zh");
      const enMetrics = tList(b.metrics, "en");
      assert.ok(zhMetrics.length > 0, `${ch.id} beat ${i} missing zh metrics`);
      assert.ok(enMetrics.length > 0, `${ch.id} beat ${i} missing en metrics`);
    }
  }
});

test("Speech synthesis utility methods execute safely in server/headless environments", () => {
  assert.doesNotThrow(() => playAudioChime());
  assert.doesNotThrow(() => unlockSpeechSynthesis());
  assert.doesNotThrow(() => stopSpeech());
  assert.equal(getAudioElement(), null);

  assert.equal(resolveVoice("zh"), null);
  assert.equal(resolveVoice("en"), null);
  assert.equal(playSpeech("测试解说", "zh"), false);
});

test("Studio audio narrator handles playback, .m4a -> .mp3 fallback, and rapid switching without browser TTS", async () => {
  let cancelCount = 0;
  let playBehavior: () => Promise<void> = () => Promise.resolve();

  const mockAudio: any = {
    id: "",
    preload: "",
    src: "",
    style: {},
    paused: true,
    onplay: null as null | (() => void),
    onended: null as null | (() => void),
    onerror: null as null | ((e: any) => void),
    setAttribute() {},
    pause() {
      this.paused = true;
    },
    play() {
      this.paused = false;
      return playBehavior();
    },
  };

  class MockAudioContext {
    state = "suspended";
    currentTime = 0;
    destination = {};
    resume() {
      this.state = "running";
      return Promise.resolve();
    }
    createOscillator() {
      return {
        type: "sine",
        frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {},
        start() {},
        stop() {},
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {},
      };
    }
  }

  const prevWindow = (globalThis as any).window;
  const prevDocument = (globalThis as any).document;

  (globalThis as any).window = {
    AudioContext: MockAudioContext,
    speechSynthesis: {
      cancel() {
        cancelCount++;
      },
    },
  };

  (globalThis as any).document = {
    getElementById: () => null,
    createElement: (tag: string) => {
      assert.equal(tag, "audio");
      return mockAudio;
    },
    body: {
      appendChild() {},
    },
  };

  try {
    // 1. Unlock audio and verify singleton creation + browser TTS cancellation
    unlockSpeechSynthesis();
    assert.equal((globalThis as any).window.__speechUnlocked, true);
    assert.ok(cancelCount >= 1);

    const el = getAudioElement();
    assert.equal(el, mockAudio);
    assert.equal(mockAudio.id, "anatomy-audio-narrator");

    // 2. Empty text or missing chapterId/beatIndex returns false
    assert.equal(playSpeech("   ", "zh"), false);
    assert.equal(playSpeech("有效文本但无章节参数", "zh"), false);

    // 3. Normal playback (.m4a) triggers onStart and onEnd
    let started = 0;
    let ended = 0;
    const ok = playSpeech(
      "先看一个东西。",
      "zh",
      () => started++,
      () => ended++,
      undefined,
      "ch01",
      0
    );
    assert.equal(ok, true);
    assert.equal(mockAudio.src, "/audio/zh/ch01_0.m4a");
    mockAudio.onplay?.();
    mockAudio.onended?.();
    assert.equal(started, 1);
    assert.equal(ended, 1);

    // 4. .m4a onerror falls back to .mp3, and .mp3 onerror invokes onError
    let errorCaught = 0;
    playSpeech(
      "Press the S key.",
      "en",
      undefined,
      undefined,
      () => errorCaught++,
      "ch01",
      1
    );
    assert.equal(mockAudio.src, "/audio/en/ch01_1.m4a");
    mockAudio.onerror?.(new Error("m4a load error"));
    assert.equal(mockAudio.src, "/audio/en/ch01_1.mp3");
    mockAudio.onerror?.(new Error("mp3 load error"));
    assert.equal(errorCaught, 1);

    // 5. Rejected play() promise falls back from .m4a to .mp3, and ignores AbortError
    let rejectCount = 0;
    playBehavior = () => {
      rejectCount++;
      if (rejectCount === 1) {
        return Promise.reject(new Error("NotSupportedError"));
      }
      const abortErr = new Error("Aborted");
      abortErr.name = "AbortError";
      return Promise.reject(abortErr);
    };

    playSpeech("Fallback promise test", "en", undefined, undefined, undefined, "ch02", 2);
    await new Promise((r) => setTimeout(r, 15));
    assert.equal(mockAudio.src, "/audio/en/ch02_2.mp3");

    // 6. Stop speech clears handlers and pauses audio
    stopSpeech();
    assert.equal(mockAudio.paused, true);
    assert.equal(mockAudio.onplay, null);
    assert.equal(mockAudio.onended, null);
    assert.equal(mockAudio.onerror, null);
  } finally {
    (globalThis as any).window = prevWindow;
    (globalThis as any).document = prevDocument;
  }
});
