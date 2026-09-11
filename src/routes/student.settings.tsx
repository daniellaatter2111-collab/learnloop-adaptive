import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/student/settings")({ component: () => <SettingsPage role="student" /> });
