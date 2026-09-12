import { useSyncExternalStore } from "react";
import type {
  Assignment,
  CourseMaterial,
  LearningProfile,
  LearningItem,
  Notification,
  OnboardingData,
  Student,
  TutorMessage,
  StudyPlanItem,
  Theme,
  User,
} from "@/types";
import { mockStudents } from "@/data/mockStudents";
import { mockAssignments } from "@/data/mockAssignments";
import { mockMaterials } from "@/data/mockCourses";
import { mockLearningProfile } from "@/data/mockLearningProfile";
import { mockLearningItems } from "@/data/mockCourses";
import { studyPlan } from "@/data/mockReports";
import { queueOfflineChange } from "@/lib/offline";

export type AppState = {
  user: User | null;
  students: Student[];
  assignments: Assignment[];
  materials: CourseMaterial[];
  profile: LearningProfile;
  learningItems: LearningItem[];
  onboarding: OnboardingData | null;
  onboardingComplete: boolean;
  tutorMessages: TutorMessage[];
  studyPlan: StudyPlanItem[];
  theme: Theme;
  notifications: Notification[];
  hydrated: boolean;
};

const STORAGE_KEY = "learnloop:state:v1";

export const initialState: AppState = {
  user: null,
  students: mockStudents,
  assignments: mockAssignments,
  materials: mockMaterials,
  profile: mockLearningProfile,
  learningItems: mockLearningItems,
  onboarding: null,
  onboardingComplete: false,
  tutorMessages: [],
  studyPlan: [...studyPlan],
  theme: "light",
  notifications: [
    {
      id: "n1",
      title: "New assignment",
      body: "Physics quiz was assigned to you.",
      read: false,
      time: "10 min ago",
    },
    {
      id: "n2",
      title: "Learning insight",
      body: "You perform better with visual summaries.",
      read: false,
      time: "2h ago",
    },
    {
      id: "n3",
      title: "Study reminder",
      body: "Your peak study time starts in 15 minutes.",
      read: true,
      time: "Yesterday",
    },
  ],
  hydrated: false,
};

let state: AppState = initialState;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    const { hydrated: _hydrated, ...rest } = state;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    /* storage unavailable — prototype keeps working in memory */
  }
}

export function setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  persist();
  queueOfflineChange();
  emit();
}

export function getState() {
  return state;
}

export function hydrate() {
  if (state.hydrated || typeof window === "undefined") return;
  let stored: Partial<AppState> = {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) stored = JSON.parse(raw) as Partial<AppState>;
  } catch {
    stored = {};
  }
  // Older demo sessions did not include classroom ownership.  Normalise them
  // so existing users seamlessly receive the new teacher-scoped experience.
  const students = (stored.students ?? initialState.students).map((student) => ({
    ...student,
    email: student.email ?? `${student.id}@learnloop.app`,
    teacherId: student.teacherId ?? "teacher-sarah",
  }));
  const materials = (stored.materials ?? initialState.materials).map((material) => ({
    ...material,
    teacherId: material.teacherId ?? "teacher-sarah",
    recipientStudentIds: material.recipientStudentIds ?? students.map((student) => student.id),
  }));
  state = { ...initialState, ...stored, students, materials, hydrated: true };
  emit();
}

export function resetStore() {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  state = { ...initialState, hydrated: true };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initialState,
  );
}
