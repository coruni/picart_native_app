import { API_BASE_PATH, getAuthToken, getDeviceId } from "@/api";
import type { PushSettingKey } from "@/store/settingsStore";
import { useSettingsStore } from "@/store/settingsStore";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { t as translate } from "i18next";
import { Platform } from "react-native";

/**
 * Expo Push 接入层。
 *
 * 职责分四块：
 * 1. 前台展示策略（setNotificationHandler）—— 复用本地 PUSH 开关做过滤
 * 2. 权限与 token（requestPermissions / getExpoPushTokenAsync）
 * 3. token 落地（SecureStore）+ 后端注册（接口上线前保持关闭）
 * 4. 点击通知的路由分发（复用现有 article / comment / user / chat 页面）
 */

const TOKEN_STORAGE_KEY = "push.expoToken";

/** Android 8+ 通知渠道 id，需与 app.json 里 expo-notifications 的 defaultChannel 保持一致 */
export const DEFAULT_NOTIFICATION_CHANNEL_ID = "default";

/**
 * 后端设备注册接口尚未上线（openapi 里没有 /user/push/devices），
 * 因此默认只把 token 落在本地，不产生 404 噪音。
 * 后端就绪后把这里改成 true 即可自动注册。
 */
export const PUSH_REGISTRATION_ENABLED = false;

export type PushPermissionState = "granted" | "denied" | "undetermined";

export interface PushStatus {
  permission: PushPermissionState;
  /** Expo push token，形如 ExponentPushToken[xxxx] */
  token: string | null;
  /** 最近一次失败原因，便于设置页直接展示 */
  error: string | null;
  /** 正在申请权限 / 拉取 token */
  syncing: boolean;
  /** 是否已成功推送到后端 */
  registered: boolean;
}

const INITIAL_STATUS: PushStatus = {
  permission: "undetermined",
  token: null,
  error: null,
  syncing: false,
  registered: false,
};

let status: PushStatus = INITIAL_STATUS;
const statusListeners = new Set<(next: PushStatus) => void>();

function setStatus(patch: Partial<PushStatus>) {
  status = { ...status, ...patch };
  statusListeners.forEach((listener) => listener(status));
}

export function getPushStatus(): PushStatus {
  return status;
}

export function subscribePushStatus(listener: (next: PushStatus) => void) {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

/** 把原生权限状态归一化，避免各平台字段差异泄漏到 UI */
function normalizePermission(
  settings: Notifications.NotificationPermissionsStatus,
): PushPermissionState {
  if (settings.granted) return "granted";
  if (settings.status === "undetermined") return "undetermined";
  return "denied";
}

/**
 * 前台收到推送时是否展示。
 * 复用设置页的 5 个本地开关（评论/点赞/关注/推荐/关注的人），
 * 关掉的类型即便到达也不弹横幅、不进通知中心。
 */
function shouldPresentNotification(data: Record<string, unknown>): boolean {
  const key = resolvePushSettingKey(data);
  if (!key) return true;
  return useSettingsStore.getState().push[key];
}

function resolvePushSettingKey(
  data: Record<string, unknown>,
): PushSettingKey | null {
  const raw = `${asString(data.type) ?? ""} ${
    asString(data.notificationType) ?? ""
  }`.toLowerCase();
  if (!raw.trim()) return null;

  // 顺序即优先级：推荐 / 关注的人 要先于通用的 follow 判断
  if (/recommend|推荐/.test(raw)) return "pushRecommend";
  if (/following|关注的人/.test(raw)) return "pushFollowing";
  if (/like|favorite|favourite|collect|upvote|thumb|点赞|赞/.test(raw))
    return "pushLike";
  if (/comment|reply|mention|评论|回复|提及/.test(raw)) return "pushComment";
  if (/follow|关注/.test(raw)) return "pushFollow";
  return null;
}

/**
 * 注册前台处理器与 Android 通知渠道。
 * 必须在应用启动早期调用（_layout 顶部），否则冷启动首条推送可能被丢弃。
 */
export function configurePushNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const data = (notification.request.content.data ?? {}) as Record<
        string,
        unknown
      >;
      const present = shouldPresentNotification(data);
      return {
        shouldShowBanner: present,
        shouldShowList: present,
        shouldPlaySound: present,
        shouldSetBadge: false,
      };
    },
  });

  if (Platform.OS === "android") {
    void Notifications.setNotificationChannelAsync(
      DEFAULT_NOTIFICATION_CHANNEL_ID,
      {
        name: translate("pushSettingPage.channelName"),
        importance: Notifications.AndroidImportance.DEFAULT,
        lightColor: "#6680FF",
        vibrationPattern: [0, 200, 120, 200],
      },
    ).catch(() => undefined);
  }
}

async function readStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

async function persistToken(token: string | null): Promise<void> {
  try {
    if (token) {
      await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    }
  } catch {
    // 持久化失败不影响本次会话
  }
}

/** 只读：同步一次权限 / 已存 token 到状态，不做任何弹窗 */
export async function refreshPushStatus(): Promise<PushStatus> {
  const [permission, token] = await Promise.all([
    Notifications.getPermissionsAsync()
      .then(normalizePermission)
      .catch<PushPermissionState>(() => "undetermined"),
    readStoredToken(),
  ]);
  setStatus({ permission, token });
  return status;
}

/** 主动申请通知权限（Android 13+ 会弹系统授权框，iOS 弹标准授权框） */
export async function requestPushPermission(): Promise<PushPermissionState> {
  setStatus({ syncing: true, error: null });

  try {
    const current = await Notifications.getPermissionsAsync();
    const settings = current.granted
      ? current
      : await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });

    const permission = normalizePermission(settings);
    setStatus({ permission });
    return permission;
  } catch (error) {
    setStatus({ error: formatError(error) });
    return "denied";
  } finally {
    setStatus({ syncing: false });
  }
}

function resolveProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as { easConfig?: { projectId?: string } }).easConfig?.projectId
  );
}

/** 取 Expo push token；未授权 / 模拟器 / 缺 FCM 配置时返回 null 并记录原因 */
async function fetchExpoPushToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    setStatus({ error: translate("pushSettingPage.errorUnsupported") });
    return null;
  }

  // SDK 53 起 Expo Go 在 Android 上不再支持远程推送，必须用 development build
  if (
    Platform.OS === "android" &&
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  ) {
    setStatus({ error: translate("pushSettingPage.errorExpoGo") });
    return null;
  }

  if (!Device.isDevice) {
    setStatus({ error: translate("pushSettingPage.errorSimulator") });
    return null;
  }

  const projectId = resolveProjectId();
  if (!projectId) {
    setStatus({ error: translate("pushSettingPage.errorProjectId") });
    return null;
  }

  const result = await Notifications.getExpoPushTokenAsync({ projectId });
  return result.data;
}

/**
 * 拿到 token 并落地。
 * - `requestPermission` 为 true 时先弹授权（设置页手动触发用）
 * - 启动时调用不要弹窗，只在已授权的情况下静默刷新 token
 */
export async function registerPushToken(options?: {
  requestPermission?: boolean;
}): Promise<PushStatus> {
  const requestPermission = options?.requestPermission ?? false;

  setStatus({ syncing: true, error: null });

  try {
    let permission = await Notifications.getPermissionsAsync()
      .then(normalizePermission)
      .catch<PushPermissionState>(() => "undetermined");

    if (permission !== "granted" && requestPermission) {
      permission = await requestPushPermission();
    }

    setStatus({ permission });

    if (permission !== "granted") {
      // 未授权时清掉旧 token，避免后端继续向已关闭通知的设备发
      await persistToken(null);
      setStatus({ token: null, registered: false, syncing: false });
      return status;
    }

    const token = await fetchExpoPushToken();
    if (!token) {
      setStatus({ token: null, registered: false });
      return status;
    }

    await persistToken(token);
    setStatus({ token });

    if (PUSH_REGISTRATION_ENABLED) {
      const registered = await submitTokenToServer(token);
      setStatus({ registered });
    }

    return status;
  } catch (error) {
    setStatus({ error: describePushError(error) });
    return status;
  } finally {
    setStatus({ syncing: false });
  }
}

/**
 * 上报 token 到后端。
 * 后端契约（待实现）：
 *   POST /user/push/devices
 *   { deviceId, provider: "expo", platform, token, appVersion }
 */
async function submitTokenToServer(token: string): Promise<boolean> {
  try {
    const [authToken, deviceId] = await Promise.all([
      getAuthToken(),
      getDeviceId(),
    ]);
    if (!authToken) return false;

    const response = await fetch(`${API_BASE_PATH}/user/push/devices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "device-id": deviceId,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        deviceId,
        provider: "expo",
        platform: Platform.OS,
        token,
        appVersion: Constants.expoConfig?.version ?? "",
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/** 退出登录时调用：解绑本地 token（后端接口上线后再补 DELETE） */
export async function unregisterPushToken(): Promise<void> {
  const token = status.token ?? (await readStoredToken());
  setStatus({ token: null, registered: false });

  try {
    await persistToken(null);
  } catch {
    // ignore
  }

  if (!PUSH_REGISTRATION_ENABLED || !token) return;

  try {
    const [authToken, deviceId] = await Promise.all([
      getAuthToken(),
      getDeviceId(),
    ]);
    if (!authToken) return;

    await fetch(`${API_BASE_PATH}/user/push/devices/${deviceId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "device-id": deviceId,
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch {
    // 解绑失败不阻塞登出
  }
}

/** 处理用户点击通知：按 payload 里携带的定位字段跳到对应页面 */
export async function handleNotificationResponse(
  response: Notifications.NotificationResponse,
): Promise<void> {
  const data = (response.notification.request.content.data ?? {}) as Record<
    string,
    unknown
  >;

  try {
    navigateByNotificationData(data);
  } catch {
    router.push("/notification");
  }
}

function navigateByNotificationData(data: Record<string, unknown>): void {
  const targetType = asString(
    data.targetType ?? data.target_type,
  )?.toLowerCase();
  const targetId = asNumber(data.targetId ?? data.target_id);
  const articleId = asNumber(data.articleId ?? data.article_id);
  const commentId = asNumber(data.commentId ?? data.comment_id);

  // 评论详情依赖 articleId 定位主评论，优先级最高
  if (commentId) {
    router.push({
      pathname: "/comment/[id]",
      params: {
        id: String(commentId),
        articleId: articleId ? String(articleId) : undefined,
      },
    });
    return;
  }

  if (
    articleId ||
    targetType === "article" ||
    targetType === "post" ||
    targetType === "moment"
  ) {
    const id = articleId ?? targetId;
    if (id) {
      router.push({ pathname: "/article/[id]", params: { id: String(id) } });
      return;
    }
  }

  if ((targetType === "user" || targetType === "profile") && targetId) {
    router.push({ pathname: "/user/[id]", params: { id: String(targetId) } });
    return;
  }

  if (
    (targetType === "chat" ||
      targetType === "message" ||
      targetType === "private") &&
    targetId
  ) {
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: String(targetId),
        nickname: asString(data.senderName ?? data.nickname),
        avatar: asString(data.senderAvatar ?? data.avatar),
      },
    });
    return;
  }

  if (targetType === "topic" && targetId) {
    router.push({ pathname: "/topic/[id]", params: { id: String(targetId) } });
    return;
  }

  if (targetType === "system" || targetType === "broadcast") {
    router.push("/system-message");
    return;
  }

  router.push("/notification");
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function formatError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  return translate("pushSettingPage.errorUnknown");
}

/** 把常见的原生报错翻译成可执行的提示（十有八九是凭据没配） */
function describePushError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/firebase|google-services|FIS_AUTH/i.test(message)) {
    return translate("pushSettingPage.errorFcm");
  }
  if (/aps-environment|APNs|entitlement/i.test(message)) {
    return translate("pushSettingPage.errorApns");
  }
  return formatError(error);
}
