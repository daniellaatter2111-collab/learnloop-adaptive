import { useAppState } from "@/lib/store";
import { learningService } from "@/services/learningService";

export function useLearningProfile() {
  const { profile, onboardingComplete, onboarding } = useAppState();
  return {
    profile,
    onboarding,
    onboardingComplete,
    completeOnboarding: learningService.completeOnboarding,
    recommendations: learningService.getRecommendations(profile.style),
    items: learningService.getLearningItems(),
  };
}
