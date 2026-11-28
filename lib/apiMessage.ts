import i18n from "@/locales/i18n";

/** 语言包里后端文案都挂在 api 下，避免和界面自己的 key 撞名 */
const PREFIX = "api.";
const PLACEHOLDER = /%\.1f|%s|%d/g;

type Values = readonly (string | number)[];

/** 占位符没值可填就抹掉，顺带收拾留下的重复空格和悬空冒号 */
function tidy(text: string): string {
  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([：:，,。.、])/g, "$1")
    .replace(/[：:\s]+$/, "");
}

function fill(text: string, values: Values): string {
  let index = 0;
  const filled = text.replace(PLACEHOLDER, () => {
    const value = values[index++];
    // 拿不到实参就别留着 %s，用户看不懂
    return value === undefined ? "" : String(value);
  });
  return index > values.length ? tidy(filled) : filled;
}

/**
 * 后端 message 现在直接回 key（如 `auth.need_login`），这里翻成当前语言。
 * 传实参按顺序填 `%s` / `%d` / `%.1f`；没传就把占位符抹掉。
 * 查不到 key 说明是老接口回的中文原文，原样返回。
 */
export function translateApiMessage(
  raw: string | string[] | null | undefined,
  values: Values = [],
): string {
  const first = Array.isArray(raw)
    ? raw.find((item) => typeof item === "string" && item.trim())
    : raw;
  if (typeof first !== "string" || !first.trim()) return "";

  const key = first.trim();
  if (!i18n.exists(PREFIX + key)) return key;

  return fill(i18n.t(PREFIX + key), values);
}

/** 从 axios 错误里取后端说明；没有就回退到本地文案 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const data = (
    error as { response?: { data?: { message?: string | string[] } } } | null
  )?.response?.data;
  return translateApiMessage(data?.message) || fallback;
}
