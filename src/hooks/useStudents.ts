import { useAppState } from "@/lib/store";
import { studentService } from "@/services/studentService";

export function useStudents() {
  const { students, user } = useAppState();
  const teacherStudents =
    user?.role === "admin" ? students.filter((student) => student.teacherId === user.id) : students;
  return {
    students: teacherStudents,
    createStudent: studentService.createStudent,
    removeStudent: studentService.removeStudent,
  };
}

export function useStudent(id: string | undefined) {
  const { students } = useAppState();
  return students.find((s) => s.id === id) ?? students[0];
}

export function useCurrentStudent() {
  const { students, user } = useAppState();
  return students.find((student) => student.id === user?.studentId);
}
