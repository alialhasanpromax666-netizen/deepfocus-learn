import { tokenize, type Token } from "./tokenize";
import type { AlignOp, DiffResult } from "./types";

/**
 * Token-level alignment via edit distance (Needleman–Wunsch / Levenshtein DP).
 * ref = the lesson text, hyp = what the learner actually said.
 * Produces an ordered op list that drives both highlighting and weak points.
 */
export function diffTokens(refTokens: Token[], hypTokens: Token[]): DiffResult {
  const n = refTokens.length;
  const m = hypTokens.length;

  // dp[i][j] = min edits to align ref[0..i) with hyp[0..j)
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i; // delete all ref -> omissions
  for (let j = 0; j <= m; j++) dp[0][j] = j; // insert all hyp -> insertions

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const same = refTokens[i - 1].norm === hypTokens[j - 1].norm;
      const subCost = dp[i - 1][j - 1] + (same ? 0 : 1);
      const delCost = dp[i - 1][j] + 1; // omission
      const insCost = dp[i][j - 1] + 1; // insertion
      dp[i][j] = Math.min(subCost, delCost, insCost);
    }
  }

  // Backtrack into ordered ops.
  const ops: AlignOp[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const same = refTokens[i - 1].norm === hypTokens[j - 1].norm;
      if (dp[i][j] === dp[i - 1][j - 1] + (same ? 0 : 1)) {
        ops.push({
          kind: same ? "match" : "substitution",
          ref: refTokens[i - 1],
          hyp: hypTokens[j - 1],
          refIndex: i - 1,
          hypIndex: j - 1,
        });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ kind: "omission", ref: refTokens[i - 1], refIndex: i - 1 });
      i--;
      continue;
    }
    // remaining: insertion
    ops.push({ kind: "insertion", hyp: hypTokens[j - 1], hypIndex: j - 1 });
    j--;
  }
  ops.reverse();

  const matched = ops.filter((o) => o.kind === "match").length;
  const total = n || 1;
  return { ops, matched, total: n, accuracy: matched / total };
}

/** Convenience: diff raw strings. */
export function diffText(reference: string, spoken: string): DiffResult {
  return diffTokens(tokenize(reference), tokenize(spoken));
}
