import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/shared/Primitives";
import type { LearningItem } from "@/types";

type Flashcard = { prompt: string; answer: string };

const decks: Record<string, Flashcard[]> = {
  "Chemical Bonding": [
    {
      prompt: "What is an ionic bond?",
      answer:
        "An attraction between oppositely charged ions formed after electrons transfer from one atom to another.",
    },
    {
      prompt: "What is a covalent bond?",
      answer: "A bond where atoms share one or more pairs of electrons.",
    },
    {
      prompt: "What makes a molecule polar?",
      answer: "Unequal sharing of electrons creates partial charges across the molecule.",
    },
  ],
  "Probability Basics": [
    {
      prompt: "What is the probability of an event?",
      answer:
        "The number of favourable outcomes divided by the total number of equally likely outcomes.",
    },
    { prompt: "What is the probability of an impossible event?", answer: "Zero." },
    { prompt: "What is the complement rule?", answer: "P(not A) = 1 − P(A)." },
  ],
};

const fallbackDeck: Flashcard[] = [
  {
    prompt: "What is the key idea in this lesson?",
    answer: "Explain the main concept in your own words, then connect it to a worked example.",
  },
  {
    prompt: "How do you know you understand it?",
    answer:
      "You can solve a new example without looking at the notes and explain why each step works.",
  },
  {
    prompt: "What should you practise next?",
    answer: "Try one easier recall question and one harder application question.",
  },
];

export function FlashcardDeck({
  item,
  onComplete,
}: {
  item: LearningItem;
  onComplete: () => void;
}) {
  const cards = decks[item.title] ?? fallbackDeck;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const card = cards[index];
  const finished = known.size === cards.length;

  if (!card) return null;

  function rateCard(knewIt: boolean) {
    setKnown((current) => {
      const next = new Set(current);
      if (knewIt) next.add(index);
      return next;
    });
    setFlipped(false);
    if (index < cards.length - 1) setIndex(index + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{item.title} deck</p>
          <p className="text-xs text-muted-foreground">
            Card {index + 1} of {cards.length}
          </p>
        </div>
        <span className="text-xs font-medium text-primary">
          {known.size}/{cards.length} mastered
        </span>
      </div>
      <ProgressBar value={(known.size / cards.length) * 100} label="Flashcard mastery" />

      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="group min-h-56 w-full rounded-2xl border border-primary/20 bg-primary-soft p-8 text-center shadow-sm transition-transform hover:-translate-y-0.5"
        aria-label={flipped ? "Show question" : "Show answer"}
      >
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          {flipped ? "Answer" : "Question"}
        </span>
        <span className="mt-4 block text-lg font-semibold leading-relaxed text-foreground">
          {flipped ? card.answer : card.prompt}
        </span>
        <span className="mt-5 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <RotateCw className="size-3" /> Tap to flip
        </span>
      </button>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIndex(Math.max(0, index - 1));
            setFlipped(false);
          }}
          disabled={index === 0}
        >
          <ChevronLeft className="size-4" /> Previous
        </Button>
        {flipped ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => rateCard(false)}>
              Need review
            </Button>
            <Button size="sm" onClick={() => rateCard(true)}>
              I knew it
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => setFlipped(true)}>
            Reveal answer
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIndex(Math.min(cards.length - 1, index + 1));
            setFlipped(false);
          }}
          disabled={index === cards.length - 1}
        >
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
      {finished ? (
        <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-center text-sm text-foreground">
          <Trophy className="mx-auto mb-1 size-5 text-success" />
          Great work. This deck is complete.
          <Button variant="link" size="sm" className="mt-1" onClick={onComplete}>
            Mark lesson completed
          </Button>
        </div>
      ) : null}
    </div>
  );
}
