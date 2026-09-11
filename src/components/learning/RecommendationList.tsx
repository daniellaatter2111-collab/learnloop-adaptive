import { Sparkles } from "lucide-react";
import { Card, CardHeading, Pill, ProgressBar } from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";
import type { LearningItem } from "@/types";
import { toast } from "sonner";

function ctaFor(progress: number) {
  if (progress >= 100) return "Review";
  if (progress > 0) return "Continue";
  return "Start";
}

export function RecommendationCard({ item }: { item: LearningItem }) {
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

      <Button
        variant={item.progress > 0 ? "outline" : "default"}
        className="mt-4 w-full"
        onClick={() => toast.success(`${ctaFor(item.progress)}ing ${item.title}`)}
      >
        {ctaFor(item.progress)}
      </Button>
    </article>
  );
}

export function RecommendationList({ items }: { items: LearningItem[] }) {
  return (
    <Card className="bg-transparent p-0 sm:p-0 border-0">
      <CardHeading
        title="Recommended for you"
        description="Content selected based on your learning profile"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
}
