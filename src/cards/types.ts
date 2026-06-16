import type { WeakPoint } from "@/types";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  source: WeakPoint["kind"];
}

/** One column of the weakness-map diagram. */
export interface WeaknessSegment {
  label: string;
  mistakes: number;
  omissions: number;
  hesitations: number;
  /** 0..1 strength for the bar height (1 = weakest). */
  severity: number;
}

export interface SessionReport {
  fullText: string;
  accuracy: number; // 0..1
  wordsSpoken: number;
  weakPoints: WeakPoint[];
  flashcards: Flashcard[];
  segments: WeaknessSegment[];
  counts: { mistakes: number; omissions: number; hesitations: number };
}
