import { useAuthStore } from "@/store/authStore";
import * as Notifications from "expo-notifications";
import { useEffect, useSyncExternalStore } from "react";
import {
  configurePushNotifications,
  getPushStatus,
  handleNotificationResponse,
  registerPushToken,
  subscribePushStatus,
  unregisterPushToken,
  type PushStatus,
} from "@/lib/push";

/**
 * 应用级推送接线：
 * - 启动即注册前台处理器（必须早于首条推送）
 * - 登录后静默刷新 token；退出登录解绑
 * - 监听 token 轮换与用户点击
 * - 冷启动时补处理「点击通知拉起 App」的场景
 */
export function usePushNotifications(appReady: boolean) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authToken = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // 处理器要在模块加载阶段就绪，这里再兜一层防止热重载丢失
  useEffect(() => {
    configurePushNotifications();
  }, []);

  useEffect(() => {
    if (!appReady || !hasHydrated) return;

    if (!isLoggedIn || !authToken) {
      void unregisterPushToken();
      return;
    }

    // 启动时不弹权限框，只在已授权时静默换 token
    void registerPushToken({ requestPermission: false });
  }, [appReady, hasHydrated, isLoggedIn, authToken]);

  // FCM / APNs token 轮换后重新上报
  useEffect(() => {
    const subscription = Notifications.addPushTokenListener(() => {
      if (useAuthStore.getState().isLoggedIn) {
        void registerPushToken({ requestPermission: false });
      }
    });

    return () => subscription.remove();
  }, []);

  // 前台 / 后台点击通知
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        void handleNotificationResponse(response);
      },
    );

    return () => subscription.remove();
  }, []);

  // 冷启动：App 被通知拉起时，首次渲染后再跳转，避免路由未挂载
  useEffect(() => {
    if (!appReady) return;

    let cancelled = false;

    void (async () => {
      try {
        const last = await Notifications.getLastNotificationResponseAsync();
        if (cancelled || !last) return;

        await Notifications.clearLastNotificationResponseAsync();
        setTimeout(() => {
          void handleNotificationResponse(last);
        }, 350);
      } catch {
        // 冷启动读取失败不影响正常使用
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appReady]);
}

/** 设置页用：订阅推送状态（权限 / token / 错误） */
export function usePushStatus(): PushStatus {
  return useSyncExternalStore(
    subscribePushStatus,
    getPushStatus,
    getPushStatus,
  );
}
