import { useAppState } from "@/lib/store";
import { studentService } from "@/services/studentService";

export function useStudents() {
  const { students } = useAppState();
  return {
    students,
    createStudent: studentService.createStudent,
    removeStudent: studentService.removeStudent,
  };
}

export function useStudent(id: string | undefined) {
  const { students } = useAppState();
  return students.find((s) => s.id === id) ?? students[0];
}
