import { useEffect, type ReactNode } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentStudent, useStudent } from "@/hooks/useStudents";
import type { UserRole } from "@/types";

function greetingFor(role: UserRole, name: string, childName: string) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  if (role === "parent") return `${childName}'s learning overview`;
  return `${part}, ${name.split(" ")[0]}`;
}

export function AppShell({ role, children }: { role: UserRole; children?: ReactNode }) {
  const { user, hydrated, logout } = useAuth();
  const navigate = useNavigate();
  const currentStudent = useCurrentStudent();
  const child = useStudent("stu-1");

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      navigate({ to: "/login", replace: true });
    } else if (user.role !== role) {
      navigate({
        to: user.role === "student" ? "/student" : user.role === "admin" ? "/admin" : "/parent",
        replace: true,
      });
    }
  }, [hydrated, user, role, navigate]);

  function handleLogout() {
    logout();
    navigate({ to: "/login", replace: true });
  }

  if (!hydrated || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground" role="status">
          Loading your workspace…
        </p>
      </div>
    );
  }

  const subline =
    role === "student"
      ? "Here's your personalised learning overview for today."
      : role === "admin"
        ? "Here's how your students are progressing."
        : "A read-only view of your child's learning.";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-[240px] shrink-0 lg:block">
        <div className="fixed inset-y-0 w-[240px]">
          <AppSidebar
            role={role}
            userName={user.name}
            userLabel={user.email}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          user={user}
          greeting={greetingFor(role, user.name, currentStudent?.name ?? child?.name ?? "Alex")}
          subline={subline}
          onLogout={handleLogout}
        />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-5 sm:px-6 sm:py-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
