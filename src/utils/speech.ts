import type { Language } from "../types.ts";

declare global {
  interface Window {
    __activeAudioElement?: HTMLAudioElement | null;
    __audioCtx?: AudioContext | null;
    __speechUnlocked?: boolean;
  }
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

let persistentAudio: HTMLAudioElement | null = null;
let activePlaybackId = 0;

/**
 * Obtain or create a persistent singleton HTMLAudioElement.
 * Reusing a single element across beat/chapter switches preserves browser autoplay permissions
 * and completely prevents audio cutoff or auto-stopping.
 */
export function getAudioElement(): HTMLAudioElement | null {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  if (!persistentAudio) {
    persistentAudio = document.getElementById("anatomy-audio-narrator") as HTMLAudioElement;
    if (!persistentAudio) {
      persistentAudio = document.createElement("audio");
      persistentAudio.id = "anatomy-audio-narrator";
      persistentAudio.preload = "auto";
      persistentAudio.setAttribute("playsinline", "true");
      persistentAudio.style.display = "none";
      document.body.appendChild(persistentAudio);
    }
    window.__activeAudioElement = persistentAudio;
  }
  return persistentAudio;
}

/**
 * Unlock Web Audio and HTMLAudioElement synchronously within user gesture.
 */
export function unlockSpeechSynthesis(): void {
  if (typeof window === "undefined") return;
  window.__speechUnlocked = true;

  // 1. AudioContext unlock
  playAudioChime();

  // 2. Pre-bless persistent HTMLAudioElement so future beat/chapter changes are never blocked
  try {
    const audio = getAudioElement();
    if (audio && (!audio.src || audio.src.startsWith("data:"))) {
      audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          audio.pause();
        }).catch(() => {});
      }
    }
  } catch {}

  // 3. Ensure any browser speech synthesis is permanently silenced
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Cancel and stop any ongoing audio playback immediately.
 * Web Speech API is never used; cancels any stray browser utterances.
 */
export function stopSpeech(): void {
  if (typeof window === "undefined") return;
  try {
    activePlaybackId++; // Invalidate any pending playback requests
    const audio = getAudioElement();
    if (audio) {
      audio.pause();
      audio.onplay = null;
      audio.onended = null;
      audio.onerror = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch {}
}

/**
 * Backward compatibility stub: Web Speech API voices are disabled in favor of custom studio audio.
 */
export function resolveVoice(_lang: Language): SpeechSynthesisVoice | null {
  return null;
}

/**
 * Play narration using high-fidelity pre-synthesized studio audio.
 * Browser Web Speech API is completely disabled to avoid robotic TTS voices when switching quickly.
 */
export function playSpeech(
  text: string,
  lang: Language = "zh",
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void,
  chapterId?: string,
  beatIndex?: number
): boolean {
  if (typeof window === "undefined") return false;
  if (!text || !text.trim()) return false;

  // Stop any previous audio track and bump playback ID
  stopSpeech();
  const playbackId = activePlaybackId;

  if (!chapterId || typeof beatIndex !== "number") {
    // Only studio audio is supported; no browser TTS fallback
    return false;
  }

  try {
    const audio = getAudioElement();
    if (!audio) return false;

    const tryPlayFormat = (format: "m4a" | "mp3") => {
      // Discard if user already triggered another beat/chapter
      if (playbackId !== activePlaybackId) return;

      const audioUrl = `/audio/${lang}/${chapterId}_${beatIndex}.${format}`;

      audio.onplay = () => {
        if (playbackId === activePlaybackId) {
          onStart?.();
        }
      };

      audio.onended = () => {
        if (playbackId === activePlaybackId) {
          onEnd?.();
        }
      };

      audio.onerror = (e) => {
        if (playbackId !== activePlaybackId) return;

        if (format === "m4a") {
          tryPlayFormat("mp3");
        } else {
          // Both formats failed, do NOT fallback to WebSpeech
          console.warn(`[Speech] Custom audio track not available: ${audioUrl}`);
          onError?.(e);
        }
      };

      audio.src = audioUrl;
      window.__activeAudioElement = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // If rapid switching occurred, AbortError is normal and expected
          if (playbackId !== activePlaybackId || err.name === "AbortError") {
            return;
          }
          if (format === "m4a") {
            tryPlayFormat("mp3");
          } else {
            console.warn("[Speech] Audio play error:", err);
            onError?.(err);
          }
        });
      }
    };

    tryPlayFormat("m4a");
    return true;
  } catch (err) {
    console.error("[Speech] Setup failed:", err);
    return false;
  }
}
