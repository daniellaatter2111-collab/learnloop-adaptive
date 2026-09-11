import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Briefcase, Plus, Trash2, Upload } from "lucide-react";
import { ActivityChart, PerformanceChart, SubjectBarChart } from "@/components/charts/Charts";
import {
  Card,
  CardHeading,
  PageHeader,
  Pill,
  ProgressBar,
  TrendLabel,
} from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { setState, useAppState } from "@/lib/store";
import { useAssignments } from "@/hooks/useAssignments";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { useMaterials } from "@/hooks/useMaterials";
import { useStudents } from "@/hooks/useStudents";
import { profileEvolution, weeklyActivity } from "@/data/mockLearningProfile";
import { careerPaths, monthlyReport, subjectProgress } from "@/data/mockReports";
import type { MaterialType } from "@/types";

export function ProgressPage({ child = false }: { child?: boolean }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={child ? "Alex's progress" : "Your progress"}
        description="A clear view of performance and study consistency."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeading title="Study activity" description="Hours studied this week" />
          <ActivityChart data={weeklyActivity} />
        </Card>
        <Card>
          <CardHeading title="Subject progress" description="Completion across current subjects" />
          <SubjectBarChart data={subjectProgress} />
        </Card>
      </div>
      <SubjectTable />
    </div>
  );
}

function SubjectTable() {
  return (
    <Card>
      <CardHeading title="Subject breakdown" description="Current progress and average score" />
      <div className="space-y-4">
        {subjectProgress.map((s) => (
          <div
            key={s.subject}
            className="grid gap-2 sm:grid-cols-[140px_1fr_75px_110px] sm:items-center"
          >
            <p className="text-sm font-medium">{s.subject}</p>
            <ProgressBar value={s.progress} label={`${s.subject} progress`} />
            <p className="text-sm">{s.score}% score</p>
            <TrendLabel trend={s.trend} />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ProfilePage({ child = false }: { child?: boolean }) {
  const { profile } = useLearningProfile();
  return (
    <div className="space-y-6">
      <PageHeader
        title={child ? "Alex's learning profile" : "Learning profile"}
        description="The preferences LearnLoop uses to personalise learning."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeading title={`How ${child ? "Alex" : "you"} learn best`} />
          <p className="text-2xl font-semibold capitalize">{profile.style} learner</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile.confidence}% confidence · Peak focus: {profile.peakHours}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.preferredFormats.map((f) => (
              <Pill key={f} tone="primary">
                {f}
              </Pill>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeading
            title="Profile confidence"
            description="Confidence has increased as more learning behaviour is observed."
          />
          <PerformanceChart data={profileEvolution} xKey="month" yKey="confidence" />
        </Card>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <ListCard title="Strengths" values={profile.strengths} tone="success" />
        <ListCard title="Focus areas" values={profile.weaknesses} tone="warning" />
      </div>
    </div>
  );
}

function ListCard({
  title,
  values,
  tone,
}: {
  title: string;
  values: string[];
  tone: "success" | "warning";
}) {
  return (
    <Card>
      <CardHeading title={title} />{" "}
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <Pill key={v} tone={tone}>
            {v}
          </Pill>
        ))}
      </div>
    </Card>
  );
}

export function InsightsPage() {
  const { profile } = useLearningProfile();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Strengths & weaknesses"
        description="Recommendations based on your learning profile and performance."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <ListCard title="What is working" values={profile.strengths} tone="success" />
        <ListCard title="What to focus on next" values={profile.weaknesses} tone="warning" />
      </div>
      <Card>
        <CardHeading title="Suggested next step" />
        <p className="text-sm text-muted-foreground">
          Schedule two short Physics formula sessions in your {profile.peakHours} focus window, then
          ask the AI Tutor for a quick retrieval quiz.
        </p>
        <Button asChild className="mt-5">
          <Link to="/student/study-plan">Open study plan</Link>
        </Button>
      </Card>
    </div>
  );
}

export function CareerPage() {
  return (
    <div>
      <PageHeader
        title="Career paths"
        description="Potential paths connected to your current strengths and interests."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {careerPaths.map((path) => (
          <Card key={path.title} as="article">
            <Briefcase className="size-5 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{path.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{path.description}</p>
            <p className="mt-5 text-sm font-medium">{path.match}% match</p>
            <ProgressBar value={path.match} className="mt-2" label={`${path.title} match`} />
            <div className="mt-4 flex flex-wrap gap-2">
              {path.strengths.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ReportsPage({ child = false }: { child?: boolean }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={child ? "Alex's monthly report" : "Monthly report"}
        description={`${monthlyReport.month} learning summary`}
      />
      <Card>
        <CardHeading title={monthlyReport.summary} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {monthlyReport.metrics.map((m) => (
            <div key={m.label} className="rounded-lg bg-muted p-4">
              <p className="text-xl font-semibold">{m.value}</p>
              <p className="meta-text mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeading title="Performance this month" />
          <PerformanceChart data={monthlyReport.performance} xKey="week" yKey="score" />
        </Card>
        <Card>
          <CardHeading title="Next steps" />{" "}
          <ul className="space-y-3 text-sm text-muted-foreground">
            {monthlyReport.nextSteps.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
          <Button className="mt-6" onClick={() => toast.success("Report download prepared")}>
            Download report
          </Button>
        </Card>
      </div>
    </div>
  );
}

export function SettingsPage({ role }: { role: "student" | "admin" | "parent" }) {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const { theme } = useAppState();
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your preferences." />
      <Card className="max-w-xl">
        <CardHeading
          title="Appearance"
          description="Choose the color mode that feels most comfortable."
        />
        <div className="flex items-center justify-between gap-4 text-sm">
          <div>
            <p className="font-medium">Dark mode</p>
            <p className="meta-text mt-1">Use a darker interface across LearnLoop.</p>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setState({ theme: checked ? "dark" : "light" })}
            aria-label="Enable dark mode"
          />
        </div>
      </Card>
      <Card className="max-w-xl">
        <CardHeading title="Notifications" />
        <label className="flex cursor-pointer items-center justify-between gap-4 text-sm">
          <span>Email learning updates</span>
          <input
            type="checkbox"
            checked={emailUpdates}
            onChange={(e) => setEmailUpdates(e.target.checked)}
            className="size-4 accent-primary"
          />
        </label>
        <Button
          className="mt-6"
          onClick={() =>
            toast.success(`${role === "admin" ? "Portal" : "Preferences"} settings saved`)
          }
        >
          Save settings
        </Button>
      </Card>
    </div>
  );
}

export function AdminDashboard() {
  const { students } = useStudents();
  const { assignments } = useAssignments();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher dashboard"
        description="Keep an eye on learner progress and activity."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Students" value={students.length} />
        <Metric label="Assignments" value={assignments.length} />
        <Metric
          label="Needs attention"
          value={students.filter((s) => s.status === "Needs attention").length}
        />
      </div>
      <Card>
        <CardHeading title="Student progress" />
        <SubjectTable />
      </Card>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="kpi-value">{value}</p>
      <p className="meta-text">{label}</p>
    </Card>
  );
}

export function AdminStudentsPage() {
  const { students, createStudent, removeStudent } = useStudents();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createStudent({ name, id, academicLevel: "Grade 11" });
    setName("");
    setId("");
    toast.success("Student added");
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Add learners and monitor their current status." />
      <Card>
        <CardHeading title="Add a student" />
        <form onSubmit={submit} className="flex flex-wrap gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Student name"
            required
            className="max-w-xs"
          />
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Student ID (optional)"
            className="max-w-xs"
          />
          <Button type="submit">
            <Plus className="size-4" /> Add student
          </Button>
        </form>
      </Card>
      <Card>
        <CardHeading title="All students" />
        <div className="space-y-3">
          {students.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="meta-text">
                  {s.academicLevel} · {s.overallProgress}% progress · {s.engagement} engagement
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  removeStudent(s.id);
                  toast.success("Student removed");
                }}
              >
                <Trash2 className="size-4" /> Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AdminAssignmentsPage() {
  const { students } = useStudents();
  const { assignments, createAssignment, updateAssignment, deleteAssignment } = useAssignments();
  const [title, setTitle] = useState("");
  const [studentId, setStudentId] = useState("stu-1");
  const [editingId, setEditingId] = useState<string | null>(null);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (editingId) {
      updateAssignment(editingId, { title: title.trim(), studentId });
      toast.success("Assignment updated");
    } else {
      createAssignment({
        title,
        studentId,
        subject: "Mathematics",
        description: "New teacher assignment.",
        dueDate: "Next week",
      });
      toast.success("Assignment created");
    }
    setTitle("");
    setEditingId(null);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Create and manage work for your students." />
      <Card>
        <form onSubmit={submit} className="flex flex-wrap gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Assignment title"
            className="max-w-xs"
          />
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <Button type="submit">
            <Plus className="size-4" /> {editingId ? "Save changes" : "Create assignment"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setTitle("");
              }}
            >
              Cancel
            </Button>
          ) : null}
        </form>
      </Card>
      <Card>
        <div className="space-y-3">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="meta-text">
                  {a.subject} · {a.progress}% complete · Due {a.dueDate}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(a.id);
                    setTitle(a.title);
                    setStudentId(a.studentId);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    deleteAssignment(a.id);
                    toast.success("Assignment deleted");
                  }}
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AdminMaterialsPage() {
  const { materials, uploadMaterial, deleteMaterial } = useMaterials();
  const [title, setTitle] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    uploadMaterial({
      title,
      subject: "Mathematics",
      topic: "General",
      type: "document" as MaterialType,
    });
    setTitle("");
    toast.success("Course material uploaded");
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title="Course materials"
        description="Upload resources for adaptive learning recommendations."
      />
      <Card>
        <form onSubmit={submit} className="flex flex-wrap gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Resource title"
            className="max-w-xs"
          />
          <Button type="submit">
            <Upload className="size-4" /> Upload material
          </Button>
        </form>
      </Card>
      <Card>
        <div className="space-y-3">
          {materials.map((m) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{m.title}</p>
                <p className="meta-text">
                  {m.subject} · {m.type} · Uploaded {m.uploadedAt}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  deleteMaterial(m.id);
                  toast.success("Material removed");
                }}
              >
                <Trash2 className="size-4" /> Delete
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Class-level learning performance." />
      <Card>
        <CardHeading title="Average subject performance" />
        <SubjectBarChart data={subjectProgress} />
      </Card>
      <ReportsPage />
    </div>
  );
}
export function AdminCareerPage() {
  return (
    <div>
      <PageHeader title="Career insights" description="Strength-led paths across your learners." />
      <CareerPage />
    </div>
  );
}
export function ParentDashboard() {
  const { profile } = useLearningProfile();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alex's learning overview"
        description="A read-only summary of current learning activity."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeading title="This week's activity" />
          <ActivityChart data={weeklyActivity} />
        </Card>
        <Card>
          <CardHeading title="Learning profile" />
          <p className="text-lg font-semibold capitalize">{profile.style} learner</p>
          <p className="meta-text mt-2">Peak focus: {profile.peakHours}</p>
          <Button asChild variant="outline" className="mt-5">
            <Link to="/parent/reports">View report</Link>
          </Button>
        </Card>
      </div>
      <SubjectTable />
    </div>
  );
}
