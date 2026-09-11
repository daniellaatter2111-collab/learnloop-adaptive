import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { BrandMark } from "@/components/navigation/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — LearnLoop" },
      {
        name: "description",
        content: "Sign in to LearnLoop as a student, teacher or parent.",
      },
      { property: "og:title", content: "Sign in — LearnLoop" },
      { property: "og:description", content: "Access your adaptive learning workspace." },
    ],
  }),
  component: LoginPage,
});

const roles: { value: UserRole; label: string; hint: string }[] = [
  { value: "student", label: "Student", hint: "alex@learnloop.app" },
  { value: "admin", label: "Teacher", hint: "sarah@learnloop.app" },
  { value: "parent", label: "Parent", hint: "jordan@learnloop.app" },
];

function LoginPage() {
  const { login, homeFor } = useAuth();
  const { onboardingComplete } = useAppState();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("alex@learnloop.app");
  const [password, setPassword] = useState("learnloop");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password, role);
      if (user.role === "student" && !onboardingComplete) {
        navigate({ to: "/student/onboarding", replace: true });
      } else {
        navigate({ to: homeFor(user.role), replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign you in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
        <Link to="/" className="mb-8 inline-flex">
          <BrandMark />
        </Link>
        <h1 className="page-title">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose your role and sign in to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">I am a</legend>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  aria-pressed={role === r.value}
                  onClick={() => {
                    setRole(r.value);
                    setEmail(r.hint);
                  }}
                  className={cn(
                    "rounded-[10px] border px-3 py-2.5 text-sm font-medium transition-colors",
                    role === r.value
                      ? "border-primary bg-primary-soft text-accent-foreground"
                      : "border-border bg-surface text-muted-foreground hover:bg-muted",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Demo prototype — any email and password will work.
          </p>
        </form>
      </div>
    </div>
  );
}
