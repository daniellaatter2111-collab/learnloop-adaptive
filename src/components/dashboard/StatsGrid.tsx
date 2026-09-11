import { CalendarCheck, ClipboardList, Clock, Flame } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";

export function StatsGrid({
  weeklyProgress,
  studyTime,
  assignmentsDone,
  assignmentsTotal,
  streak,
}: {
  weeklyProgress: number;
  studyTime: string;
  assignmentsDone: number;
  assignmentsTotal: number;
  streak: number;
}) {
  const remaining = Math.max(assignmentsTotal - assignmentsDone, 0);
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Weekly progress"
        value={`${weeklyProgress}%`}
        hint="+12% vs last week"
        icon={CalendarCheck}
      />
      <StatCard label="Study time" value={studyTime} hint="+48m this week" icon={Clock} />
      <StatCard
        label="Assignments"
        value={`${assignmentsDone} / ${assignmentsTotal}`}
        hint={remaining === 0 ? "All caught up" : `${remaining} remaining`}
        icon={ClipboardList}
      />
      <StatCard label="Learning streak" value={`${streak} days`} hint="Keep going" icon={Flame} />
    </div>
  );
}
