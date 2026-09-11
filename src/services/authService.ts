import { getState, setState } from "@/lib/store";
import type { User, UserRole } from "@/types";

const profiles: Record<UserRole, Omit<User, "email">> = {
  student: { id: "usr-1", name: "Alex Morgan", role: "student", studentId: "stu-1" },
  admin: { id: "usr-2", name: "Sarah Whitfield", role: "admin" },
  parent: { id: "usr-3", name: "Jordan Morgan", role: "parent", studentId: "stu-1" },
};

export const authService = {
  async login(email: string, password: string, role: UserRole): Promise<User> {
    await new Promise((r) => setTimeout(r, 600));
    if (!email.trim() || !password.trim()) {
      throw new Error("Enter your email and password to continue.");
    }
    const user: User = { ...profiles[role], email: email.trim() };
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
