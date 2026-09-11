import { createFileRoute } from "@tanstack/react-router";
import { AdminCareerPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/admin/career")({ component: AdminCareerPage });
