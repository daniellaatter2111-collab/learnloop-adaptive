import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/parent/settings")({ component: () => <SettingsPage role="parent" /> });
