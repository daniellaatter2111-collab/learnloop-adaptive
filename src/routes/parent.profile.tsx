import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/portal/Pages";
export const Route = createFileRoute("/parent/profile")({ component: () => <ProfilePage child /> });
