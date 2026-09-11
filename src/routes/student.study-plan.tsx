import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Coffee, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeading, PageHeader, Pill } from "@/components/shared/Primitives";
import { ProductivityChart } from "@/components/charts/Charts";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { productivityByHour } from "@/data/mockLearningProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppState } from "@/lib/store";
import { studyPlanService } from "@/services/studyPlanService";

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
  const { studyPlan } = useAppState();
  const [adjusting, setAdjusting] = useState(false);
  const [startTime, setStartTime] = useState("18:00");
  const [studyMinutes, setStudyMinutes] = useState("30");
  const [breakMinutes, setBreakMinutes] = useState("15");
  const [tutorMinutes, setTutorMinutes] = useState("20");

  function savePlan() {
    studyPlanService.update({
      startTime,
      studyMinutes: Number(studyMinutes),
      breakMinutes: Number(breakMinutes),
      tutorMinutes: Number(tutorMinutes),
    });
    setAdjusting(false);
    toast.success("Your study plan has been updated");
  }

  return (
    <div>
      <PageHeader
        title="Study Plan"
        description={`Scheduled around your peak focus window, ${profile.peakHours}.`}
        action={
          <Button variant="outline" onClick={() => setAdjusting(true)}>
            Adjust plan
          </Button>
        }
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
                      {slot.kind === "break"
                        ? "Rest"
                        : slot.kind === "tutor"
                          ? "AI tutor"
                          : "Focus"}
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

      <Dialog open={adjusting} onOpenChange={setAdjusting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust your study plan</DialogTitle>
            <DialogDescription>
              Choose when to begin and how long each learning block should be.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="plan-start">Start time</Label>
              <Input
                id="plan-start"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>
            <DurationInput
              id="study-duration"
              label="Study block (minutes)"
              value={studyMinutes}
              onChange={setStudyMinutes}
            />
            <DurationInput
              id="break-duration"
              label="Break (minutes)"
              value={breakMinutes}
              onChange={setBreakMinutes}
            />
            <DurationInput
              id="tutor-duration"
              label="AI tutor session (minutes)"
              value={tutorMinutes}
              onChange={setTutorMinutes}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjusting(false)}>
              Cancel
            </Button>
            <Button
              onClick={savePlan}
              disabled={
                !startTime ||
                [studyMinutes, breakMinutes, tutorMinutes].some(
                  (value) => Number(value) < 5 || Number(value) > 180,
                )
              }
            >
              Save plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DurationInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min="5"
        max="180"
        step="5"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
