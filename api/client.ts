import {
    create as createAxios,
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
    RawAxiosRequestConfig,
} from "axios";
import * as Application from "expo-application";
import { router } from "expo-router";
import { Platform } from "react-native";
import {
  clearAuth,
  ensureAuthHydrated,
  getAuthState,
  setToken,
} from "../store/authStore";
import { AppApi, DefaultApi } from "./generated/api";
import { Configuration } from "./generated/configuration";

// API 基础配置
export const API_BASE_PATH =
  process.env.EXPO_PUBLIC_API_URL || "https://localhost:3000";

// 获取存储的 token
export async function getAuthToken(): Promise<string | null> {
  const current = getAuthState();
  if (current.token || current.hasHydrated) return current.token;

  await ensureAuthHydrated();
  return getAuthState().token;
}

/** 获取稳定的设备 ID（Android 用 getAndroidId，iOS 用 identifierForVendor，降级为 installationId） */
async function getDeviceId(): Promise<string> {
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
  return Application.applicationId ?? "unknown";
}

// 缓存，避免每次请求都异步获取
let cachedDeviceId: string | null = null;
let authRedirectInFlight = false;
let refreshTokenPromise: Promise<string> | null = null;

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

async function resolveDeviceId(): Promise<string> {
  if (!cachedDeviceId) {
    cachedDeviceId = await getDeviceId();
  }
  return cachedDeviceId;
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
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "device-id": deviceId,
        "Device-Id": deviceId,
      },
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
    return nextToken;
  })().finally(() => {
    refreshTokenPromise = null;
  });

  return refreshTokenPromise;
}

// 创建 axios 实例
export function createAxiosInstance(): AxiosInstance {
  const instance = createAxios({
    baseURL: API_BASE_PATH,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const [token, deviceId] = await Promise.all([
        getAuthToken(),
        resolveDeviceId(),
      ]);
      if (config.headers) {
        config.headers["device-id"] = deviceId;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          delete config.headers.Authorization;
        }
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
              } catch {
                await redirectToLogin(error);
              }
            } else {
              await redirectToLogin(error);
            }
            break;
          case 403:
            await redirectToLogin(error);
            break;
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

// 预创建的 axios 实例 (单例)
let axiosInstance: AxiosInstance | null = null;

export function getAxiosInstance(): AxiosInstance {
  if (!axiosInstance) {
    axiosInstance = createAxiosInstance();
  }
  return axiosInstance;
}

// 重置 axios 实例 (用于 token 变更后)
export function resetAxiosInstance(): void {
  axiosInstance = null;
}

// 创建 OpenAPI 配置
export function createConfiguration(): Configuration {
  return new Configuration({
    basePath: API_BASE_PATH,
    accessToken: async () => {
      const token = await getAuthToken();
      return token || "";
    },
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
export function resetApiInstances(): void {
  defaultApiInstance = null;
  appApiInstance = null;
  resetAxiosInstance();
}

// 默认导出预配置的 DefaultApi
const api = getDefaultApi();
export default api;
