import { getState, setState } from "@/lib/store";
import type { LearningItem, LearningProfile, LearningStyle, OnboardingData } from "@/types";

const VISUAL_SIGNALS = ["Watching diagrams", "Reading explanations", "Practicing questions"];
const AUDIO_SIGNALS = ["Listening to explanations"];

const PEAK_HOURS: Record<string, string> = {
  Morning: "7:00 AM – 9:00 AM",
  Afternoon: "2:00 PM – 4:00 PM",
  Evening: "6:00 PM – 8:00 PM",
  Night: "9:00 PM – 11:00 PM",
};

/** Transparent rule-based heuristic — no ML model in the prototype. */
export function calculateLearningProfile(data: OnboardingData): {
  style: LearningStyle;
  confidence: number;
  peakHours: string;
} {
  const prefs = data.learningPreference;
  const visual = prefs.filter((p) => VISUAL_SIGNALS.includes(p)).length;
  const audio = prefs.filter((p) => AUDIO_SIGNALS.includes(p)).length;
  const total = Math.max(visual + audio, 1);
  const style: LearningStyle = audio > visual ? "audio" : "visual";
  const dominant = style === "visual" ? visual : audio;
  const raw = 55 + Math.round((dominant / total) * 30);
  const confidence = Math.min(94, Math.max(55, raw));
  return { style, confidence, peakHours: PEAK_HOURS[data.productiveTime] ?? "6:00 PM – 8:00 PM" };
}

export const learningService = {
  getProfile(): LearningProfile {
    return getState().profile;
  },

  completeOnboarding(data: OnboardingData): LearningProfile {
    const { style, confidence, peakHours } = calculateLearningProfile(data);
    const preferredFormats =
      style === "visual"
        ? ["Visual summaries", "Diagrams", "Flashcards"]
        : ["Audio explanations", "Video lessons", "Verbal walkthroughs"];
    const profile: LearningProfile = {
      ...getState().profile,
      style,
      confidence,
      peakHours,
      preferredFormats,
    };
    setState((s) => ({
      profile,
      onboarding: data,
      onboardingComplete: true,
      students: s.students.map((st) =>
        st.id === "stu-1"
          ? {
              ...st,
              name: data.name || st.name,
              academicLevel: data.academicLevel || st.academicLevel,
              learningStyle: style,
              confidence,
              peakHours,
            }
          : st,
      ),
    }));
    return profile;
  },

  getLearningItems(): LearningItem[] {
    return getState().learningItems;
  },

  setItemProgress(id: string, progress: number) {
    const nextProgress = Math.max(0, Math.min(100, Math.round(progress)));
    setState((s) => ({
      learningItems: s.learningItems.map((item) =>
        item.id === id ? { ...item, progress: nextProgress } : item,
      ),
    }));
  },

  /** Adaptive content: surface items matching the student's learning style first. */
  getRecommendations(style: LearningStyle, limit = 3): LearningItem[] {
    return getState().learningItems
      .filter((i) => i.recommended)
      .sort((a, b) => Number(b.suitedTo === style) - Number(a.suitedTo === style))
      .slice(0, limit);
  },
};
