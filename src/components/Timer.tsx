interface TimerProps {
  elapsedMs: number;
  durationMs?: number;
}

function fmt(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Timer({ elapsedMs, durationMs = 0 }: TimerProps) {
  const remaining = durationMs > 0 ? durationMs - elapsedMs : 0;
  const ratio = durationMs > 0 ? Math.min(1, elapsedMs / durationMs) : 0;
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(2.4rem, 9vw, 3.6rem)",
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "var(--text)",
        }}
      >
        {durationMs > 0 ? fmt(remaining) : fmt(elapsedMs)}
      </div>
      {durationMs > 0 && (
        <div
          aria-hidden
          style={{
            height: 4,
            width: 200,
            margin: "8px auto 0",
            borderRadius: 4,
            background: "var(--calm)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${ratio * 100}%`,
              background: "var(--focus)",
              transition: "width 0.3s linear",
            }}
          />
        </div>
      )}
    </div>
  );
}
