import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Loader2, Radio, Sparkles, Users } from "lucide-react";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
    <div className="pulse-stage relative flex min-h-screen overflow-hidden px-5 py-8 sm:py-12">
      <div className="relative mx-auto flex w-full max-w-md flex-col justify-center">
        <div className="mb-7 text-center text-primary-foreground">
          <Link to="/" className="mb-5 inline-flex [&>div]:text-primary-foreground">
            <BrandMark />
          </Link>
          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/15 px-4 py-1.5 text-xs font-bold uppercase text-primary-foreground backdrop-blur">
            <Radio className="size-3.5" /> Live learning
          </div>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Learning that adapts to you.</h1>
          <p className="mt-2 text-sm font-semibold text-primary-foreground/75">Your next learning win starts here.</p>
        </div>

        <form onSubmit={handleSubmit} className="pulse-shadow space-y-5 rounded-[28px] bg-surface p-6 sm:p-8">
          <div className="text-center">
            <Sparkles className="mx-auto mb-2 size-5 text-accent" />
            <h2 className="font-display text-2xl font-bold">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose your role and jump back in.</p>
          </div>
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
                    "rounded-xl border px-3 py-2.5 text-sm font-bold transition-all",
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

          <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Demo access — choose a role to explore LearnLoop.
          </p>
        </form>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-primary-foreground/75">
          <Users className="size-4" /> 1,248 learners growing today
        </div>
      </div>
    </div>
  );
}
