import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/admin/settings")({ component: () => <SettingsPage role="admin" /> });
