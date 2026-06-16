import type {
  SpeechProvider,
  SpeechStartOptions,
  SpeechResultHandler,
  SpeechErrorHandler,
  VoidHandler,
} from "./types";

// Minimal Web Speech API typings (not in lib.dom for all targets).
interface SRAlternative {
  transcript: string;
  confidence: number;
}
interface SRResult {
  isFinal: boolean;
  0: SRAlternative;
  length: number;
}
interface SRResultList {
  length: number;
  [index: number]: SRResult;
}
interface SREvent extends Event {
  resultIndex: number;
  results: SRResultList;
}
interface SRErrorEvent extends Event {
  error: string;
  message: string;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SRConstructor = new () => SpeechRecognitionLike;

function getSR(): SRConstructor | null {
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Web Speech API implementation. Browsers end recognition periodically even in
 * "continuous" mode, so we transparently restart while the caller still wants
 * to listen — giving a seamless long-running session.
 */
export class WebSpeechProvider implements SpeechProvider {
  readonly supported: boolean;
  private SR: SRConstructor | null;
  private rec: SpeechRecognitionLike | null = null;
  private active = false;
  private lang = "ar-SA";

  private resultCb: SpeechResultHandler = () => {};
  private errorCb: SpeechErrorHandler = () => {};
  private endCb: VoidHandler = () => {};

  constructor() {
    this.SR = getSR();
    this.supported = this.SR !== null;
  }

  async start(opts: SpeechStartOptions): Promise<void> {
    if (!this.SR) throw new Error("speech-recognition-unsupported");
    this.lang = opts.lang;
    this.active = true;
    this.spinUp();
  }

  private spinUp() {
    if (!this.SR || !this.active) return;
    const rec = new this.SR();
    rec.lang = this.lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e: SREvent) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const alt = r[0];
        this.resultCb({
          transcript: alt.transcript,
          isFinal: r.isFinal,
          confidence: alt.confidence,
        });
      }
    };
    rec.onerror = (e: SRErrorEvent) => {
      // "no-speech" / "aborted" are benign during a long session.
      if (e.error !== "no-speech" && e.error !== "aborted") {
        this.errorCb(e.error, e.message || e.error);
      }
    };
    rec.onend = () => {
      this.endCb();
      if (this.active) {
        // browser auto-stopped; restart to keep the session alive.
        this.spinUp();
      }
    };

    this.rec = rec;
    try {
      rec.start();
    } catch {
      // start() throws if called too soon after a previous instance; retry next tick.
      if (this.active) setTimeout(() => this.spinUp(), 250);
    }
  }

  stop(): void {
    this.active = false;
    if (this.rec) {
      try {
        this.rec.stop();
      } catch {
        /* ignore */
      }
      this.rec = null;
    }
  }

  onResult(cb: SpeechResultHandler): void {
    this.resultCb = cb;
  }
  onError(cb: SpeechErrorHandler): void {
    this.errorCb = cb;
  }
  onEnd(cb: VoidHandler): void {
    this.endCb = cb;
  }
}
