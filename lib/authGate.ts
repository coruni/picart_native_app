import { toast } from "@/hooks/useToast";
import i18n from "@/locales/i18n";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";

// 未登录时先跳登录页并返回 false —— 调用方拿到 false 必须直接 return，**不能先做乐观更新**。
export function ensureLoggedInForAction(): boolean {
  const { isLoggedIn, hasHydrated } = useAuthStore.getState();

  if (isLoggedIn) return true;
  // 还没读完本地会话时不弹登录页，避免冷启动瞬间误跳
  if (!hasHydrated) return false;

  toast.show(i18n.t("auth.loginActionRequired"));
  router.push("/auth");
  return false;
}
