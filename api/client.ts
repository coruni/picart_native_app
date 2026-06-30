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
  (error as AuthRedirectedError).authRedirected = true;

  if (authRedirectInFlight) return;
  authRedirectInFlight = true;

  try {
    await clearAuth();
    resetApiInstances();
    router.replace("/auth");
  } finally {
    setTimeout(() => {
      authRedirectInFlight = false;
    }, 500);
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

      if (error.response) {
        switch (error.response.status) {
          case 401:
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
              } catch (refreshError) {
                // refreshToken 失效,清理并重定向到登录页
                // 注意:不要 reject error,避免触发 getAxiosInstance() 报错
                await redirectToLogin(error);
                // 返回一个永远不会被处理的 promise,防止继续执行
                return new Promise(() => {});
              }
            } else {
              await redirectToLogin(error);
              return new Promise(() => {});
            }
          case 403:
            await redirectToLogin(error);
            return new Promise(() => {});
        }
      }
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
  updateAxiosAuthorization(state.token);
});

function createApiProxy<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const instance = factory();
      const value = Reflect.get(instance, prop, instance);
      return typeof value === "function" ? value.bind(instance) : value;
    },
  });
}

// 默认导出预配置的 DefaultApi
const api = createApiProxy<DefaultApi>(getDefaultApi);
export default api;
