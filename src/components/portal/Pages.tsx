import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Download,
  Flame,
  Plus,
  Target,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import { PerformanceChart, SubjectBarChart } from "@/components/charts/Charts";
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
        description="Track the results of your learning and stay on course with your weekly goal."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyGoalCard />
        <Card>
          <CardHeading title="Subject progress" description="Completion across current subjects" />
          <SubjectBarChart data={subjectProgress} />
        </Card>
      </div>
      <ProgressHighlights />
      <SubjectTable />
    </div>
  );
}

function WeeklyGoalCard() {
  const completedHours = 4;
  const goalHours = 5;
  const goalProgress = (completedHours / goalHours) * 100;

  return (
    <Card>
      <CardHeading
        title="Weekly learning goal"
        description="Build a steady habit, one focused session at a time."
      />
      <div className="flex items-center gap-5 rounded-xl bg-primary-soft p-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Target className="size-6" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-semibold">
            {completedHours}h of {goalHours}h
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            You are one hour away from this week's goal.
          </p>
          <ProgressBar value={goalProgress} className="mt-3" label="Weekly learning goal" />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-success">
        <Flame className="size-4" aria-hidden />
        12-day learning streak — keep it going!
      </div>
    </Card>
  );
}

function ProgressHighlights() {
  const highlights = [
    {
      icon: Award,
      label: "Strongest subject",
      value: "Chemistry",
      detail: "93% average score",
      tone: "text-primary bg-primary-soft",
    },
    {
      icon: CheckCircle2,
      label: "Assignments completed",
      value: "34 of 40",
      detail: "6 remaining this term",
      tone: "text-success bg-success-soft",
    },
    {
      icon: Flame,
      label: "Current streak",
      value: "12 days",
      detail: "Your longest this month",
      tone: "text-warning bg-warning-soft",
    },
  ];

  return (
    <section aria-label="Progress highlights" className="grid gap-4 md:grid-cols-3">
      {highlights.map(({ icon: Icon, label, value, detail, tone }) => (
        <Card key={label} className="flex items-start gap-4 p-5">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
            <Icon className="size-5" aria-hidden />
          </div>
          <div>
            <p className="meta-text">{label}</p>
            <p className="mt-1 text-lg font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
        </Card>
      ))}
    </section>
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

function downloadMonthlyReport(child: boolean) {
  const learnerName = child ? "Alex" : "Your";
  const reportText = [
    `LearnLoop ${monthlyReport.month} Learning Report`,
    "",
    `${learnerName} learning summary`,
    monthlyReport.summary,
    "",
    "Key metrics",
    ...monthlyReport.metrics.map((metric) => `- ${metric.label}: ${metric.value}`),
    "",
    "Performance this month",
    ...monthlyReport.performance.map((week) => `- ${week.week}: ${week.score}%`),
    "",
    "Next steps",
    ...monthlyReport.nextSteps.map((step) => `- ${step}`),
  ].join("\n");
  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `learnloop-${monthlyReport.month.toLowerCase().replace(/\s+/g, "-")}-report.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast.success("Report downloaded");
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
          <Button className="mt-6" onClick={() => downloadMonthlyReport(child)}>
            <Download className="size-4" /> Download report
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
      <PageHeader
        title="Settings"
        description={
          role === "admin"
            ? "Manage your teaching workspace preferences."
            : "Manage your preferences."
        }
      />
      <Card className="max-w-xl">
        <CardHeading
          title="Appearance"
          description="Choose the color mode that feels most comfortable."
        />
        <div className="flex items-center justify-between gap-4 text-sm">
          <div>
            <p className="font-medium">{theme === "dark" ? "Dark theme" : "Light theme"}</p>
            <p className="meta-text mt-1">Switch between light and dark mode across LearnLoop.</p>
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
  const studentIds = new Set(students.map((student) => student.id));
  const classAssignments = assignments.filter((assignment) => studentIds.has(assignment.studentId));
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher dashboard"
        description="Keep an eye on learner progress and activity."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Students" value={students.length} />
        <Metric label="Assignments" value={classAssignments.length} />
        <Metric
          label="Needs attention"
          value={students.filter((s) => s.status === "Needs attention").length}
        />
      </div>
      <Card className="flex flex-wrap items-center justify-between gap-4 bg-primary-soft">
        <div>
          <p className="font-semibold">Build your classroom</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a learner using their email address, then share materials and assignments.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/students">
            <UserPlus className="size-4" /> Add students
          </Link>
        </Button>
      </Card>
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
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [query, setQuery] = useState("");
  const visibleStudents = students.filter((student) =>
    `${student.name} ${student.email}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  function submit(e: FormEvent) {
    e.preventDefault();
    try {
      createStudent({ name, email, id, academicLevel: "Grade 11" });
      setName("");
      setEmail("");
      setId("");
      toast.success("Student added — they can now sign in with this email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add student.");
    }
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
            placeholder="Student name (optional)"
            className="max-w-xs"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Student email"
            type="email"
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
        <CardHeading title="All students" description="Search by learner name or sign-in email." />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a student by email"
          type="search"
          className="mb-4 max-w-sm"
        />
        <div className="space-y-3">
          {visibleStudents.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="meta-text">
                  {s.email} · {s.academicLevel} · {s.overallProgress}% progress · {s.engagement}{" "}
                  engagement
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
          {!visibleStudents.length ? (
            <p className="text-sm text-muted-foreground">No student matches that email or name.</p>
          ) : null}
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
  const { students } = useStudents();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [recipientId, setRecipientId] = useState("all");
  const [fileName, setFileName] = useState<string | undefined>();
  const [fileData, setFileData] = useState<string | undefined>();
  const [fileError, setFileError] = useState<string | null>(null);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const materialInput = {
      title,
      subject,
      topic: "General",
      type: "document" as MaterialType,
      recipientStudentIds:
        recipientId === "all" ? students.map((student) => student.id) : [recipientId],
      ...(fileName ? { fileName } : {}),
      ...(fileData ? { fileData } : {}),
    };
    uploadMaterial(materialInput);
    setTitle("");
    setFileName(undefined);
    setFileData(undefined);
    toast.success(
      recipientId === "all"
        ? "Material shared with your whole class."
        : "Material shared with the selected student.",
    );
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
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Subject"
          >
            {["Mathematics", "Physics", "Chemistry", "English"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={recipientId}
            onChange={(event) => setRecipientId(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Recipients"
          >
            <option value="all">All my students ({students.length})</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} · {student.email}
              </option>
            ))}
          </select>
          <label className="flex h-9 max-w-full cursor-pointer items-center truncate rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
            <input
              type="file"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setFileError(null);
                setFileName(file?.name);
                setFileData(undefined);
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) {
                  setFileError("Choose a file smaller than 2 MB for local storage.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () =>
                  setFileData(typeof reader.result === "string" ? reader.result : undefined);
                reader.onerror = () => setFileError("This file could not be read.");
                reader.readAsDataURL(file);
              }}
            />
            {fileName ?? "Attach file (optional)"}
          </label>
          <Button type="submit" disabled={Boolean(fileError || (fileName && !fileData))}>
            <Upload className="size-4" /> Upload material
          </Button>
        </form>
        {fileError ? <p className="mt-3 text-sm text-danger">{fileError}</p> : null}
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
                  {m.subject} · {m.type} · Shared with {m.recipientStudentIds.length} learner
                  {m.recipientStudentIds.length === 1 ? "" : "s"} · Uploaded {m.uploadedAt}
                </p>
              </div>
              <div className="flex gap-1">
                {m.fileData ? (
                  <Button asChild variant="ghost" size="sm">
                    <a href={m.fileData} download={m.fileName ?? m.title}>
                      <Download className="size-4" /> Download
                    </a>
                  </Button>
                ) : null}
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
