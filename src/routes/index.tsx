import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, LineChart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/navigation/AppSidebar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LearnLoop — Learning that adapts to you" },
      {
        name: "description",
        content:
          "LearnLoop builds a learning profile for every student and adapts content, study plans, tutoring and reports around it.",
      },
      { property: "og:title", content: "LearnLoop — Learning that adapts to you" },
      {
        property: "og:description",
        content: "Adaptive learning profiles, personalised study plans and an always-on AI tutor.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Brain,
    title: "Learning profile",
    body: "A short onboarding builds a transparent profile of how each student learns best.",
  },
  {
    icon: Sparkles,
    title: "Adaptive content",
    body: "Lessons are re-ordered and re-formatted to match visual or audio learners.",
  },
  {
    icon: MessageCircle,
    title: "AI tutor",
    body: "Context-aware help that explains topics in the format the student prefers.",
  },
  {
    icon: LineChart,
    title: "Progress & reports",
    body: "Teachers and parents see progress, engagement and monthly summaries.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <BrandMark />
        <Button asChild size="sm">
          <Link to="/login">Sign in</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        <section className="py-16 sm:py-24">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" aria-hidden /> AI-personalised learning
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Learning that adapts to you.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            LearnLoop studies how each student learns — their preferences, performance and peak
            focus hours — then personalises content, study plans, tutoring and reporting.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/login">
                Enter the platform <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/onboarding">Try student onboarding</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.title} className="rounded-[14px] border border-border bg-surface p-5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <f.icon className="size-4.5" aria-hidden />
              </span>
              <h2 className="mt-3 text-[15px] font-semibold">{f.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
