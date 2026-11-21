import { toast } from "@/hooks/useToast";
import i18n from "@/locales/i18n";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";

/**
 * 需要登录才能做的交互（点赞 / 收藏 / 关注等）的统一入口。
 *
 * 未登录时先跳登录页并返回 false —— 调用方拿到 false 必须直接 return，
 * **不能先做乐观更新**。访客点一次赞如果先翻成"已赞"，请求 401 之后
 * 状态没人回滚（或者回滚前用户已经切走了），就会留下"看着点上了、
 * 其实服务端没收到"的错误本地状态。
 */
export function ensureLoggedInForAction(): boolean {
  const { isLoggedIn, hasHydrated } = useAuthStore.getState();

  if (isLoggedIn) return true;
  // 还没读完本地会话时不弹登录页，避免冷启动瞬间误跳
  if (!hasHydrated) return false;

  toast.show(i18n.t("auth.loginActionRequired"));
  router.push("/auth");
  return false;
}
