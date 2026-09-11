import { createFileRoute } from "@tanstack/react-router";
import { AdminAssignmentsPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/admin/assignments")({ component: AdminAssignmentsPage });
