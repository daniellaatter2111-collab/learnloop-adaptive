import {
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  MessageCircle,
  Settings,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";

export const studentNav = [
  { to: "/student", label: "Overview", icon: Home },
  { to: "/student/learning", label: "My Learning", icon: BookOpen },
  { to: "/student/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/student/study-plan", label: "Study Plan", icon: Calendar },
  { to: "/student/tutor", label: "AI Tutor", icon: MessageCircle },
  { to: "/student/progress", label: "Progress", icon: TrendingUp },
  { to: "/student/profile", label: "Learning Profile", icon: Brain },
  { to: "/student/insights", label: "Insights", icon: Sparkles },
  { to: "/student/career", label: "Career Paths", icon: Briefcase },
  { to: "/student/reports", label: "Reports", icon: FileText },
  { to: "/student/settings", label: "Settings", icon: Settings },
] as const;

export const adminNav = [
  { to: "/admin", label: "Overview", icon: Home },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/admin/materials", label: "Course Materials", icon: Upload },
  { to: "/admin/reports", label: "Reports", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export const parentNav = [
  { to: "/parent", label: "Overview", icon: Home },
  { to: "/parent/progress", label: "Progress", icon: TrendingUp },
  { to: "/parent/profile", label: "Learning Profile", icon: Brain },
  { to: "/parent/reports", label: "Reports", icon: FileText },
  { to: "/parent/settings", label: "Settings", icon: Settings },
] as const;

export const notificationIcon = Bell;

export type NavItem = (typeof studentNav | typeof adminNav | typeof parentNav)[number];
