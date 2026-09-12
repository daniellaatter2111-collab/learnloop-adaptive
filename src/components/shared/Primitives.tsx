import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AssignmentStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function Card({
  children,
  className,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag className={cn("card-surface p-5 sm:p-6", className)}>
      {children}
    </Tag>
  );
}

export function CardHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="section-title text-foreground">{title}</h2>
        {description ? <p className="meta-text mt-1">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="page-title text-foreground">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function ProgressBar({
  value,
  className,
  tone = "primary",
  label,
}: {
  value: number;
  className?: string;
  tone?: "primary" | "success" | "warning";
  label?: string;
}) {
  const toneClass =
    tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-300", toneClass)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function CircularProgress({
  value,
  size = 84,
  stroke = 8,
  caption,
}: {
  value: number;
  size?: number;
  stroke?: number;
  caption?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(value)}% ${caption ?? "complete"}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-muted"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-500"
          fill="none"
        />
      </svg>
      <span className="absolute text-base font-semibold">{Math.round(value)}%</span>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  completed: "bg-success-soft text-success",
  in_progress: "bg-info-soft text-info",
  not_started: "bg-muted text-muted-foreground",
};

const statusLabels: Record<AssignmentStatus, string> = {
  completed: "Completed",
  in_progress: "In progress",
  not_started: "Not started",
};

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {statusLabels[status]}
    </span>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    primary: "bg-primary-soft text-accent-foreground",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
  } as const;
  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-border bg-surface px-6 py-14 text-center">
      {icon ? (
        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
          {icon}
        </div>
      ) : null}
      <p className="text-[15px] font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid gap-4" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-[14px]" />
      ))}
    </div>
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground ring-2 ring-surface",
        className,
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function TrendLabel({ trend }: { trend: "up" | "flat" | "down" }) {
  const map = {
    up: { text: "Improving", cls: "text-success", arrow: "↑" },
    flat: { text: "Stable", cls: "text-muted-foreground", arrow: "→" },
    down: { text: "Needs attention", cls: "text-danger", arrow: "↓" },
  } as const;
  const t = map[trend];
  return (
    <span className={cn("text-xs font-medium", t.cls)}>
      {t.arrow} {t.text}
    </span>
  );
}
