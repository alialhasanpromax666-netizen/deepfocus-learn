import type { Token } from "./tokenize";

export type AlignOpKind = "match" | "substitution" | "omission" | "insertion";

/**
 * One step of the alignment between the reference (lesson) and the
 * hypothesis (what the learner said).
 *  - match:        ref token correctly recited
 *  - substitution: ref token said wrong (ref + hyp present, differ)
 *  - omission:     ref token skipped (ref present, no hyp)
 *  - insertion:    extra word said not in ref (hyp present, no ref)
 */
export interface AlignOp {
  kind: AlignOpKind;
  ref?: Token;
  hyp?: Token;
  refIndex?: number;
  hypIndex?: number;
}

export interface DiffResult {
  ops: AlignOp[];
  /** correct ref tokens / total ref tokens (0..1). */
  accuracy: number;
  matched: number;
  total: number;
}
