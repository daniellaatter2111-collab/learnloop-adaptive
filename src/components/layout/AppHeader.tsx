import { Bell, Menu, LogOut, User as UserIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Avatar } from "@/components/shared/Primitives";
import { useNotifications } from "@/hooks/useNotifications";
import type { User } from "@/types";

export function AppHeader({
  user,
  greeting,
  subline,
  onLogout,
}: {
  user: User;
  greeting: string;
  subline?: string;
  onLogout: () => void;
}) {
  const { notifications, unread, markAllRead } = useNotifications();
  const profilePath =
    user.role === "student" ? "/student/profile" : user.role === "admin" ? "/admin/settings" : "/parent/profile";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6">
      <Sheet>
        <SheetTrigger
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" aria-hidden />
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar
            role={user.role}
            userName={user.name}
            userLabel={user.email}
            onLogout={onLogout}
          />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-foreground">{greeting}</p>
        {subline ? <p className="truncate text-xs text-muted-foreground">{subline}</p> : null}
      </div>

      <Popover>
        <PopoverTrigger
          className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        >
          <Bell className="size-5" aria-hidden />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-surface" />
          ) : null}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-medium text-primary hover:underline"
            >
              Mark all read
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <li key={n.id} className="border-b border-border px-4 py-3 last:border-0">
                <div className="flex items-start gap-2">
                  {!n.read ? <span className="mt-1.5 size-1.5 rounded-full bg-primary" /> : null}
                  <div className={n.read ? "pl-3.5" : ""}>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="meta-text">{n.body}</p>
                    <p className="mt-1 text-xs text-subtle">{n.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open profile menu" className="rounded-full">
          <Avatar name={user.name} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={profilePath}>
              <UserIcon className="size-4" aria-hidden /> View profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onLogout}>
            <LogOut className="size-4" aria-hidden /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
