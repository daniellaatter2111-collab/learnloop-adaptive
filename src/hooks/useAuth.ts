import { useAppState } from "@/lib/store";
import { authService } from "@/services/authService";
import type { UserRole } from "@/types";

export function useAuth() {
  const { user, hydrated } = useAppState();
  return {
    user,
    hydrated,
    isAuthenticated: Boolean(user),
    role: user?.role ?? null,
    can: (roles: UserRole[]) => Boolean(user && roles.includes(user.role)),
    login: authService.login,
    logout: authService.logout,
    homeFor: authService.homeFor,
  };
}
