import type { UserControllerFindAll200ResponseDataDataInnerConfig } from "@/api";

/** 账号隐私可控的板块，与 picart_next 的 account-privacy 对齐 */
export type AccountPrivacySection =
  | "comments"
  | "favorites"
  | "followers"
  | "followings"
  | "tags";

/** 用户详情接口返回的隐私 config（含 hideFollowers / hideFollowings 等全量字段） */
type PrivacyConfig = Partial<UserControllerFindAll200ResponseDataDataInnerConfig>;

const PRIVACY_FIELD_MAP: Record<
  AccountPrivacySection,
  keyof UserControllerFindAll200ResponseDataDataInnerConfig
> = {
  comments: "hideComments",
  favorites: "hideFavorites",
  followers: "hideFollowers",
  followings: "hideFollowings",
  tags: "hideTags",
};

/** 判断 userId 是否为当前查看者本人 */
export function isAccountOwner(
  userId: string | number | null | undefined,
  viewerId: string | number | null | undefined,
): boolean {
  if (userId == null || viewerId == null) return false;
  return String(userId) === String(viewerId);
}

/**
 * 判断某账号的指定板块对当前查看者是否隐藏。
 * 本人查看自己时永远可见；否则取决于该账号的隐私 config。
 */
export function isAccountSectionHidden(
  user: { id?: string | number | null; config?: PrivacyConfig | null },
  section: AccountPrivacySection,
  viewerId?: string | number | null,
): boolean {
  if (isAccountOwner(user.id, viewerId)) return false;
  return Boolean(user.config?.[PRIVACY_FIELD_MAP[section]]);
}
