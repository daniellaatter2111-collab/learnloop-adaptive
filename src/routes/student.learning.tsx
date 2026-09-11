import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/shared/Primitives";
import { RecommendationCard } from "@/components/learning/RecommendationList";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { subjects } from "@/data/mockCourses";
import { cn } from "@/lib/utils";

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

  const filtered = useMemo(() => {
    const bySubject = subject === "All" ? items : items.filter((i) => i.subject === subject);
    const list = bySubject.filter((item) =>
      status === "all" ? true : status === "recommended" ? item.recommended : status === "completed" ? item.progress >= 100 : item.progress > 0 && item.progress < 100,
    );
    return [...list].sort((a, b) => Number(b.suitedTo === profile.style) - Number(a.suitedTo === profile.style));
  }, [items, subject, status, profile.style]);

  return (
    <div>
      <PageHeader
        title="My Learning"
        description={`Ordered for a ${profile.style} learner — your best-fit formats come first.`}
      />

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
            <RecommendationCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
