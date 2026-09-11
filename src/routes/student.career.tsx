import { createFileRoute } from "@tanstack/react-router";
import { CareerPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/student/career")({ component: CareerPage });
