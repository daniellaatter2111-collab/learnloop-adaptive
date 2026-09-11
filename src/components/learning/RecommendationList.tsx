import { BookOpen, ExternalLink, Headphones, Sparkles, Video } from "lucide-react";
import { Card, CardHeading, Pill, ProgressBar } from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";
import type { LearningItem, LearningStyle } from "@/types";
import { toast } from "sonner";
import { learningService } from "@/services/learningService";

function ctaFor(progress: number) {
  if (progress >= 100) return "Review";
  if (progress > 0) return "Continue";
  return "Start";
}

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
}: {
  item: LearningItem;
  learnerStyle?: LearningStyle;
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

      <Button
        variant={item.progress > 0 ? "outline" : "default"}
        className="mt-4 w-full"
        onClick={() => {
          const next = item.progress >= 100 ? 0 : Math.min(100, item.progress + 25);
          learningService.setItemProgress(item.id, next);
          toast.success(
            item.progress >= 100
              ? `${item.title} is ready for another review`
              : `${item.title} progress updated to ${next}%`,
          );
        }}
      >
        {ctaFor(item.progress)}
      </Button>
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
