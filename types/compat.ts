import type {
  DtoArticleDto,
  DtoBrowseHistoryDto,
  DtoCommentDto,
  DtoDecorationActivityDto,
  DtoLoginResultDto,
  DtoUserDto,
  DtoUserProfileDto,
} from "@/api/generated";

// 后端 openapi 还没输出的字段先在这里占位，保证界面能编译、能按旧字段名取值。
// 补齐后直接删掉本文件的对应类型，用生成的 Dto。
// 清单见 docs/api-compat-handover.md。

/** 用户配置：现在单独走 /user/config，登录/资料接口还没带 */
export interface UserConfigView {
  watermark_enabled?: boolean;
  // 旧字段名，过渡期继续读
  watermarkEnabled?: boolean;
  hide_comments?: boolean;
  hide_favorites?: boolean;
  hide_tags?: boolean;
  hideComments?: boolean;
  hideFavorites?: boolean;
  hideTags?: boolean;
  [key: string]: unknown;
}

export interface EquippedDecorationView {
  image_url?: string;
  imageUrl?: string;
  bubble_color?: string;
  bubbleColor?: string;
  [key: string]: unknown;
}

export type EquippedDecorationsView = Record<
  string,
  EquippedDecorationView | undefined
>;

/** 登录结果 + 用户配置（config 后端还没返回） */
export type AuthUserView = DtoLoginResultDto & {
  config?: UserConfigView;
};

/** 用户资料 + 配置 / 已装扮 / 是否已关注（后端都还没返回） */
export type UserProfileView = DtoUserProfileDto & {
  config?: UserConfigView;
  equipped_decorations?: EquippedDecorationsView;
  equippedDecorations?: EquippedDecorationsView;
  is_followed?: boolean;
};

/** 用户列表项 + 是否已关注 */
export type UserView = DtoUserDto & {
  is_followed?: boolean;
};

/** 评论 + 关联文章 / 父评论（后端还没返回） */
export type CommentView = DtoCommentDto & {
  article?: Partial<DtoArticleDto> & { [key: string]: unknown };
  parent?: DtoCommentDto;
};

/** 装饰品简要（活动里内嵌用，后端只给 decoration_id） */
export interface DecorationBriefView {
  id?: string;
  name?: string;
  type?: string;
  image_url?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

/** 装饰活动 + 关联文章 / 装饰品（后端只给 article_id / decoration_id） */
export type ActivityView = DtoDecorationActivityDto & {
  article?: DtoArticleDto;
  decoration?: DecorationBriefView;
};

/** 浏览历史 + 主键与时间（后端只给 article_id / viewed_at） */
export type BrowseHistoryView = DtoBrowseHistoryDto & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
