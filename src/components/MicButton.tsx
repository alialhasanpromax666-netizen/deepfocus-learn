interface MicButtonProps {
  listening: boolean;
  level: number; // 0..1
  label: string;
  onClick: () => void;
}

export function MicButton({ listening, level, label, onClick }: MicButtonProps) {
  const scale = listening ? 1 + level * 0.35 : 1;
  return (
    <div style={{ display: "grid", placeItems: "center", gap: 14 }}>
      <button
        onClick={onClick}
        aria-pressed={listening}
        aria-label={label}
        style={{
          position: "relative",
          width: 132,
          height: 132,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: listening ? "var(--focus)" : "var(--calm-2)",
          color: listening ? "#06231a" : "var(--text)",
          border: `2px solid ${listening ? "transparent" : "var(--line)"}`,
          boxShadow: listening
            ? `0 0 ${20 + level * 60}px rgba(52,211,153,${0.3 + level * 0.5})`
            : "none",
          transition: "background 0.25s ease, box-shadow 0.1s linear",
        }}
      >
        <span
          aria-hidden
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.08s ease-out",
            fontSize: 44,
            lineHeight: 1,
          }}
        >
          {listening ? "●" : "🎤"}
        </span>
      </button>
      <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-dim)" }}>
        {label}
      </span>
    </div>
  );
}
