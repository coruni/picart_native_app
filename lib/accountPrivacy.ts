import type { DtoUserConfigDto } from "@/api";

/** 账号隐私可控的板块，与 picart_next 的 account-privacy 对齐 */
export type AccountPrivacySection =
  | "comments"
  | "favorites"
  | "followers"
  | "followings"
  | "tags";

/** 隐私 config（数据来自 DtoUserConfigDto 的 hide_* 字段） */
type PrivacyConfig = Partial<
  Pick<
    DtoUserConfigDto,
    | "hide_comments"
    | "hide_favorites"
    | "hide_followers"
    | "hide_followings"
    | "hide_tags"
  >
>;

const PRIVACY_FIELD_MAP: Record<
  AccountPrivacySection,
  keyof PrivacyConfig
> = {
  comments: "hide_comments",
  favorites: "hide_favorites",
  followers: "hide_followers",
  followings: "hide_followings",
  tags: "hide_tags",
};

/** 判断 userId 是否为当前查看者本人 */
export function isAccountOwner(
  userId: string | number | null | undefined,
  viewerId: string | number | null | undefined,
): boolean {
  if (userId == null || viewerId == null) return false;
  return String(userId) === String(viewerId);
}

// 否则取决于该账号的隐私 config。
export function isAccountSectionHidden(
  user: { id?: string | number | null; config?: PrivacyConfig | null },
  section: AccountPrivacySection,
  viewerId?: string | number | null,
): boolean {
  if (isAccountOwner(user.id, viewerId)) return false;
  return Boolean(user.config?.[PRIVACY_FIELD_MAP[section]]);
}
