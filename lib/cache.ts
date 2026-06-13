import { Image } from "expo-image";
import { Directory, Paths } from "expo-file-system";

const MB = 1024 * 1024;

function sumDirectorySize(dir: Directory | null | undefined): number {
  if (!dir || !dir.exists) return 0;
  let total = 0;
  const stack: Directory[] = [dir];
  while (stack.length > 0) {
    const current = stack.pop()!;
    const info = current.info();
    total += info.size ?? 0;
    try {
      for (const child of current.list()) {
        if (child instanceof Directory) {
          stack.push(child);
        } else {
          total += child.info().size ?? 0;
        }
      }
    } catch {
      // 跳过无权限或无法遍历的子目录
    }
  }
  return total;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  if (bytes >= MB) {
    return `${(bytes / MB).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

export interface CacheSnapshot {
  bytes: number;
  display: string;
}

export async function measureCache(): Promise<CacheSnapshot> {
  const cacheBytes = sumDirectorySize(Paths.cache);
  return {
    bytes: cacheBytes,
    display: formatBytes(cacheBytes),
  };
}

export async function clearAppCache(): Promise<CacheSnapshot> {
  // 清空 expo-image 内存 + 磁盘缓存
  try {
    await Image.clearMemoryCache();
  } catch {
    // 忽略，expo-image 在 web 等环境下可能不可用
  }
  try {
    await Image.clearDiskCache();
  } catch {
    // 同上
  }

  // 清空应用沙盒内的缓存目录，但保留目录本身
  const cache = Paths.cache;
  if (cache?.exists) {
    try {
      for (const child of cache.list()) {
        try {
          child.delete();
        } catch {
          // 跳过无法删除的单个文件
        }
      }
    } catch {
      // 列表失败时尝试整体清空
      try {
        cache.delete();
        cache.create();
      } catch {
        // 最后兜底：忽略
      }
    }
  }

  return measureCache();
}

export const formatCacheBytes = formatBytes;
