import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/parent/reports")({ component: () => <ReportsPage child /> });
