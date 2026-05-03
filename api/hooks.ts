import { useMemo, useCallback } from 'react';
import { Configuration } from './generated/configuration';
import { AxiosInstance } from 'axios';
import { getAxiosInstance, API_BASE_PATH } from './client';

// 通用的 API 服务类型
type ApiClass<T> = new (configuration: Configuration, basePath: string, axios: AxiosInstance) => T;

// 创建 API 服务的 Hook
export function useApiService<T>(ApiClass: ApiClass<T>): T {
  return useMemo(() => {
    const axiosInstance = getAxiosInstance();
    const configuration = new Configuration({
      basePath: API_BASE_PATH,
    });
    return new ApiClass(configuration, API_BASE_PATH, axiosInstance);
  }, [ApiClass]);
}

// API 请求状态
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// 通用的 API 请求方法 (用于类组件或需要更多控制的场景)
export async function apiRequest<T>(
  requestFn: () => Promise<T>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await requestFn();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

// 上传文件专用方法 (支持 multipart/form-data)
export async function uploadFile(
  url: string,
  file: File | { uri: string; name: string; type: string },
  onProgress?: (progress: number) => void
): Promise<{ data: any; error: Error | null }> {
  try {
    const axiosInstance = getAxiosInstance();

    const formData = new FormData();
    // 处理 React Native 文件对象
    formData.append('file', file as any);

    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = progressEvent.loaded / progressEvent.total;
          onProgress(progress);
        }
      },
    });

    return { data: response.data, error: null };
  } catch (error) {
    console.error('文件上传失败:', error);
    return { data: null, error: error as Error };
  }
}
