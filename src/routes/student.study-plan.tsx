import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Coffee, MessageCircle, Sparkles } from "lucide-react";
import { Card, CardHeading, PageHeader, Pill } from "@/components/shared/Primitives";
import { ProductivityChart } from "@/components/charts/Charts";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { productivityByHour } from "@/data/mockLearningProfile";
import { studyPlan } from "@/data/mockReports";

export const Route = createFileRoute("/student/study-plan")({
  head: () => ({
    meta: [
      { title: "Study Plan — LearnLoop" },
      {
        name: "description",
        content: "A daily study schedule built around your peak focus hours and learning style.",
      },
      { property: "og:title", content: "Study Plan — LearnLoop" },
      { property: "og:description", content: "Sessions scheduled when you focus best." },
    ],
  }),
  component: StudyPlanPage,
});

const icons = { study: BookOpen, break: Coffee, tutor: MessageCircle } as const;

function StudyPlanPage() {
  const { profile } = useLearningProfile();

  return (
    <div>
      <PageHeader
        title="Study Plan"
        description={`Scheduled around your peak focus window, ${profile.peakHours}.`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeading title="Today's schedule" description="Adjusted to your productivity data" />
          <ol className="relative space-y-4 border-l border-border pl-6">
            {studyPlan.map((slot) => {
              const Icon = icons[slot.kind];
              return (
                <li key={slot.time} className="relative">
                  <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-border bg-surface px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{slot.title}</p>
                      <p className="meta-text">
                        {slot.time} · {slot.duration}
                      </p>
                    </div>
                    <Pill tone={slot.kind === "break" ? "neutral" : "primary"}>
                      {slot.kind === "break" ? "Rest" : slot.kind === "tutor" ? "AI tutor" : "Focus"}
                    </Pill>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        <Card>
          <CardHeading title="When you focus best" description="Focus score by hour" />
          <ProductivityChart data={productivityByHour} highlight={["6 PM", "8 PM"]} />
          <p className="meta-text mt-3 flex items-start gap-1.5">
            <Sparkles className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Your hardest subjects are scheduled inside your strongest focus window.
          </p>
        </Card>
      </div>
    </div>
  );
}
