import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/admin")({
  // Child teacher routes are rendered by AppShell's Outlet.  Rendering the
  // dashboard here used to hide every child page behind the overview.
  component: () => <AppShell role="admin" />,
});
