import { useAppState } from "@/lib/store";
import { assignmentService } from "@/services/assignmentService";

export function useAssignments(studentId?: string) {
  const { assignments } = useAppState();
  return {
    assignments: studentId ? assignments.filter((a) => a.studentId === studentId) : assignments,
    createAssignment: assignmentService.createAssignment,
    updateAssignment: assignmentService.updateAssignment,
    setProgress: assignmentService.setProgress,
    deleteAssignment: assignmentService.deleteAssignment,
  };
}
