import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import {
  Card,
  EmptyState,
  PageHeader,
  ProgressBar,
  StatusBadge,
} from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssignments } from "@/hooks/useAssignments";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { AssignmentStatus } from "@/types";

export const Route = createFileRoute("/student/assignments/")({
  head: () => ({
    meta: [
      { title: "Assignments — LearnLoop" },
      {
        name: "description",
        content: "Track every assignment, its due date and how far through it you are.",
      },
      { property: "og:title", content: "Assignments — LearnLoop" },
      { property: "og:description", content: "All your assignments in one place." },
    ],
  }),
  component: AssignmentsPage,
});

const filters: { value: "all" | AssignmentStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

function AssignmentsPage() {
  const { user } = useAuth();
  const { assignments } = useAssignments(user?.studentId);
  const [filter, setFilter] = useState<"all" | AssignmentStatus>("all");
  const [query, setQuery] = useState("");
  const list = (
    filter === "all" ? assignments : assignments.filter((a) => a.status === filter)
  ).filter((assignment) =>
    `${assignment.title} ${assignment.subject}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="Assignments" description="Everything assigned to you, newest first." />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-primary bg-primary-soft text-accent-foreground"
                : "border-border bg-surface text-muted-foreground hover:bg-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <label className="mb-6 block max-w-sm">
        <span className="sr-only">Search assignments</span>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search assignments"
        />
      </label>

      {list.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-5" aria-hidden />}
          title="Nothing here"
          description="No assignments match this filter right now."
        />
      ) : (
        <div className="grid gap-4">
          {list.map((a) => (
            <Card key={a.id} as="article">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="meta-text">{a.subject}</p>
                  <h2 className="mt-0.5 text-[15px] font-semibold">{a.title}</h2>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{a.description}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="min-w-[180px] flex-1">
                  <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                    <span>Due {a.dueDate}</span>
                    <span>{a.progress}%</span>
                  </div>
                  <ProgressBar value={a.progress} label={`${a.title} progress`} />
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/student/assignments/$assignmentId" params={{ assignmentId: a.id }}>
                    Open
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
