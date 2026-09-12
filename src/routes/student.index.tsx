import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { DailyLearningCard } from "@/components/dashboard/DailyLearningCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { LearningProfileCard } from "@/components/dashboard/LearningProfileCard";
import { RecommendationList } from "@/components/learning/RecommendationList";
import { Card, CardHeading, ProgressBar, StatusBadge } from "@/components/shared/Primitives";
import { ActivityChart } from "@/components/charts/Charts";
import { Button } from "@/components/ui/button";
import { useAssignments } from "@/hooks/useAssignments";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { useCurrentStudent, useStudent } from "@/hooks/useStudents";
import { useMaterials } from "@/hooks/useMaterials";
import { useAuth } from "@/hooks/useAuth";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const currentStudent = useCurrentStudent();
  const fallbackStudent = useStudent("stu-1");
  const student = currentStudent ?? fallbackStudent;
  const { user } = useAuth();
  const { profile, recommendations } = useLearningProfile();
  const { assignments } = useAssignments(student?.id);
  const { forStudent } = useMaterials();
  const materials = forStudent(user?.studentId);
  const done = assignments.filter((a) => a.status === "completed").length;
  const upcoming = assignments.filter((a) => a.status !== "completed").slice(0, 3);

  if (!student) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeading title="Weekly activity" description="Hours studied over the last 7 days" />
          <ActivityChart data={weeklyActivity} />
        </Card>
        <LearningProfileCard profile={profile} />
      </div>

      <RecommendationList items={recommendations} learnerStyle={profile.style} />

      <Card>
        <CardHeading
          title="Materials from your teacher"
          description="Resources shared with your class."
        />
        {materials.length ? (
          <ul className="divide-y divide-border">
            {materials.slice(0, 3).map((material) => (
              <li key={material.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium">{material.title}</p>
                  <p className="meta-text">
                    {material.subject} · {material.fileName ?? material.type} ·{" "}
                    {material.uploadedAt}
                  </p>
                </div>
                {material.fileData ? (
                  <Button asChild variant="ghost" size="sm">
                    <a href={material.fileData} download={material.fileName ?? material.title}>
                      <Download className="size-4" /> Download
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs font-medium text-success">Shared</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your teacher has not shared any materials with you yet.
          </p>
        )}
      </Card>

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
