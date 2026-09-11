import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Brain, Target, TrendingUp } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/shared/Primitives";
import { RecommendationCard } from "@/components/learning/RecommendationList";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { subjects } from "@/data/mockCourses";
import { cn } from "@/lib/utils";
import type { LearningItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FlashcardDeck } from "@/components/learning/FlashcardDeck";

export const Route = createFileRoute("/student/learning")({
  head: () => ({
    meta: [
      { title: "My Learning — LearnLoop" },
      {
        name: "description",
        content: "Adaptive lessons ordered around your learning style, with progress on each.",
      },
      { property: "og:title", content: "My Learning — LearnLoop" },
      { property: "og:description", content: "Lessons re-formatted to match how you learn." },
    ],
  }),
  component: LearningPage,
});

function LearningPage() {
  const { items, profile } = useLearningProfile();
  const [subject, setSubject] = useState<string>("All");
  const [status, setStatus] = useState<"all" | "recommended" | "in_progress" | "completed">("all");
  const [flashcardItem, setFlashcardItem] = useState<LearningItem | null>(null);

  const mastery = items.length
    ? Math.round(items.reduce((sum, item) => sum + item.progress, 0) / items.length)
    : 0;
  const activeCount = items.filter((item) => item.progress > 0 && item.progress < 100).length;
  const nextFocus =
    items.find((item) => item.progress > 0 && item.progress < 100) ??
    items.find((item) => item.progress === 0);

  const filtered = useMemo(() => {
    const bySubject = subject === "All" ? items : items.filter((i) => i.subject === subject);
    const list = bySubject.filter((item) =>
      status === "all"
        ? true
        : status === "recommended"
          ? item.recommended
          : status === "completed"
            ? item.progress >= 100
            : item.progress > 0 && item.progress < 100,
    );
    return [...list].sort(
      (a, b) => Number(b.suitedTo === profile.style) - Number(a.suitedTo === profile.style),
    );
  }, [items, subject, status, profile.style]);

  return (
    <div>
      <PageHeader
        title="My Learning"
        description={`Ordered for a ${profile.style} learner — your best-fit formats come first.`}
      />

      <section
        className="mb-6 rounded-[14px] border border-primary/20 bg-primary-soft p-5"
        aria-label="Mastery Pulse"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Brain className="size-4" /> Mastery Pulse
            </p>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Your adaptive loop turns study activity into a clear next best action.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-background/70 px-3 py-1.5 text-sm font-semibold">
            <TrendingUp className="size-4 text-success" /> {mastery}% overall mastery
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Active learning</p>
            <p className="mt-1 text-lg font-semibold">{activeCount} topics</p>
          </div>
          <div className="rounded-lg bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Next best action</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
              <Target className="size-4 text-primary" />{" "}
              {nextFocus?.title ?? "Review a completed topic"}
            </p>
          </div>
          <div className="rounded-lg bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Why this matters</p>
            <p className="mt-1 text-sm font-semibold">Less guesswork, stronger retention</p>
          </div>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by subject">
        {["All", ...subjects].map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={subject === s}
            onClick={() => setSubject(s)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              subject === s
                ? "border-primary bg-primary-soft text-accent-foreground"
                : "border-border bg-surface text-muted-foreground hover:bg-muted",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter learning status">
        {[
          ["all", "All content"],
          ["recommended", "Recommended"],
          ["in_progress", "In progress"],
          ["completed", "Completed"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={status === value}
            onClick={() => setStatus(value as typeof status)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              status === value
                ? "border-primary bg-primary-soft text-accent-foreground"
                : "border-border bg-surface text-muted-foreground hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-5" aria-hidden />}
          title="No lessons here yet"
          description="Try another subject — new adaptive content is added regularly."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              learnerStyle={profile.style}
              onOpenFlashcards={setFlashcardItem}
            />
          ))}
        </div>
      )}

      <Dialog
        open={flashcardItem !== null}
        onOpenChange={(open) => !open && setFlashcardItem(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Active recall session</DialogTitle>
            <DialogDescription>
              Flip each card, rate your recall, and build a measurable mastery signal.
            </DialogDescription>
          </DialogHeader>
          {flashcardItem ? (
            <FlashcardDeck item={flashcardItem} onComplete={() => setFlashcardItem(null)} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
