import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DailyLearningCard } from "@/components/dashboard/DailyLearningCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { LearningProfileCard } from "@/components/dashboard/LearningProfileCard";
import { RecommendationList } from "@/components/learning/RecommendationList";
import { Card, CardHeading, ProgressBar, StatusBadge } from "@/components/shared/Primitives";
import { ActivityChart } from "@/components/charts/Charts";
import { Button } from "@/components/ui/button";
import { useAssignments } from "@/hooks/useAssignments";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { useStudent } from "@/hooks/useStudents";
import { weeklyActivity } from "@/data/mockLearningProfile";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "Student dashboard — LearnLoop" },
      {
        name: "description",
        content: "Your personalised learning overview: today's plan, progress and recommendations.",
      },
      { property: "og:title", content: "Student dashboard — LearnLoop" },
      { property: "og:description", content: "Today's adaptive learning plan at a glance." },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const student = useStudent("stu-1");
  const { profile, recommendations } = useLearningProfile();
  const { assignments } = useAssignments("stu-1");
  const done = assignments.filter((a) => a.status === "completed").length;
  const upcoming = assignments.filter((a) => a.status !== "completed").slice(0, 3);

  return (
    <div className="space-y-6">
      <DailyLearningCard
        progress={student.overallProgress}
        studied={student.studyTime}
        nextUp="Quadratic Equations"
        sessions={3}
      />

      <StatsGrid
        weeklyProgress={student.overallProgress}
        studyTime={student.studyTime}
        assignmentsDone={done}
        assignmentsTotal={assignments.length}
        streak={student.streak}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeading title="Weekly activity" description="Hours studied over the last 7 days" />
          <ActivityChart data={weeklyActivity} />
        </Card>
        <LearningProfileCard profile={profile} />
      </div>

      <RecommendationList items={recommendations} />

      <Card>
        <CardHeading
          title="Upcoming assignments"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/student/assignments">
                View all <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          }
        />
        <ul className="divide-y divide-border">
          {upcoming.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 py-3.5">
              <div className="min-w-0 flex-1">
                <Link
                  to="/student/assignments/$assignmentId"
                  params={{ assignmentId: a.id }}
                  className="text-sm font-medium hover:underline"
                >
                  {a.title}
                </Link>
                <p className="meta-text">
                  {a.subject} · Due {a.dueDate}
                </p>
                <ProgressBar value={a.progress} className="mt-2 max-w-xs" label={a.title} />
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
