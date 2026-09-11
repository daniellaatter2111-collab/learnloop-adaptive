import { BookOpen, Check, ExternalLink, Headphones, Sparkles, Video } from "lucide-react";
import { Card, CardHeading, Pill, ProgressBar } from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";
import type { LearningItem, LearningStyle } from "@/types";
import { toast } from "sonner";
import { learningService } from "@/services/learningService";

type LearningStatus = "pending" | "in_progress" | "completed";

function statusFor(progress: number): LearningStatus {
  if (progress >= 100) return "completed";
  if (progress > 0) return "in_progress";
  return "pending";
}

const statusOptions: Array<{ value: LearningStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In process" },
  { value: "completed", label: "Completed" },
];

const subjectTextbooks: Record<string, { title: string; url: string }> = {
  Mathematics: {
    title: "College Algebra 2e",
    url: "https://openstax.org/details/books/college-algebra-2e",
  },
  Physics: {
    title: "College Physics 2e",
    url: "https://openstax.org/details/books/college-physics-2e",
  },
  Chemistry: {
    title: "Chemistry 2e",
    url: "https://openstax.org/details/books/chemistry-2e",
  },
  English: {
    title: "Writing Guide with Handbook",
    url: "https://openstax.org/details/books/writing-guide-with-handbook",
  },
};

function videoSearchUrl(item: LearningItem, style: LearningStyle) {
  const learningIntent = style === "audio" ? "explained lecture" : "visual lesson";
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.subject} ${item.title} ${learningIntent}`)}`;
}

export function RecommendationCard({
  item,
  learnerStyle = item.suitedTo,
  onOpenFlashcards,
}: {
  item: LearningItem;
  learnerStyle?: LearningStyle;
  onOpenFlashcards?: (item: LearningItem) => void;
}) {
  const textbook = subjectTextbooks[item.subject];
  const VideoIcon = learnerStyle === "audio" ? Headphones : Video;
  const videoLabel = learnerStyle === "audio" ? "Listen on YouTube" : "Watch on YouTube";

  return (
    <article className="flex flex-col rounded-[14px] border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="meta-text">{item.subject}</p>
          <h3 className="mt-0.5 text-[15px] font-semibold">{item.title}</h3>
        </div>
        {item.recommended ? (
          <span className="flex size-7 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Sparkles className="size-3.5" aria-hidden />
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill tone="primary">{item.format}</Pill>
        <Pill>{item.duration}</Pill>
      </div>

      <div className="mt-4 flex-1">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{item.progress}%</span>
        </div>
        <ProgressBar value={item.progress} label={`${item.title} progress`} />
      </div>

      <section
        className="mt-4 rounded-lg bg-muted/60 p-3"
        aria-label={`Resources for ${item.title}`}
      >
        <p className="text-xs font-medium capitalize text-foreground">
          Resources for a {learnerStyle} learner
        </p>
        <div className="mt-2 grid gap-1.5">
          <a
            href={videoSearchUrl(item, learnerStyle)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-primary hover:underline"
          >
            <VideoIcon className="size-3.5 shrink-0" aria-hidden />
            {videoLabel}: {item.title}
            <ExternalLink className="size-3 shrink-0" aria-hidden />
          </a>
          {textbook ? (
            <a
              href={textbook.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-primary hover:underline"
            >
              <BookOpen className="size-3.5 shrink-0" aria-hidden />
              Free textbook: {textbook.title}
              <ExternalLink className="size-3 shrink-0" aria-hidden />
            </a>
          ) : null}
        </div>
      </section>

      <div
        className="mt-4 grid grid-cols-3 overflow-hidden rounded-lg border border-border"
        role="group"
        aria-label={`Status for ${item.title}`}
      >
        {statusOptions.map((option) => {
          const active = statusFor(item.progress) === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => {
                const progress =
                  option.value === "completed" ? 100 : option.value === "in_progress" ? 50 : 0;
                learningService.setItemProgress(item.id, progress);
                toast.success(`${item.title} marked ${option.label.toLowerCase()}`);
              }}
              className={`flex min-h-9 items-center justify-center gap-1 px-2 text-[11px] font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {active && <Check className="size-3" aria-hidden />}
              {option.label}
            </button>
          );
        })}
      </div>
      {item.format === "Flashcards" && onOpenFlashcards ? (
        <Button variant="outline" className="mt-2 w-full" onClick={() => onOpenFlashcards(item)}>
          Open flashcards
        </Button>
      ) : null}
    </article>
  );
}

export function RecommendationList({
  items,
  learnerStyle,
}: {
  items: LearningItem[];
  learnerStyle: LearningStyle;
}) {
  return (
    <Card className="bg-transparent p-0 sm:p-0 border-0">
      <CardHeading
        title="Recommended for you"
        description="Content selected based on your learning profile"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <RecommendationCard key={item.id} item={item} learnerStyle={learnerStyle} />
        ))}
      </div>
    </Card>
  );
}
