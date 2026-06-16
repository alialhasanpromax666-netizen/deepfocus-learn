// Arabic-aware tokenization + normalization.
// Recitation rarely matches the written text byte-for-byte: diacritics (tashkeel)
// are dropped, alef/hamza/taa-marbuta forms vary, and digits differ. We normalize
// these away for *matching* while keeping the original surface form for *display*.

export interface Token {
  /** original text as written, used for rendering/highlighting. */
  surface: string;
  /** normalized form used for comparison. */
  norm: string;
  /** char offset of `surface` within the source string. */
  start: number;
  /** char offset (exclusive) of the end of `surface`. */
  end: number;
}

// Tashkeel / harakat + tatweel — stripped entirely.
const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۨ-ۭـ]/g;

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const EXT_ARABIC_INDIC = "۰۱۲۳۴۵۶۷۸۹";

function foldDigits(ch: string): string {
  const a = ARABIC_INDIC.indexOf(ch);
  if (a >= 0) return String(a);
  const b = EXT_ARABIC_INDIC.indexOf(ch);
  if (b >= 0) return String(b);
  return ch;
}

/** Collapse orthographic variants so spoken ≈ written compare cleanly. */
export function normalizeWord(raw: string): string {
  let s = raw.normalize("NFC").replace(DIACRITICS, "");
  let out = "";
  for (const ch of s) {
    let c = ch;
    // alef variants -> bare alef
    if ("أإآٱ".includes(c)) c = "ا";
    // alef maksura -> yaa
    else if (c === "ى") c = "ي";
    // taa marbuta -> haa
    else if (c === "ة") c = "ه";
    // hamza carriers -> base letter
    else if (c === "ؤ") c = "و";
    else if (c === "ئ") c = "ي";
    else if (c === "ء") c = "";
    else c = foldDigits(c);
    out += c;
  }
  return out.toLowerCase();
}

// A "word" is a run of letters/marks/digits; everything else is a separator.
const WORD_RE =
  /[\p{L}\p{M}\p{N}]+/gu;

/** Split text into comparable tokens, preserving source offsets. */
export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  for (const m of text.matchAll(WORD_RE)) {
    const surface = m[0];
    const norm = normalizeWord(surface);
    if (!norm) continue; // pure-punctuation / stripped hamza
    tokens.push({
      surface,
      norm,
      start: m.index ?? 0,
      end: (m.index ?? 0) + surface.length,
    });
  }
  return tokens;
}

/** Split into sentences for flashcard context (Arabic + Latin punctuation). */
export function splitSentences(text: string): { text: string; start: number; end: number }[] {
  const out: { text: string; start: number; end: number }[] = [];
  const re = /[^.!?؟।\n]+[.!?؟।\n]?/g;
  for (const m of text.matchAll(re)) {
    const seg = m[0].trim();
    if (seg) out.push({ text: seg, start: m.index ?? 0, end: (m.index ?? 0) + m[0].length });
  }
  return out;
}
