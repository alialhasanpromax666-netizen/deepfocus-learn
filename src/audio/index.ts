export { WebSpeechProvider } from "./webSpeechProvider";
export { MicMeter } from "./micMeter";
export { HesitationDetector, type HesitationConfig } from "./hesitation";
export { SPEECH_LANG } from "./types";
export type {
  SpeechProvider,
  SpeechResult,
  SpeechResultHandler,
  SpeechErrorHandler,
  SpeechStartOptions,
} from "./types";

import { WebSpeechProvider } from "./webSpeechProvider";
import type { SpeechProvider } from "./types";

/** Factory — swap here to use a cloud STT provider instead. */
export function createSpeechProvider(): SpeechProvider {
  return new WebSpeechProvider();
}
