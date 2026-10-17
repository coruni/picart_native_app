/** 只比较 major.minor.patch 数字段，忽略 `v` 前缀与非数字后缀 */
function parseVersionParts(version?: string): number[] {
  const cleaned = (version ?? "").trim().replace(/^v/i, "");
  return cleaned.split(".").map((part) => {
    const match = part.match(/^\d+/);
    return match ? Number(match[0]) : 0;
  });
}

/** latest 是否比 current 更新；latest 无效时返回 false */
export function isVersionNewer(latest?: string, current?: string): boolean {
  const latestParts = parseVersionParts(latest);
  const currentParts = parseVersionParts(current);
  if (!latestParts.some((n) => n > 0)) return false;

  const length = Math.max(latestParts.length, currentParts.length);
  for (let i = 0; i < length; i += 1) {
    const a = latestParts[i] ?? 0;
    const b = currentParts[i] ?? 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
}
