import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { CircularProgress } from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";

export function DailyLearningCard({
  progress,
  studied,
  nextUp,
  sessions,
}: {
  progress: number;
  studied: string;
  nextUp: string;
  sessions: number;
}) {
  return (
    <section className="rounded-[16px] border border-border bg-surface p-6 sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" aria-hidden /> Personalised for your learning style
          </span>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">Your learning plan is ready</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            You have {sessions} focused sessions planned for today.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-4" aria-hidden /> {studied} studied
            </span>
            <span className="text-muted-foreground">
              Next: <span className="font-medium text-foreground">{nextUp}</span>
            </span>
          </div>
          <Button asChild className="mt-5">
            <Link to="/student/learning">
              Continue learning <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-center">
          <CircularProgress value={progress} size={104} stroke={9} caption="of today's plan" />
          <p className="meta-text text-center">Today's progress</p>
        </div>
      </div>
    </section>
  );
}
