import { getState, setState } from "@/lib/store";
import type { User, UserRole } from "@/types";

const profiles: Record<UserRole, Omit<User, "email">> = {
  student: { id: "usr-1", name: "Alex Morgan", role: "student", studentId: "stu-1" },
  admin: { id: "teacher-sarah", name: "Sarah Whitfield", role: "admin" },
  parent: { id: "usr-3", name: "Jordan Morgan", role: "parent", studentId: "stu-1" },
};

export const authService = {
  async login(email: string, password: string, role: UserRole): Promise<User> {
    await new Promise((r) => setTimeout(r, 600));
    if (!email.trim() || !password.trim()) {
      throw new Error("Enter your email and password to continue.");
    }
    const normalizedEmail = email.trim().toLowerCase();
    let user: User;
    if (role === "student") {
      const student = getState().students.find(
        (item) => item.email.toLowerCase() === normalizedEmail,
      );
      if (!student) {
        throw new Error(
          "We couldn't find a learner for that email. Ask your teacher to add you first.",
        );
      }
      user = {
        id: `user-${student.id}`,
        name: student.name,
        email: normalizedEmail,
        role,
        studentId: student.id,
      };
    } else if (role === "admin") {
      // Each teacher gets an isolated classroom session keyed by their email.
      // The seeded Sarah account keeps the demo class available for judging.
      const teacherId =
        normalizedEmail === "sarah@learnloop.app"
          ? "teacher-sarah"
          : `teacher-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`;
      const adminProfile = profiles.admin;
      const name =
        normalizedEmail === "sarah@learnloop.app"
          ? adminProfile.name
          : (normalizedEmail.split("@")[0] ?? "Teacher")
              .replace(/[._-]/g, " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase());
      user = { id: teacherId, name, email: normalizedEmail, role };
    } else {
      user = { ...profiles.parent, email: normalizedEmail };
    }
    setState({ user });
    return user;
  },

  logout() {
    setState({ user: null });
  },

  current() {
    return getState().user;
  },

  homeFor(role: UserRole) {
    return role === "student" ? "/student" : role === "admin" ? "/admin" : "/parent";
  },
};
