import { createFileRoute } from "@tanstack/react-router";
import { AdminStudentsPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/admin/students")({ component: AdminStudentsPage });
