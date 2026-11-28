import { privacyEn, termsEn } from "@/locales/legal/en";
import { privacyZh, termsZh } from "@/locales/legal/zh";

export type LegalType = "privacy" | "terms";

/** 政策改版时递增：已同意过旧版本的用户会重新看到同意弹窗 */
export const LEGAL_VERSION = "2";
export const LEGAL_UPDATED_AT = "2026-11-28";

/** 运营主体，上架前换成真实信息；服务端 config 有值时以 config 为准 */
export const LEGAL_OPERATOR = {
  company: "【运营主体全称】",
  email: "【联系邮箱】",
  appName: "CeryLab",
};

type Vars = {
  company: string;
  email: string;
  appName: string;
  updatedAt: string;
  version: string;
};

function fill(text: string, vars: Vars): string {
  return text.replace(
    /\{\{(\w+)\}\}/g,
    (_match, key: string) => vars[key as keyof Vars] ?? "",
  );
}

/** 本地兜底正文：服务端没配协议时用，保证审核期不白屏 */
export function getLocalAgreement(
  type: LegalType,
  lang: "zh" | "en",
  overrides: Partial<Pick<Vars, "company" | "email" | "appName">> = {},
): string {
  const source =
    lang === "en"
      ? type === "privacy"
        ? privacyEn
        : termsEn
      : type === "privacy"
        ? privacyZh
        : termsZh;

  return fill(source, {
    ...LEGAL_OPERATOR,
    ...overrides,
    updatedAt: LEGAL_UPDATED_AT,
    version: LEGAL_VERSION,
  });
}
