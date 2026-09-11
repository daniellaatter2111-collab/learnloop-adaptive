import { createFileRoute } from "@tanstack/react-router";
import { AdminMaterialsPage } from "@/components/portal/Pages";
export const Route = createFileRoute("/admin/materials")({ component: AdminMaterialsPage });
