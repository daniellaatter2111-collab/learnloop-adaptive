import { Link } from "@tanstack/react-router";
import { Repeat, LogOut } from "lucide-react";
import type { UserRole } from "@/types";
import { adminNav, parentNav, studentNav, type NavItem } from "./navConfig";
import { Avatar } from "@/components/shared/Primitives";
import { cn } from "@/lib/utils";

export function navFor(role: UserRole): readonly NavItem[] {
  return role === "student" ? studentNav : role === "admin" ? adminNav : parentNav;
}

export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
        <Repeat className="size-4" aria-hidden />
      </span>
      <span className="font-display text-lg font-extrabold">LearnLoop</span>
    </div>
  );
}

export function AppSidebar({
  role,
  userName,
  userLabel,
  onNavigate,
  onLogout,
}: {
  role: UserRole;
  userName: string;
  userLabel: string;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  const items = navFor(role);
  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-sidebar">
      <div className="px-5 py-5">
        <BrandMark />
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                activeOptions={{ exact: item.to.split("/").length === 2 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-sidebar-foreground/70 transition-all duration-150",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                )}
                activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" }}
              >
                <item.icon className="size-[18px]" aria-hidden />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-[10px] px-2 py-2">
          <Avatar name={userName} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">{userLabel}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out"
            className="rounded-md p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
