// Shared domain types for DeepFocus Learn.

export type Lang = "ar" | "en";

export type SessionPhase =
  | "idle" // not started — setup screen
  | "locked" // focus lock engaged, about to begin
  | "listening" // actively recording + transcribing
  | "paused" // mic paused, session still running
  | "report"; // session ended, showing feedback

/** A finalized chunk of recognized speech. */
export interface TranscriptChunk {
  id: string;
  text: string;
  /** ms since session start when this chunk was finalized. */
  at: number;
  /** confidence 0..1 from the speech provider, if available. */
  confidence?: number;
}

export type WeakPointKind = "mistake" | "omission" | "hesitation";

/** A flagged spot in the lesson the learner struggled with. */
export interface WeakPoint {
  id: string;
  kind: WeakPointKind;
  /** index into the reference token list where the issue occurred. */
  refIndex: number;
  /** the expected reference word(s). */
  expected: string;
  /** what the learner actually said (empty for omissions). */
  actual: string;
  /** surrounding reference sentence, for context + flashcards. */
  context: string;
  /** ms since session start. */
  at: number;
}

/** A focus break recorded while the session was locked. */
export interface FocusBreak {
  at: number;
  reason: "blur" | "hidden" | "exit-fullscreen";
  durationMs: number;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface AttachedFile {
  id: string;
  name: string;
  content: string;
  type: "text" | "url";
  addedAt: number;
}

export interface SessionHistoryEntry {
  id: string;
  date: number;
  durationMs: number;
  subject: string;
  accuracy: number;
  difficulty: Difficulty;
}
