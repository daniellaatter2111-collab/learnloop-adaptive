import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/navigation/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CircularProgress, Pill, ProgressBar } from "@/components/shared/Primitives";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { cn } from "@/lib/utils";
import type { LearningProfile } from "@/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Build your learning profile — LearnLoop" },
      {
        name: "description",
        content:
          "Answer four short questions and LearnLoop builds a personalised learning profile for you.",
      },
      { property: "og:title", content: "Build your learning profile — LearnLoop" },
      {
        property: "og:description",
        content: "A two-minute setup that personalises your whole learning experience.",
      },
    ],
  }),
  component: OnboardingPage,
});

const levels = ["Grade 9", "Grade 10", "Grade 11", "Grade 12", "University"];
const preferences = [
  "Watching diagrams",
  "Listening to explanations",
  "Reading explanations",
  "Practicing questions",
];
const times = ["Morning", "Afternoon", "Evening", "Night"];

function OnboardingPage() {
  const { completeOnboarding } = useLearningProfile();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [academicLevel, setAcademicLevel] = useState("Grade 11");
  const [learningPreference, setPreference] = useState<string[]>([]);
  const [productiveTime, setProductiveTime] = useState("Evening");
  const [result, setResult] = useState<LearningProfile | null>(null);

  const canContinue =
    step === 0 ? name.trim().length > 1 : step === 2 ? learningPreference.length > 0 : true;

  function togglePreference(p: string) {
    setPreference((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function next() {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setResult(
      completeOnboarding({ name: name.trim(), academicLevel, learningPreference, productiveTime }),
    );
  }

  if (result) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-12">
        <Card>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success">
              <Check className="size-3.5" aria-hidden /> Profile ready
            </span>
            <h1 className="page-title mt-4">You're a {result.style} learner</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Based on your answers, LearnLoop will lead with{" "}
              {result.style === "visual" ? "diagrams and visual summaries" : "audio and spoken walkthroughs"}
              .
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <CircularProgress value={result.confidence} caption="confidence" />
            <div className="text-center sm:text-left">
              <p className="text-sm">
                Peak focus <span className="font-medium">{result.peakHours}</span>
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                {result.preferredFormats.map((f) => (
                  <Pill key={f} tone="primary">
                    {f}
                  </Pill>
                ))}
              </div>
            </div>
          </div>

          <Button className="mt-7 w-full" onClick={() => navigate({ to: "/student" })}>
            Go to my dashboard <ArrowRight className="size-4" aria-hidden />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-12">
      <BrandMark />
      <div className="mt-6">
        <p className="meta-text mb-2">Step {step + 1} of 4</p>
        <ProgressBar value={((step + 1) / 4) * 100} label="Onboarding progress" />
      </div>

      <Card className="mt-6">
        {step === 0 ? (
          <div className="space-y-3">
            <h1 className="section-title">What should we call you?</h1>
            <Label htmlFor="name" className="sr-only">
              Your name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              autoFocus
            />
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-3">
            <h1 className="section-title">What's your academic level?</h1>
            <div className="grid gap-2 sm:grid-cols-2">
              {levels.map((l) => (
                <Option key={l} selected={academicLevel === l} onClick={() => setAcademicLevel(l)}>
                  {l}
                </Option>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <h1 className="section-title">How do you learn best?</h1>
            <p className="meta-text">Pick everything that applies.</p>
            <div className="grid gap-2">
              {preferences.map((p) => (
                <Option
                  key={p}
                  selected={learningPreference.includes(p)}
                  onClick={() => togglePreference(p)}
                >
                  {p}
                </Option>
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <h1 className="section-title">When are you most productive?</h1>
            <div className="grid gap-2 sm:grid-cols-2">
              {times.map((t) => (
                <Option key={t} selected={productiveTime === t} onClick={() => setProductiveTime(t)}>
                  {t}
                </Option>
              ))}
            </div>
            <p className="meta-text flex items-center gap-1.5 pt-2">
              <Sparkles className="size-3.5" aria-hidden /> We'll schedule your study plan around
              this.
            </p>
          </div>
        ) : null}

        <div className="mt-7 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="size-4" aria-hidden /> Back
          </Button>
          <Button onClick={next} disabled={!canContinue}>
            {step === 3 ? "Build my profile" : "Continue"} <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Option({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-[10px] border px-4 py-3 text-left text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary-soft text-accent-foreground"
          : "border-border bg-surface hover:bg-muted",
      )}
    >
      {children}
      {selected ? <Check className="size-4" aria-hidden /> : null}
    </button>
  );
}
