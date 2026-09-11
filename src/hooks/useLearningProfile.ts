import { useAppState } from "@/lib/store";
import { learningService } from "@/services/learningService";

export function useLearningProfile() {
  const { profile, onboardingComplete, onboarding, learningItems } = useAppState();
  return {
    profile,
    onboarding,
    onboardingComplete,
    completeOnboarding: learningService.completeOnboarding,
    setItemProgress: learningService.setItemProgress,
    recommendations: learningService.getRecommendations(profile.style),
    items: learningItems,
  };
}
