import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AdminDashboard } from "@/components/portal/Pages";

export const Route = createFileRoute("/admin")({
  component: () => <AppShell role="admin"><AdminDashboard /></AppShell>,
});
