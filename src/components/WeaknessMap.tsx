import type { WeaknessSegment } from "@/cards";

interface WeaknessMapProps {
  segments: WeaknessSegment[];
  emptyLabel: string;
}

/** Simple stacked-bar diagram: one column per lesson sentence, height = severity. */
export function WeaknessMap({ segments, emptyLabel }: WeaknessMapProps) {
  if (!segments.length) {
    return <p className="faint">{emptyLabel}</p>;
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height: 160,
        padding: "8px 4px",
        overflowX: "auto",
      }}
    >
      {segments.map((s) => {
        const total = s.mistakes + s.omissions + s.hesitations;
        const h = 12 + s.severity * 130;
        return (
          <div
            key={s.label}
            title={`#${s.label} · ✗${s.mistakes} ⊘${s.omissions} ~${s.hesitations}`}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 22,
                height: h,
                borderRadius: 5,
                display: "flex",
                flexDirection: "column-reverse",
                overflow: "hidden",
                background: total === 0 ? "var(--focus-soft)" : "var(--calm)",
                border: "1px solid var(--line)",
              }}
            >
              {s.mistakes > 0 && (
                <div style={{ flex: s.mistakes, background: "var(--error)" }} />
              )}
              {s.omissions > 0 && (
                <div style={{ flex: s.omissions, background: "var(--text-faint)" }} />
              )}
              {s.hesitations > 0 && (
                <div style={{ flex: s.hesitations, background: "var(--warn)" }} />
              )}
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-faint)" }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
