// Best-effort "focus lock" for the web. A browser tab cannot truly block other
// apps or notifications — only a native shell (Capacitor/Tauri/Electron + OS
// APIs) can. What the web *can* do:
//   • go fullscreen (hides browser chrome, other tabs)
//   • hold a wake lock (screen stays on)
//   • detect when the learner leaves (tab hidden, window blurred, fullscreen exit)
// We surface those departures as "focus breaks" so the tutor can hold the learner
// accountable. The interface below is the seam a native module would implement.

import type { FocusBreak } from "@/types";

type WakeLockSentinelLike = { release: () => Promise<void> };

export interface FocusController {
  enter(): Promise<void>;
  exit(): Promise<void>;
  onBreak(cb: (b: FocusBreak) => void): void;
  dispose(): void;
}

export function createFocusController(now: () => number = () => Date.now()): FocusController {
  let wakeLock: WakeLockSentinelLike | null = null;
  let breakCb: (b: FocusBreak) => void = () => {};
  let leftAt = 0;
  let engaged = false;

  const markLeave = (reason: FocusBreak["reason"]) => {
    if (!engaged || leftAt) return;
    leftAt = now();
    // store reason on the pending break via closure
    pendingReason = reason;
  };
  let pendingReason: FocusBreak["reason"] = "blur";

  const markReturn = () => {
    if (!engaged || !leftAt) return;
    breakCb({ at: leftAt, reason: pendingReason, durationMs: now() - leftAt });
    leftAt = 0;
  };

  const onVisibility = () => {
    if (document.hidden) markLeave("hidden");
    else markReturn();
  };
  const onBlur = () => markLeave("blur");
  const onFocus = () => markReturn();
  const onFsChange = () => {
    if (engaged && !document.fullscreenElement) {
      breakCb({ at: now(), reason: "exit-fullscreen", durationMs: 0 });
    }
  };

  async function acquireWakeLock() {
    try {
      const nav = navigator as unknown as {
        wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinelLike> };
      };
      if (nav.wakeLock) wakeLock = await nav.wakeLock.request("screen");
    } catch {
      /* wake lock is a nice-to-have */
    }
  }

  return {
    async enter() {
      engaged = true;
      try {
        await document.documentElement.requestFullscreen?.();
      } catch {
        /* fullscreen can be refused; continue regardless */
      }
      await acquireWakeLock();
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("blur", onBlur);
      window.addEventListener("focus", onFocus);
      document.addEventListener("fullscreenchange", onFsChange);
    },
    async exit() {
      engaged = false;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("fullscreenchange", onFsChange);
      await wakeLock?.release().catch(() => {});
      wakeLock = null;
      if (document.fullscreenElement) await document.exitFullscreen?.().catch(() => {});
    },
    onBreak(cb) {
      breakCb = cb;
    },
    dispose() {
      void this.exit();
    },
  };
}
