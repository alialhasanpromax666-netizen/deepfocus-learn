import type { CSSProperties } from "react";
import type { DiffResult } from "@/compare";

interface TranscriptViewProps {
  /** alignment vs reference; null when studying without a reference. */
  diff: DiffResult | null;
  /** finalized free transcript (used when no reference). */
  freeText: string;
  /** live interim guess. */
  interim: string;
  expectedLabel: string;
  youSaidLabel: string;
}

const baseWord: CSSProperties = {
  padding: "1px 3px",
  borderRadius: 4,
  margin: "0 1px",
};

export function TranscriptView({
  diff,
  freeText,
  interim,
  expectedLabel,
  youSaidLabel,
}: TranscriptViewProps) {
  // No reference: simple live transcript.
  if (!diff) {
    return (
      <div className="scroll grow" style={{ fontSize: "1.5rem", lineHeight: 2, padding: 4 }}>
        <span>{freeText} </span>
        {interim && <span style={{ color: "var(--text-faint)" }}>{interim}</span>}
        {!freeText && !interim && (
          <span style={{ color: "var(--text-faint)" }}>…</span>
        )}
      </div>
    );
  }

  return (
    <div className="scroll grow" style={{ fontSize: "1.5rem", lineHeight: 2.1, padding: 4 }}>
      {diff.ops.map((op, i) => {
        if (op.kind === "match") {
          return (
            <span key={i} style={{ ...baseWord, color: "var(--focus)" }}>
              {op.ref!.surface}{" "}
            </span>
          );
        }
        if (op.kind === "substitution") {
          return (
            <span
              key={i}
              title={`${youSaidLabel}: ${op.hyp?.surface ?? ""} · ${expectedLabel}: ${op.ref!.surface}`}
              style={{
                ...baseWord,
                color: "var(--error)",
                background: "var(--error-soft)",
                textDecoration: "underline wavy var(--error)",
                textUnderlineOffset: 4,
              }}
            >
              {op.ref!.surface}{" "}
            </span>
          );
        }
        if (op.kind === "omission") {
          return (
            <span
              key={i}
              title={expectedLabel}
              style={{
                ...baseWord,
                color: "var(--text-faint)",
                textDecoration: "line-through",
                opacity: 0.7,
              }}
            >
              {op.ref!.surface}{" "}
            </span>
          );
        }
        // insertion: extra word the learner said that isn't in the lesson
        return (
          <span
            key={i}
            style={{ ...baseWord, color: "var(--warn)", fontSize: "0.85em", opacity: 0.8 }}
          >
            +{op.hyp!.surface}{" "}
          </span>
        );
      })}
      {interim && <span style={{ color: "var(--text-faint)" }}>{interim}</span>}
    </div>
  );
}
