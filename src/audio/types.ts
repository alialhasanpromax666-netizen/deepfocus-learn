// Provider-agnostic speech-to-text contract.
// The app depends only on this interface; the default implementation uses the
// browser Web Speech API, but a cloud provider (Whisper, Google, Deepgram…)
// can be dropped in by implementing the same shape.

export interface SpeechResult {
  /** recognized text for this segment. */
  transcript: string;
  /** true once the engine commits the segment (vs. live interim guess). */
  isFinal: boolean;
  /** 0..1 if the engine reports it. */
  confidence?: number;
}

export type SpeechResultHandler = (r: SpeechResult) => void;
export type SpeechErrorHandler = (code: string, message: string) => void;
export type VoidHandler = () => void;

export interface SpeechStartOptions {
  /** BCP-47 tag, e.g. "ar-SA" or "en-US". */
  lang: string;
}

export interface SpeechProvider {
  /** whether this provider can run in the current environment. */
  readonly supported: boolean;
  start(opts: SpeechStartOptions): Promise<void>;
  stop(): void;
  onResult(cb: SpeechResultHandler): void;
  onError(cb: SpeechErrorHandler): void;
  /** fires when the underlying engine stops (may auto-restart internally). */
  onEnd(cb: VoidHandler): void;
}

export const SPEECH_LANG: Record<"ar" | "en", string> = {
  ar: "ar-SA",
  en: "en-US",
};
