import type { TranscriptChunk, WeakPoint } from "@/types";
import { tokenize, splitSentences, type DiffResult } from "@/compare";
import type { Flashcard, SessionReport, WeaknessSegment } from "./types";

let cardSeq = 0;
const cid = () => `c${cardSeq++}`;

interface BuildInput {
  referenceText: string;
  chunks: TranscriptChunk[];
  diff: DiffResult | null;
  hesitationMarks: { at: number; refIndex: number }[];
}

/** Find the reference sentence that contains a given char offset. */
function sentenceAt(referenceText: string, charOffset: number): string {
  const sentences = splitSentences(referenceText);
  for (const s of sentences) {
    if (charOffset >= s.start && charOffset < s.end) return s.text;
  }
  return sentences[0]?.text ?? referenceText.slice(0, 80);
}

/** Turn diff ops + hesitations into weak points anchored in the lesson. */
function deriveWeakPoints(input: BuildInput): WeakPoint[] {
  const { referenceText, diff, hesitationMarks } = input;
  const points: WeakPoint[] = [];
  if (diff) {
    for (const op of diff.ops) {
      if (op.kind === "substitution" && op.ref) {
        points.push({
          id: `w${points.length}`,
          kind: "mistake",
          refIndex: op.refIndex ?? 0,
          expected: op.ref.surface,
          actual: op.hyp?.surface ?? "",
          context: sentenceAt(referenceText, op.ref.start),
          at: 0,
        });
      } else if (op.kind === "omission" && op.ref) {
        points.push({
          id: `w${points.length}`,
          kind: "omission",
          refIndex: op.refIndex ?? 0,
          expected: op.ref.surface,
          actual: "",
          context: sentenceAt(referenceText, op.ref.start),
          at: 0,
        });
      }
    }
  }
  const refTokens = tokenize(referenceText);
  for (const h of hesitationMarks) {
    const tok = refTokens[Math.min(h.refIndex, refTokens.length - 1)];
    points.push({
      id: `w${points.length}`,
      kind: "hesitation",
      refIndex: h.refIndex,
      expected: tok?.surface ?? "",
      actual: "",
      context: tok ? sentenceAt(referenceText, tok.start) : "",
      at: h.at,
    });
  }
  return points;
}

/** Blank out the expected word in its sentence to make a cloze question. */
function clozeQuestion(context: string, expected: string): string {
  if (!expected) return context;
  const re = new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return context.replace(re, "‗‗‗‗");
}

function makeFlashcards(weakPoints: WeakPoint[]): Flashcard[] {
  const seen = new Set<string>();
  const cards: Flashcard[] = [];
  for (const wp of weakPoints) {
    if (!wp.context) continue;
    const key = `${wp.kind}:${wp.context}:${wp.expected}`;
    if (seen.has(key)) continue;
    seen.add(key);
    cards.push({
      id: cid(),
      question: clozeQuestion(wp.context, wp.expected),
      answer: wp.context,
      source: wp.kind,
    });
  }
  return cards;
}

/** Bucket weak points by reference sentence for the weakness-map diagram. */
function buildSegments(referenceText: string, weakPoints: WeakPoint[]): WeaknessSegment[] {
  const sentences = splitSentences(referenceText);
  if (!sentences.length) return [];
  const refTokens = tokenize(referenceText);

  const segs: WeaknessSegment[] = sentences.map((_s, i) => ({
    label: `${i + 1}`,
    mistakes: 0,
    omissions: 0,
    hesitations: 0,
    severity: 0,
  }));

  const findSeg = (refIndex: number): number => {
    const tok = refTokens[Math.min(refIndex, refTokens.length - 1)];
    if (!tok) return 0;
    const idx = sentences.findIndex((s) => tok.start >= s.start && tok.start < s.end);
    return idx < 0 ? 0 : idx;
  };

  for (const wp of weakPoints) {
    const si = findSeg(wp.refIndex);
    if (wp.kind === "mistake") segs[si].mistakes++;
    else if (wp.kind === "omission") segs[si].omissions++;
    else segs[si].hesitations++;
  }

  const max = Math.max(1, ...segs.map((s) => s.mistakes + s.omissions + s.hesitations));
  for (const s of segs) s.severity = (s.mistakes + s.omissions + s.hesitations) / max;
  return segs;
}

export function buildReport(input: BuildInput): SessionReport {
  const fullText = input.chunks.map((c) => c.text).join(" ").trim();
  const weakPoints = deriveWeakPoints(input);
  const counts = {
    mistakes: weakPoints.filter((w) => w.kind === "mistake").length,
    omissions: weakPoints.filter((w) => w.kind === "omission").length,
    hesitations: weakPoints.filter((w) => w.kind === "hesitation").length,
  };
  return {
    fullText,
    accuracy: input.diff ? input.diff.accuracy : 0,
    wordsSpoken: tokenize(fullText).length,
    weakPoints,
    flashcards: makeFlashcards(weakPoints),
    segments: input.referenceText.trim() ? buildSegments(input.referenceText, weakPoints) : [],
    counts,
  };
}
