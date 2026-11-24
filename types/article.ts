import type { ArticleControllerFindOne200ResponseData } from "@/api";
import type { ImageData } from "@/types/api";

// 文章详情 / 卡片共用的数据形状。
export type ArticleData = Omit<
  ArticleControllerFindOne200ResponseData,
  "images"
> & {
  images: string[] | ImageData[];
};

// 把列表接口返回的条目转成卡片可用的数据。
export function toArticleCardData(row: object): ArticleData {
  return row as unknown as ArticleData;
}
