// Live microphone level meter — drives the pulsing "Speak" button so the
// learner gets immediate proof the tutor is hearing them.

export class MicMeter {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private raf = 0;
  private data: Uint8Array<ArrayBuffer> = new Uint8Array(new ArrayBuffer(0));
  private levelCb: (level: number) => void = () => {};

  get active() {
    return this.ctx !== null;
  }

  onLevel(cb: (level: number) => void) {
    this.levelCb = cb;
  }

  async start(): Promise<void> {
    if (this.ctx) return;
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    const src = this.ctx.createMediaStreamSource(this.stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.data = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
    src.connect(this.analyser);
    this.loop();
  }

  private loop = () => {
    if (!this.analyser) return;
    this.analyser.getByteTimeDomainData(this.data);
    // RMS around the 128 midpoint -> 0..1
    let sum = 0;
    for (let i = 0; i < this.data.length; i++) {
      const v = (this.data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / this.data.length);
    this.levelCb(Math.min(1, rms * 3));
    this.raf = requestAnimationFrame(this.loop);
  };

  stop(): void {
    cancelAnimationFrame(this.raf);
    this.stream?.getTracks().forEach((t) => t.stop());
    void this.ctx?.close();
    this.ctx = null;
    this.analyser = null;
    this.stream = null;
    this.levelCb(0);
  }
}
