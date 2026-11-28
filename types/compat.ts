import type {
  DtoArticleDto,
  DtoBrowseHistoryDto,
  DtoCommentDto,
  DtoDecorationActivityDto,
  DtoEquippedDecorationDto,
  DtoUserDto,
  DtoUserProfileDto,
} from "@/api/generated";

// 后端 openapi 还没输出的字段先在这里占位，保证界面能编译、能按 snake_case 取值。
// 补齐后直接删掉本文件的对应类型，用生成的 Dto。
// 清单见 docs/api-compat-handover.md。

/** 用户资料 + 已装扮 / 是否已关注（后端还没返回） */
export type UserProfileView = DtoUserProfileDto & {
  equipped_decorations?: Record<string, DtoEquippedDecorationDto>;
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
  [key: string]: unknown;
}

/** 装饰活动 + 关联文章 / 装饰品（后端只给 article_id / decoration_id） */
export type ActivityView = DtoDecorationActivityDto & {
  article?: DtoArticleDto;
  decoration?: DecorationBriefView;
};

/** 浏览历史 + 主键（后端只给 article_id / viewed_at） */
export type BrowseHistoryView = DtoBrowseHistoryDto & {
  id?: string;
};
