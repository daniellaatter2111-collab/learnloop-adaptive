import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/parent")({
  component: () => <AppShell role="parent" />,
});
