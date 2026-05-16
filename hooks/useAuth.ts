import { type AuthUser, useAuthStore } from "@/store/authStore";
import { useShallow } from "zustand/react/shallow";

export type { AuthUser };

export function useAuth(): {
  isLoggedIn: boolean;
  hasHydrated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
} {
  return useAuthStore(
    useShallow((s) => ({
      isLoggedIn: s.isLoggedIn,
      hasHydrated: s.hasHydrated,
      token: s.token,
      refreshToken: s.refreshToken,
      user: s.user,
    })),
  );
}
