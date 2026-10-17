import creatorBadge from "@/assets/images/verify/creator.webp";
import officialBadge from "@/assets/images/verify/official.webp";
import { Image } from "expo-image";
import { memo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

export type CertificationLike = { type?: string | null } | null | undefined;

interface CertificationBadgeProps {
  certification?: CertificationLike;
  size?: number;
  /** 无认证时是否保留等宽占位，用于避免行内抖动 */
  placeholder?: boolean;
}

const BADGE_SOURCES: Record<string, number> = {
  OFFICIAL: officialBadge as number,
  CREATOR: creatorBadge as number,
};

function CertificationBadge({
  certification,
  size = 16,
  placeholder = false,
}: CertificationBadgeProps) {
  const { t } = useTranslation();

  const type = certification?.type?.toUpperCase();
  const source = type ? BADGE_SOURCES[type] : undefined;

  if (!source) {
    return placeholder ? <View style={{ width: size, height: size }} /> : null;
  }

  const isCreator = type === "CREATOR";

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={
        isCreator
          ? t("accountSettingPage.verifyCreator")
          : t("accountSettingPage.verifyOfficial")
      }
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={source}
        style={{ width: size, height: size }}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={0}
      />
    </View>
  );
}

export default memo(CertificationBadge);
