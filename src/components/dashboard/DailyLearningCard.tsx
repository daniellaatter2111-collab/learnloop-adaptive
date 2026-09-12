import { ArrowRight, Clock, Sparkles, Zap } from "lucide-react";
import { CircularProgress } from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

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
    <section className="pulse-stage pulse-shadow relative overflow-hidden rounded-[24px] p-6 text-primary-foreground sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/25 bg-primary-foreground/15 px-3 py-1.5 text-xs font-bold text-primary-foreground backdrop-blur">
            <Sparkles className="size-3.5" aria-hidden /> Today's learning challenge
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">Ready for your next round?</h2>
          <p className="mt-1.5 text-sm font-medium text-primary-foreground/75">
            You have {sessions} focused sessions planned for today.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-primary-foreground/80">
              <Clock className="size-4" aria-hidden /> {studied} studied
            </span>
            <span className="text-primary-foreground/80">
              Next: <span className="font-bold text-primary-foreground">{nextUp}</span>
            </span>
          </div>
          <Button asChild size="lg" className="mt-5 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/student/learning"><Zap className="size-4" /> Start learning <ArrowRight className="size-4" /></Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-center">
          <CircularProgress value={progress} size={104} stroke={9} caption="of today's plan" />
          <p className="text-center text-xs font-bold text-primary-foreground/70">Today's progress</p>
        </div>
      </div>
    </section>
  );
}
