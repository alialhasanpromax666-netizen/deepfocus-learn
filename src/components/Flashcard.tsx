import { useState } from "react";
import type { Flashcard as Card } from "@/cards";

const SOURCE_COLOR: Record<Card["source"], string> = {
  mistake: "var(--error)",
  omission: "var(--text-faint)",
  hesitation: "var(--warn)",
};

interface FlashcardProps {
  card: Card;
  questionLabel: string;
  answerLabel: string;
}

export function Flashcard({ card, questionLabel, answerLabel }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="card fade-in"
      style={{
        textAlign: "start",
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderInlineStart: `3px solid ${SOURCE_COLOR[card.source]}`,
        width: "100%",
      }}
    >
      <span
        style={{
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-faint)",
        }}
      >
        {flipped ? answerLabel : questionLabel}
      </span>
      <span style={{ fontSize: "1.15rem", lineHeight: 1.7 }}>
        {flipped ? card.answer : card.question}
      </span>
    </button>
  );
}
