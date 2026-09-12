import { getState, setState } from "@/lib/store";
import type { StudyPlanItem } from "@/types";

type StudyPlanPreferences = {
  startTime: string;
  studyMinutes: number;
  breakMinutes: number;
  tutorMinutes: number;
};

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

function displayTime(totalMinutes: number) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

export const studyPlanService = {
  update(preferences: StudyPlanPreferences) {
    const start = toMinutes(preferences.startTime);
    const items: StudyPlanItem[] = [
      {
        time: displayTime(start),
        title: "Mathematics — Visual lesson",
        duration: `${preferences.studyMinutes} min`,
        kind: "study",
      },
      {
        time: displayTime(start + preferences.studyMinutes),
        title: "Break",
        duration: `${preferences.breakMinutes} min`,
        kind: "break",
      },
      {
        time: displayTime(start + preferences.studyMinutes + preferences.breakMinutes),
        title: "Physics — Flashcards",
        duration: `${preferences.studyMinutes} min`,
        kind: "study",
      },
      {
        time: displayTime(start + preferences.studyMinutes * 2 + preferences.breakMinutes),
        title: "AI Tutor session",
        duration: `${preferences.tutorMinutes} min`,
        kind: "tutor",
      },
    ];
    setState({ studyPlan: items });
    return items;
  },

  get() {
    return getState().studyPlan;
  },
};
