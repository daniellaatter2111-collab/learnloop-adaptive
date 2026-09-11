import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardHeading,
  EmptyState,
  PageHeader,
  ProgressBar,
  StatusBadge,
} from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";
import { useAssignments } from "@/hooks/useAssignments";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/student/assignments/$assignmentId")({
  head: () => ({
    meta: [
      { title: "Assignment detail — LearnLoop" },
      {
        name: "description",
        content: "Work through an assignment, update your progress and submit when you're done.",
      },
      { property: "og:title", content: "Assignment detail — LearnLoop" },
      { property: "og:description", content: "Assignment instructions and progress tracking." },
    ],
  }),
  component: AssignmentDetail,
});

function AssignmentDetail() {
  const { assignmentId } = useParams({ from: "/student/assignments/$assignmentId" });
  const { user } = useAuth();
  const { assignments, setProgress } = useAssignments(user?.studentId);
  const assignment = assignments.find((a) => a.id === assignmentId);

  if (!assignment) {
    return (
      <EmptyState
        title="Assignment not found"
        description="It may have been removed by your teacher."
        action={
          <Button asChild variant="outline">
            <Link to="/student/assignments">Back to assignments</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/student/assignments">
          <ArrowLeft className="size-4" aria-hidden /> Assignments
        </Link>
      </Button>

      <PageHeader
        title={assignment.title}
        description={`${assignment.subject} · Due ${assignment.dueDate}`}
        action={<StatusBadge status={assignment.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeading title="Instructions" />
          <p className="text-sm leading-relaxed text-muted-foreground">{assignment.description}</p>
        </Card>

        <Card>
          <CardHeading title="Your progress" />
          <p className="kpi-value">{assignment.progress}%</p>
          <ProgressBar
            value={assignment.progress}
            className="mt-3"
            tone={assignment.progress >= 100 ? "success" : "primary"}
            label="Assignment progress"
          />

          <label htmlFor="progress" className="meta-text mt-5 block">
            Update progress
          </label>
          <input
            id="progress"
            type="range"
            min={0}
            max={100}
            step={5}
            value={assignment.progress}
            onChange={(e) => setProgress(assignment.id, Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />

          <Button
            className="mt-5 w-full"
            disabled={assignment.status === "completed"}
            onClick={() => {
              setProgress(assignment.id, 100);
              toast.success("Assignment submitted");
            }}
          >
            {assignment.status === "completed" ? "Submitted" : "Mark as complete"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
