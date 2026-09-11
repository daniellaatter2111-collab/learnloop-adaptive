import { createFileRoute } from "@tanstack/react-router";
import { ProgressPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/student/progress")({ component: ProgressPage });
