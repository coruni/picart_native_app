import type { ArticleControllerFindOne200ResponseData } from "@/api";
import type { ImageData } from "@/types/api";

/**
 * 文章详情 / 卡片共用的数据形状。
 *
 * 放在 types 层而不是页面文件里：卡片、查看器、底栏等组件都要用它，
 * 从 `@/app/article/[id]` 反向 import 会让「页面 → 组件 → 页面」形成循环依赖，
 * 也把页面整条依赖链（WebView / Swiper / 翻译）拖进卡片模块。
 */
export type ArticleData = Omit<
  ArticleControllerFindOne200ResponseData,
  "images"
> & {
  images: string[] | ImageData[];
};

/**
 * 把列表接口返回的条目转成卡片可用的数据。
 *
 * 列表/收藏接口的字段是详情数据的子集（缺 `collection`、`allowReprint`、
 * `isPinnedOnProfile` 等），而卡片只读取两者共有的展示字段。这是 API 类型
 * 定义不一致的边界，转换集中在这里，避免在 6 个列表页各写一遍 `as any`。
 */
export function toArticleCardData(row: object): ArticleData {
  return row as unknown as ArticleData;
}
