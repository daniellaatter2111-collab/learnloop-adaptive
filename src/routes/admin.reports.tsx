import { createFileRoute } from "@tanstack/react-router";
import { AdminReportsPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/admin/reports")({ component: AdminReportsPage });
