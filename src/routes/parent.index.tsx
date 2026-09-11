import { createFileRoute } from "@tanstack/react-router";
import { ParentDashboard } from "@/components/portal/Pages";
export const Route = createFileRoute("/parent/")({ component: ParentDashboard });
