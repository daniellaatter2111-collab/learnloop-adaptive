import { getState, setState } from "@/lib/store";
import type { Student } from "@/types";

export const studentService = {
  getStudents(): Student[] {
    return getState().students;
  },

  getStudent(id: string): Student | undefined {
    return getState().students.find((s) => s.id === id);
  },

  createStudent(input: { name: string; id: string; academicLevel: string }): Student {
    const student: Student = {
      id: input.id.trim() || `stu-${Date.now()}`,
      name: input.name.trim(),
      academicLevel: input.academicLevel,
      learningStyle: "visual",
      confidence: 50,
      peakHours: "Not established yet",
      overallProgress: 0,
      averageScore: 0,
      studyTime: "0h 00m",
      streak: 0,
      engagement: "Medium",
      status: "On track",
    };
    setState((s) => ({ students: [...s.students, student] }));
    return student;
  },

  removeStudent(id: string) {
    setState((s) => ({ students: s.students.filter((x) => x.id !== id) }));
  },
};
