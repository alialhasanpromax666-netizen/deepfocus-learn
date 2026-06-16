import { create } from "zustand";
import type { SessionPhase, TranscriptChunk, FocusBreak } from "@/types";
import { createSpeechProvider, MicMeter, HesitationDetector, SPEECH_LANG } from "@/audio";
import type { SpeechProvider } from "@/audio";
import { createFocusController, type FocusController } from "@/focus/focusMode";
import { diffText, type DiffResult } from "@/compare";
import { useSettings } from "./settingsStore";
import { useI18n } from "@/i18n";

let idSeq = 0;
const nextId = () => `${Date.now().toString(36)}-${idSeq++}`;

interface SessionState {
  phase: SessionPhase;
  startedAt: number | null;
  elapsedMs: number;
  durationMs: number;

  chunks: TranscriptChunk[];
  interim: string;
  /** live alignment vs reference (null when no reference text). */
  diff: DiffResult | null;
  /** index of the furthest correctly-recited reference token. */
  refCursor: number;
  hesitationMarks: { at: number; refIndex: number }[];
  focusBreaks: FocusBreak[];
  micLevel: number;
  error: string | null;
  warning: string | null;

  // actions
  goLock: () => void;
  beginListening: () => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  end: () => void;
  reset: () => void;
}

// --- side-effecting singletons (kept out of reactive state) ---
let speech: SpeechProvider | null = null;
let meter: MicMeter | null = null;
let hesitation: HesitationDetector | null = null;
let focus: FocusController | null = null;
let ticker: ReturnType<typeof setInterval> | null = null;
let accumPausedMs = 0;
let pausedAt = 0;

function spokenText(chunks: TranscriptChunk[]): string {
  return chunks.map((c) => c.text).join(" ");
}

export const useSession = create<SessionState>((set, get) => {
  const recompute = () => {
    const ref = useSettings.getState().referenceText.trim();
    if (!ref) return;
    const diff = diffText(ref, spokenText(get().chunks));
    let cursor = 0;
    for (const op of diff.ops) {
      if (op.kind === "match" && op.refIndex !== undefined) cursor = op.refIndex + 1;
    }
    set({ diff, refCursor: cursor });
  };

  const startTicker = () => {
    if (ticker) clearInterval(ticker);
    ticker = setInterval(() => {
      const { startedAt, phase, durationMs } = get();
      if (startedAt === null || phase === "paused") return;
      const elapsed = Date.now() - startedAt - accumPausedMs;
      set({ elapsedMs: elapsed });
      if (durationMs > 0 && elapsed >= durationMs) get().end();
    }, 250);
  };

  const wireSpeech = () => {
    speech = createSpeechProvider();
    if (!speech.supported) {
      set({ error: "stt-unsupported" });
      return;
    }
    speech.onResult((r) => {
      hesitation?.ping();
      if (r.isFinal) {
        const text = r.transcript.trim();
        if (!text) return;
        const chunk: TranscriptChunk = {
          id: nextId(),
          text,
          at: get().elapsedMs,
          confidence: r.confidence,
        };
        set({ chunks: [...get().chunks, chunk], interim: "" });
        recompute();
      } else {
        set({ interim: r.transcript });
      }
    });
    speech.onError((code) => {
      if (code === "not-allowed" || code === "service-not-allowed") {
        set({ error: "mic-denied" });
      }
    });
  };

  const wireFocus = () => {
    focus = createFocusController();
    focus.onBreak((b) => {
      set({ focusBreaks: [...get().focusBreaks, b], warning: "focus-break" });
      setTimeout(() => {
        if (get().warning === "focus-break") set({ warning: null });
      }, 2500);
    });
  };

  return {
    phase: "idle",
    startedAt: null,
    elapsedMs: 0,
    durationMs: 0,
    chunks: [],
    interim: "",
    diff: null,
    refCursor: 0,
    hesitationMarks: [],
    focusBreaks: [],
    micLevel: 0,
    error: null,
    warning: null,

    goLock: () => {
      set({ phase: "locked", error: null });
    },

    beginListening: async () => {
      const settings = useSettings.getState();
      const lang = useI18n.getState().lang;
      set({
        phase: "listening",
        startedAt: Date.now(),
        elapsedMs: 0,
        durationMs: settings.durationMin * 60_000,
        chunks: [],
        interim: "",
        hesitationMarks: [],
        focusBreaks: [],
        diff: null,
        refCursor: 0,
        error: null,
        warning: null,
      });
      accumPausedMs = 0;

      wireFocus();
      await focus!.enter();

      meter = new MicMeter();
      meter.onLevel((micLevel) => set({ micLevel }));

      hesitation = new HesitationDetector({ thresholdMs: settings.hesitationMs });
      hesitation.onHesitation(() => {
        set({
          hesitationMarks: [
            ...get().hesitationMarks,
            { at: get().elapsedMs, refIndex: get().refCursor },
          ],
        });
      });

      wireSpeech();
      try {
        await meter.start();
        if (speech?.supported) await speech.start({ lang: SPEECH_LANG[lang] });
        hesitation.start();
        startTicker();
      } catch {
        set({ error: "mic-denied" });
      }
    },

    pause: () => {
      if (get().phase !== "listening") return;
      pausedAt = Date.now();
      speech?.stop();
      hesitation?.stop();
      set({ phase: "paused", interim: "", micLevel: 0 });
    },

    resume: async () => {
      if (get().phase !== "paused") return;
      accumPausedMs += Date.now() - pausedAt;
      const lang = useI18n.getState().lang;
      wireSpeech();
      hesitation = new HesitationDetector({
        thresholdMs: useSettings.getState().hesitationMs,
      });
      hesitation.onHesitation(() => {
        set({
          hesitationMarks: [
            ...get().hesitationMarks,
            { at: get().elapsedMs, refIndex: get().refCursor },
          ],
        });
      });
      hesitation.start();
      if (speech?.supported) await speech.start({ lang: SPEECH_LANG[lang] });
      set({ phase: "listening" });
    },

    end: () => {
      speech?.stop();
      hesitation?.stop();
      meter?.stop();
      void focus?.exit();
      if (ticker) clearInterval(ticker);
      ticker = null;
      recompute();
      const s = get();
      /* push session history */
      const ref = useSettings.getState().referenceText.trim();
      let accuracy = 0;
      if (ref && s.diff) {
        const total = ref.split(/\s+/).length;
        const matched = s.refCursor;
        accuracy = total > 0 ? matched / total : 0;
      }
      useSettings.getState().pushSession({
        id: `${Date.now().toString(36)}`,
        date: Date.now(),
        durationMs: s.elapsedMs,
        subject: useSettings.getState().subject,
        accuracy,
        difficulty: useSettings.getState().difficulty,
      });
      set({ phase: "report", interim: "", micLevel: 0 });
    },

    reset: () => {
      speech?.stop();
      hesitation?.stop();
      meter?.stop();
      focus?.dispose();
      if (ticker) clearInterval(ticker);
      ticker = null;
      speech = meter = hesitation = focus = null;
      accumPausedMs = 0;
      set({
        phase: "idle",
        startedAt: null,
        elapsedMs: 0,
        durationMs: 0,
        chunks: [],
        interim: "",
        diff: null,
        refCursor: 0,
        hesitationMarks: [],
        focusBreaks: [],
        micLevel: 0,
        error: null,
        warning: null,
      });
    },
  };
});
