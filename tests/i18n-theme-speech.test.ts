import test from "node:test";
import assert from "node:assert/strict";
import { CHAPTERS, t, tList } from "../src/data/chapters.ts";
import { resolveVoice, stopSpeech, playSpeech, unlockSpeechSynthesis } from "../src/utils/speech.ts";

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

test("Speech synthesis utility methods execute without throwing in server/headless environments", () => {
  assert.doesNotThrow(() => {
    unlockSpeechSynthesis();
  });

  assert.doesNotThrow(() => {
    stopSpeech();
  });

  const zhVoice = resolveVoice("zh");
  const enVoice = resolveVoice("en");
  // In Node.js environment without window.speechSynthesis, returns null safely
  assert.equal(zhVoice, null);
  assert.equal(enVoice, null);

  const played = playSpeech("测试解说", "zh");
  assert.equal(played, false);
});
