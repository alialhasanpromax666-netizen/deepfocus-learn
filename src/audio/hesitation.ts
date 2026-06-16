// Hesitation detector. While listening, a long silence *between* recognized
// speech is treated as the learner getting stuck — a candidate weak point.
// The detector is time-source-injectable so it stays deterministic in tests.

export interface HesitationConfig {
  /** silence longer than this (ms) counts as a hesitation. */
  thresholdMs: number;
  now?: () => number;
}

export class HesitationDetector {
  private lastActivity: number;
  private threshold: number;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private now: () => number;
  private cb: (durationMs: number) => void = () => {};
  private running = false;

  constructor(cfg: HesitationConfig) {
    this.threshold = cfg.thresholdMs;
    this.now = cfg.now ?? (() => Date.now());
    this.lastActivity = this.now();
  }

  onHesitation(cb: (durationMs: number) => void) {
    this.cb = cb;
  }

  start() {
    this.running = true;
    this.lastActivity = this.now();
    this.arm();
  }

  /** call whenever speech is recognized (interim or final). */
  ping() {
    this.lastActivity = this.now();
    this.arm();
  }

  private arm() {
    if (!this.running) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (!this.running) return;
      const gap = this.now() - this.lastActivity;
      if (gap >= this.threshold) {
        this.cb(gap);
        this.lastActivity = this.now(); // avoid repeat-firing for the same pause
        this.arm();
      }
    }, this.threshold);
  }

  stop() {
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }
}
