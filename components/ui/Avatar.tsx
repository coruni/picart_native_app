import avatarPlaceholder from "@/assets/images/placeholder/avatar_placeholder.webp";
import AsyncImage from "@/components/ui/AsyncImage";
import { useTheme } from "@/hooks/useTheme";
import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
interface AvatarProps {
  uri?: string;
  size?: number;
  border?: boolean;
  avatarFrameUri?: string;
  rounded?: boolean;
}

export function Avatar({
  uri,
  size = 24,
  avatarFrameUri,
  rounded = true,
  border = false,
}: AvatarProps) {
  const { colors } = useTheme();

  const containerSize = useMemo(() => size, [size]);

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderWidth: border ? 1 : 0,
          borderColor: colors.border,
        },
        { borderRadius: rounded ? containerSize / 2 : 8 },
      ]}
    >
      <AsyncImage
        source={uri || avatarPlaceholder}
        placeholder={undefined}
        style={{
          width: size,
          height: size,
          borderRadius: rounded ? size / 2 : 8,
        }}
        contentFit="cover"
        showLoading={false}
      />

      {/* 定位头像框 */}
      {avatarFrameUri && (
        <AsyncImage
          source={{ uri: avatarFrameUri }}
          placeholder={undefined}
          style={{
            position: "absolute",
            width: size * 1.3 - 2.6,
            height: size * 1.3 - 2.6,
            borderRadius: size / 6,
          }}
          contentFit="cover"
          showLoading={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(Avatar);
