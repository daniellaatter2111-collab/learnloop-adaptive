import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/student/insights")({ component: InsightsPage });
