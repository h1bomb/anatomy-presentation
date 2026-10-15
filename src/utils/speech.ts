import type { Language } from "../types.ts";

declare global {
  interface Window {
    __activeSpeechUtterance?: SpeechSynthesisUtterance | null;
    __activeSpeechQueue?: SpeechSynthesisUtterance[];
    __speechUnlocked?: boolean;
  }
}

// Global retained references to prevent V8 / WebKit garbage collection
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesInitialized = false;

// Initialize voices listener
export function initVoiceCache(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const load = () => {
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedVoices = v;
        voicesInitialized = true;
      }
    } catch {}
  };

  load();
  if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
    window.speechSynthesis.onvoiceschanged = load;
  }
}

// Call immediately in browser environment
if (typeof window !== "undefined") {
  initVoiceCache();
}

/**
 * Find the optimal natural voice for the target language.
 */
export function resolveVoice(lang: Language): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  if (!voicesInitialized || cachedVoices.length === 0) {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
      if (cachedVoices.length > 0) voicesInitialized = true;
    } catch {}
  }

  const voices = cachedVoices;
  if (!voices || voices.length === 0) return null;

  if (lang === "zh") {
    // 1. Try named Chinese voices on macOS / Windows / Android
    const priorityNames = [
      "Tingting",
      "Xiaoxiao",
      "Yunxi",
      "Meijia",
      "Sinji",
      "Eddy",
      "Flo",
      "Chinese",
      "中文",
      "Reed",
      "Sandy",
      "Shelley",
    ];
    for (const name of priorityNames) {
      const found = voices.find(
        (v) =>
          (v.lang.startsWith("zh") || v.name.includes("Chinese") || v.name.includes("中文")) &&
          v.name.includes(name)
      );
      if (found) return found;
    }

    // 2. Any exact zh-CN voice
    const zhCn = voices.find((v) => v.lang.toLowerCase().replace("_", "-") === "zh-cn");
    if (zhCn) return zhCn;

    // 3. Any zh voice
    const anyZh = voices.find((v) => v.lang.toLowerCase().startsWith("zh"));
    if (anyZh) return anyZh;

    return null;
  }

  // English
  const priorityEnNames = ["Samantha", "Daniel", "Natural", "Google US", "Jenny", "Guy", "Karen", "Alex"];
  for (const name of priorityEnNames) {
    const found = voices.find(
      (v) => (v.lang.startsWith("en") || v.lang.includes("en-US")) && v.name.includes(name)
    );
    if (found) return found;
  }

  const enUs = voices.find((v) => v.lang.toLowerCase().replace("_", "-") === "en-us");
  if (enUs) return enUs;

  const anyEn = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  if (anyEn) return anyEn;

  return null;
}

/**
 * Unlock Web Audio and SpeechSynthesis on user gesture.
 */
export function unlockSpeechSynthesis(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.resume();
    window.__speechUnlocked = true;
  } catch {}
}

/**
 * Cancel and stop any ongoing speech synthesis immediately.
 */
export function stopSpeech(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    if (window.__activeSpeechUtterance) {
      window.__activeSpeechUtterance = null;
    }
    window.__activeSpeechQueue = [];
  } catch {}
}

/**
 * Speak text with robust error recovery, anti-GC retention, and Chrome resume wakeups.
 */
export function playSpeech(
  text: string,
  lang: Language = "zh",
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  if (!text || !text.trim()) return false;

  try {
    // 1. Cancel previous utterance and resume queue
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    // 2. Global queue to prevent garbage collection in Chrome / Safari V8
    window.__activeSpeechQueue = window.__activeSpeechQueue || [];

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = lang === "zh" ? "zh-CN" : "en-US";
    utterance.rate = lang === "zh" ? 1.05 : 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const matchedVoice = resolveVoice(lang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // Retain strong references on window
    window.__activeSpeechUtterance = utterance;
    window.__activeSpeechQueue.push(utterance);

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      if (window.__activeSpeechQueue) {
        const idx = window.__activeSpeechQueue.indexOf(utterance);
        if (idx > -1) window.__activeSpeechQueue.splice(idx, 1);
      }
      if (window.__activeSpeechUtterance === utterance) {
        window.__activeSpeechUtterance = null;
      }
      onEnd?.();
    };

    utterance.onerror = (e) => {
      if (window.__activeSpeechQueue) {
        const idx = window.__activeSpeechQueue.indexOf(utterance);
        if (idx > -1) window.__activeSpeechQueue.splice(idx, 1);
      }
      if (window.__activeSpeechUtterance === utterance) {
        window.__activeSpeechUtterance = null;
      }
      if (e.error !== "interrupted" && e.error !== "canceled") {
        console.warn("[SpeechSynthesis] notice:", e.error);
      }
      onError?.(e);
    };

    // Chrome audio engine flush delay: ensures previous cancel() took effect before speaking
    setTimeout(() => {
      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("[SpeechSynthesis] speak invocation failed:", err);
      }
    }, 25);

    return true;
  } catch (err) {
    console.error("[SpeechSynthesis] setup failed:", err);
    return false;
  }
}
