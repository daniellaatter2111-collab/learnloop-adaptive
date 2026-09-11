import { getState, setState } from "@/lib/store";
import type { Assignment, AssignmentStatus } from "@/types";

function statusFor(progress: number): AssignmentStatus {
  if (progress >= 100) return "completed";
  if (progress <= 0) return "not_started";
  return "in_progress";
}

export const assignmentService = {
  getAssignments(studentId?: string): Assignment[] {
    const all = getState().assignments;
    return studentId ? all.filter((a) => a.studentId === studentId) : all;
  },

  createAssignment(input: Omit<Assignment, "id" | "progress" | "status">): Assignment {
    const assignment: Assignment = {
      ...input,
      id: `asg-${Date.now()}`,
      progress: 0,
      status: "not_started",
    };
    setState((s) => ({ assignments: [assignment, ...s.assignments] }));
    return assignment;
  },

  updateAssignment(id: string, patch: Partial<Assignment>) {
    setState((s) => ({
      assignments: s.assignments.map((a) => {
        if (a.id !== id) return a;
        const merged = { ...a, ...patch };
        return { ...merged, status: patch.status ?? statusFor(merged.progress) };
      }),
    }));
  },

  setProgress(id: string, progress: number) {
    const clamped = Math.max(0, Math.min(100, Math.round(progress)));
    assignmentService.updateAssignment(id, { progress: clamped, status: statusFor(clamped) });
  },

  deleteAssignment(id: string) {
    setState((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) }));
  },
};
