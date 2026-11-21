import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  create as createAxios,
  InternalAxiosRequestConfig,
  RawAxiosRequestConfig,
} from "axios";
import * as Application from "expo-application";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import {
  clearAuth,
  ensureAuthHydrated,
  getAuthState,
  setToken,
  useAuthStore,
} from "../store/authStore";
import { isAuthRoute } from "../lib/routeState";
import { AppApi, DefaultApi } from "./generated/api";
import { Configuration } from "./generated/configuration";

// API 基础配置
export const API_BASE_PATH =
  process.env.EXPO_PUBLIC_API_URL || "https://localhost:3000";

const DEVICE_ID_STORAGE_KEY = "api.deviceId";

// 获取存储的 token
export async function getAuthToken(): Promise<string | null> {
  const current = getAuthState();
  if (current.token || current.hasHydrated) return current.token;

  await ensureAuthHydrated();
  return getAuthState().token;
}

/** 获取稳定的设备 ID（Android 用 getAndroidId，iOS 用 identifierForVendor，降级为随机 UUID） */
async function getGeneratedDeviceId(): Promise<string> {
  try {
    if (Platform.OS === "android") {
      const id = Application.getAndroidId();
      if (id) return id;
    } else if (Platform.OS === "ios") {
      const id = await Application.getIosIdForVendorAsync();
      if (id) return id;
    }
  } catch {
    // ignore
  }

  try {
    return Crypto.randomUUID();
  } catch {
    return `${Application.applicationId ?? "device"}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}

// 缓存，避免每次请求都异步获取
let cachedDeviceId: string | null = null;
let deviceIdPromise: Promise<string> | null = null;
let authRedirectInFlight = false;
let refreshTokenPromise: Promise<string> | null = null;
let axiosInitializationPromise: Promise<AxiosInstance> | null = null;

type ClientContext = {
  token: string | null;
  deviceId: string;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
};

export type AuthRedirectedError = AxiosError & {
  authRedirected?: boolean;
};

export function isAuthRedirectedError(error: unknown): boolean {
  return !!(
    error &&
    typeof error === "object" &&
    "authRedirected" in error &&
    (error as AuthRedirectedError).authRedirected
  );
}

async function readPersistedDeviceId(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(DEVICE_ID_STORAGE_KEY);
  } catch {
    return null;
  }
}

async function persistDeviceId(deviceId: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(DEVICE_ID_STORAGE_KEY, deviceId);
  } catch {
    // ignore persist failures and keep in-memory fallback
  }
}

async function resolveDeviceId(): Promise<string> {
  if (cachedDeviceId) {
    return cachedDeviceId;
  }

  if (!deviceIdPromise) {
    deviceIdPromise = (async () => {
      const storedDeviceId = await readPersistedDeviceId();
      if (storedDeviceId) {
        cachedDeviceId = storedDeviceId;
        return storedDeviceId;
      }

      const nextDeviceId = await getGeneratedDeviceId();
      cachedDeviceId = nextDeviceId;
      await persistDeviceId(nextDeviceId);
      return nextDeviceId;
    })().finally(() => {
      deviceIdPromise = null;
    });
  }

  return deviceIdPromise;
}

/** 需要显式传 deviceId 的接口（如登出）复用它，保证与请求头同源 */
export async function getDeviceId(): Promise<string> {
  return resolveDeviceId();
}

function buildDefaultHeaders({ token, deviceId }: ClientContext) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "device-id": deviceId,
    "Device-Id": deviceId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function resolveClientContext(): Promise<ClientContext> {
  await ensureAuthHydrated();

  const [token, deviceId] = await Promise.all([
    getAuthToken(),
    resolveDeviceId(),
  ]);

  return { token, deviceId };
}

function updateAxiosAuthorization(token: string | null): void {
  if (!axiosInstance) return;

  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete axiosInstance.defaults.headers.common.Authorization;
}

async function redirectToLogin(error: AxiosError): Promise<void> {
  // 无论是否真的执行跳转，都要打上标记：调用方靠它跳过 toast，
  // 并且据此刻意回滚乐观更新（见 lib/authGate.ts 的说明）。
  (error as AuthRedirectedError).authRedirected = true;

  if (authRedirectInFlight) return;
  authRedirectInFlight = true;

  try {
    await clearAuth();
    resetApiInstances();
    // 已经在登录页就不再 replace：重复 replace 会把用户正在输入的
    // 登录表单整页重挂，也会让「登录页 ↔ 首页」互相触发形成循环。
    if (!isAuthRoute()) {
      router.replace("/auth");
    }
  } finally {
    // 只挡住同一批并发 401 的重复跳转，不长期占用
    setTimeout(() => {
      authRedirectInFlight = false;
    }, 1000);
  }
}

function isRefreshTokenRequest(config?: RawAxiosRequestConfig): boolean {
  return !!config?.url?.includes("/user/refresh-token");
}

async function refreshAccessToken(): Promise<string> {
  if (refreshTokenPromise) return refreshTokenPromise;

  refreshTokenPromise = (async () => {
    await ensureAuthHydrated();

    const { refreshToken } = getAuthState();
    if (!refreshToken) {
      throw new Error("Missing refresh token");
    }

    const deviceId = await resolveDeviceId();
    const refreshAxios = createAxios({
      baseURL: API_BASE_PATH,
      timeout: 30000,
      headers: buildDefaultHeaders({ token: null, deviceId }),
    });
    const refreshApi = new DefaultApi(
      new Configuration({ basePath: API_BASE_PATH }),
      API_BASE_PATH,
      refreshAxios,
    );
    const response = await refreshApi.userControllerRefreshToken(
      deviceId,
      { refreshToken },
      undefined,
      deviceId,
    );

    const nextToken = response.data?.data?.token;
    if (!nextToken) {
      throw new Error("Refresh token response missing token");
    }

    await setToken(nextToken);
    updateAxiosAuthorization(nextToken);
    return nextToken;
  })()
    .catch((error) => {
      // refreshToken 失效或其他错误,清理状态
      // 注意:这里不调用 resetApiInstances(),由响应拦截器统一处理
      throw error;
    })
    .finally(() => {
      refreshTokenPromise = null;
    });

  return refreshTokenPromise;
}

// 创建 axios 实例
export function createAxiosInstance(context: ClientContext): AxiosInstance {
  const instance = createAxios({
    baseURL: API_BASE_PATH,
    timeout: 30000,
    headers: buildDefaultHeaders(context),
  });

  // 请求拦截器只处理 multipart 头，不再异步注入 token/deviceId
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config.headers) {
        Object.entries(config.headers).forEach(([key, value]) => {
          if (value === null) {
            delete config.headers[key];
          }
        });
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
          delete config.headers["content-type"];
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalConfig = error.config as RetriableRequestConfig | undefined;
      const status = error.response?.status;

      /*
       * 401 只在「本来就带着 token 的请求」上才意味着会话失效。
       *
       * 没带 Authorization 的请求（登录、注册、找回密码、访客浏览）拿到 401
       * 只代表这个动作需要登录，必须原样 reject 交给调用方：
       *   - 登录接口密码错也是 401，不能在这里 clearAuth + 跳登录页，
       *     否则表单既不报错也永远在转圈；
       *   - 访客点赞也是 401，如果先把本地状态翻成"已赞"，再卡在一个
       *     永不 settle 的 Promise 上，就会留下错误的本地点赞状态。
       */
      if (status === 401 && originalConfig?.headers?.Authorization) {
        if (
          originalConfig &&
          !originalConfig._authRetry &&
          !isRefreshTokenRequest(originalConfig)
        ) {
          try {
            originalConfig._authRetry = true;
            const nextToken = await refreshAccessToken();
            originalConfig.headers.Authorization = `Bearer ${nextToken}`;
            return instance.request(originalConfig);
          } catch {
            // refreshToken 也失效了，清理会话并回登录页
            await redirectToLogin(error);
            return Promise.reject(error);
          }
        }

        // 刷新后仍然是 401（或本就是刷新请求）：会话确实失效
        await redirectToLogin(error);
        return Promise.reject(error);
      }

      // 403 是「没有权限」，不是「没登录」。贸然清会话会让人莫名其妙掉登录，
      // 而且被禁用的账号每次请求都 403 时会和登录页来回弹。
      return Promise.reject(error);
    },
  );

  return instance;
}

export async function initializeApiClient(): Promise<AxiosInstance> {
  if (axiosInstance) {
    return axiosInstance;
  }

  if (!axiosInitializationPromise) {
    axiosInitializationPromise = (async () => {
      const context = await resolveClientContext();
      const instance = createAxiosInstance(context);
      axiosInstance = instance;
      return instance;
    })().finally(() => {
      axiosInitializationPromise = null;
    });
  }

  return axiosInitializationPromise;
}

// 预创建的 axios 实例 (单例)
let axiosInstance: AxiosInstance | null = null;

export function getAxiosInstance(): AxiosInstance {
  if (!axiosInstance) {
    throw new Error(
      "API client has not been initialized. Call initializeApiClient() before using getAxiosInstance().",
    );
  }
  return axiosInstance;
}

// 重置 axios 实例 (用于 token 变更后)
export function resetAxiosInstance(): void {
  axiosInstance = null;
  axiosInitializationPromise = null;
}

// 创建 OpenAPI 配置
export function createConfiguration(): Configuration {
  return new Configuration({
    basePath: API_BASE_PATH,
  });
}

// 预配置的 API 实例 (单例)
let defaultApiInstance: DefaultApi | null = null;
let appApiInstance: AppApi | null = null;

// 获取预配置的 DefaultApi 实例
export function getDefaultApi(): DefaultApi {
  if (!defaultApiInstance) {
    const configuration = createConfiguration();
    const axios = getAxiosInstance();
    defaultApiInstance = new DefaultApi(configuration, API_BASE_PATH, axios);
  }
  return defaultApiInstance;
}

// 获取预配置的 AppApi 实例
export function getAppApi(): AppApi {
  if (!appApiInstance) {
    const configuration = createConfiguration();
    const axios = getAxiosInstance();
    appApiInstance = new AppApi(configuration, API_BASE_PATH, axios);
  }
  return appApiInstance;
}

// 重置所有 API 实例 (用于 token 变更或退出登录后)
// 注意：不重置 axiosInstance 本身——它无状态可复用，仅 Authorization
// 头需要随 token 变化。直接清空会导致已挂载（含 offscreen 复用）的组件
// 在下一次 useEffect 时撞上 "API client has not been initialized" 错误。
export function resetApiInstances(): void {
  defaultApiInstance = null;
  appApiInstance = null;
  updateAxiosAuthorization(null);
}

useAuthStore.subscribe((state, previousState) => {
  if (state.token === previousState.token) return;
  // 重新登录后解除「正在跳登录页」的锁，下一次 401 该跳还得跳
  if (state.token) authRedirectInFlight = false;
  updateAxiosAuthorization(state.token);
});

function createApiProxy<T extends object>(factory: () => T): T {
  // React Refresh (isReactClass), Promise detection, JSON.stringify and
  // console inspection all probe well-known property names on exported
  // values. After a hot reload, axiosInstance is null again until the
  // RootLayout effect re-runs — so letting those probes invoke factory()
  // throws "API client has not been initialized" before any real call.
  return new Proxy({} as T, {
    get(_target, prop) {
      if (typeof prop === "symbol") return undefined;
      if (
        prop === "prototype" ||
        prop === "$$typeof" ||
        prop === "__esModule" ||
        prop === "then" ||
        prop === "toJSON"
      ) {
        return undefined;
      }
      const instance = factory();
      const value = Reflect.get(instance, prop, instance);
      return typeof value === "function" ? value.bind(instance) : value;
    },
  });
}

// 默认导出预配置的 DefaultApi
const api = createApiProxy<DefaultApi>(getDefaultApi);
export default api;
