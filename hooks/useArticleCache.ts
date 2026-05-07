import { ArticleData } from "@/app/article/[id]";

export class ArticleCache {
  private static cache = new Map<
    string,
    { data: ArticleData; timestamp: number }
  >();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static get(id: string): ArticleData | undefined {
    const entry = this.cache.get(id);
    if (!entry) return undefined;
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(id);
      return undefined;
    }
    return entry.data;
  }

  static set(id: string, data: ArticleData): void {
    this.cache.set(id, { data, timestamp: Date.now() });
  }

  static has(id: string): boolean {
    const entry = this.cache.get(id);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(id);
      return false;
    }
    return true;
  }

  static clear(): void {
    this.cache.clear();
  }
}
