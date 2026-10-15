import type { Language } from "../types.ts";

declare global {
  interface Window {
    __activeSpeechUtterance?: SpeechSynthesisUtterance | null;
    __activeSpeechQueue?: SpeechSynthesisUtterance[];
    __speechUnlocked?: boolean;
    __speechKeepAliveTimer?: number | null;
    __audioCtx?: AudioContext | null;
  }
}

// Global retained references to prevent V8 / WebKit garbage collection
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesInitialized = false;

// Filter novelty/toy voices that produce silence or distorted noise on macOS/iOS
const NOVELTY_VOICE_NAMES = new Set([
  "eddy",
  "flo",
  "reed",
  "sandy",
  "shelley",
  "grandma",
  "grandpa",
  "rocko",
  "bad news",
  "bahh",
  "bells",
  "boing",
  "bubbles",
  "cellos",
  "deranged",
  "good news",
  "hysterical",
  "pipe organ",
  "trinoids",
  "whisper",
  "zarvox",
  "wobble",
  "junior",
  "ralph",
  "albert",
  "fred",
]);

function isNoveltyVoice(name: string): boolean {
  const lower = name.toLowerCase();
  for (const nov of NOVELTY_VOICE_NAMES) {
    if (lower.startsWith(nov) || lower.includes(`(${nov}`) || lower.includes(` ${nov}`)) {
      return true;
    }
  }
  return false;
}

// Play a subtle high-tech confirmation chime via Web Audio API
export function playAudioChime(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    if (!window.__audioCtx) {
      window.__audioCtx = new AudioCtx();
    }
    const ctx = window.__audioCtx;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch {}
}

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
    // 1. Prioritize natural Chinese voices across macOS, Windows, Android, Chrome OS
    const preferredZhNames = [
      "婷婷",
      "tingting",
      "google 普通话",
      "google 國語",
      "google 粤語",
      "xiaoxiao",
      "晓晓",
      "yunxi",
      "云希",
      "yunyang",
      "云扬",
      "yaoyao",
      "huihui",
      "慧慧",
      "kangkang",
      "康康",
      "美嘉",
      "meijia",
      "善怡",
      "sinji",
    ];

    for (const pref of preferredZhNames) {
      const found = voices.find((v) => {
        const nl = v.name.toLowerCase();
        return (
          (v.lang.toLowerCase().startsWith("zh") || nl.includes("chinese") || nl.includes("中文")) &&
          nl.includes(pref)
        );
      });
      if (found) return found;
    }

    // 2. Exact zh-CN non-novelty voice
    const zhCn = voices.find(
      (v) => v.lang.toLowerCase().replace("_", "-") === "zh-cn" && !isNoveltyVoice(v.name)
    );
    if (zhCn) return zhCn;

    // 3. Any non-novelty Chinese voice
    const anyZh = voices.find(
      (v) => v.lang.toLowerCase().startsWith("zh") && !isNoveltyVoice(v.name)
    );
    if (anyZh) return anyZh;

    // Fallback: any voice starting with zh
    return voices.find((v) => v.lang.toLowerCase().startsWith("zh")) || null;
  }

  // English
  const preferredEnNames = [
    "samantha",
    "google us english",
    "alex",
    "jenny",
    "guy",
    "aria",
    "daniel",
    "zira",
    "david",
    "mark",
    "karen",
  ];

  for (const pref of preferredEnNames) {
    const found = voices.find((v) => {
      const nl = v.name.toLowerCase();
      return (
        (v.lang.toLowerCase().startsWith("en") || nl.includes("english")) &&
        nl.includes(pref)
      );
    });
    if (found) return found;
  }

  const enUs = voices.find(
    (v) => v.lang.toLowerCase().replace("_", "-") === "en-us" && !isNoveltyVoice(v.name)
  );
  if (enUs) return enUs;

  const anyEn = voices.find(
    (v) => v.lang.toLowerCase().startsWith("en") && !isNoveltyVoice(v.name)
  );
  if (anyEn) return anyEn;

  return voices.find((v) => v.lang.toLowerCase().startsWith("en")) || null;
}

/**
 * Unlock Web Audio and SpeechSynthesis synchronously within user gesture.
 */
export function unlockSpeechSynthesis(): void {
  if (typeof window === "undefined") return;

  // 1. AudioContext unlock
  playAudioChime();

  // 2. SpeechSynthesis unlock
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.resume();
      if (!window.__speechUnlocked) {
        // Speak a 0-volume empty string synchronously to grant autoplay permission in Chrome/Safari
        const silentUt = new SpeechSynthesisUtterance("");
        silentUt.volume = 0;
        window.speechSynthesis.speak(silentUt);
        window.__speechUnlocked = true;
      }
    } catch {}
  }
}

/**
 * Cancel and stop any ongoing speech synthesis immediately.
 */
export function stopSpeech(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    if (window.__speechKeepAliveTimer) {
      clearInterval(window.__speechKeepAliveTimer);
      window.__speechKeepAliveTimer = null;
    }
    window.speechSynthesis.cancel();
    if (window.__activeSpeechUtterance) {
      window.__activeSpeechUtterance = null;
    }
    window.__activeSpeechQueue = [];
  } catch {}
}

/**
 * Speak text with synchronous invocation, anti-GC retention, and Chrome keep-alive watchdog.
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
    // 1. Cancel previous utterance and resume synthesis queue
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

    // Chrome 15s freeze watchdog: resume every 8s while speaking
    if (window.__speechKeepAliveTimer) {
      clearInterval(window.__speechKeepAliveTimer);
      window.__speechKeepAliveTimer = null;
    }
    window.__speechKeepAliveTimer = window.setInterval(() => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        } else {
          if (window.__speechKeepAliveTimer) {
            clearInterval(window.__speechKeepAliveTimer);
            window.__speechKeepAliveTimer = null;
          }
        }
      }
    }, 8000);

    const cleanup = () => {
      if (window.__speechKeepAliveTimer) {
        clearInterval(window.__speechKeepAliveTimer);
        window.__speechKeepAliveTimer = null;
      }
      if (window.__activeSpeechQueue) {
        const idx = window.__activeSpeechQueue.indexOf(utterance);
        if (idx > -1) window.__activeSpeechQueue.splice(idx, 1);
      }
      if (window.__activeSpeechUtterance === utterance) {
        window.__activeSpeechUtterance = null;
      }
    };

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      cleanup();
      onEnd?.();
    };

    utterance.onerror = (e) => {
      cleanup();
      if (e.error !== "interrupted" && e.error !== "canceled") {
        console.warn("[SpeechSynthesis] notice:", e.error);
      }
      onError?.(e);
    };

    // Invoke speak synchronously to preserve transient user activation in Chrome
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("[SpeechSynthesis] setup failed:", err);
    return false;
  }
}
