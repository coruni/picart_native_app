import avatarPlaceholder from "@/assets/images/placeholder/avatar_placeholder.webp";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import React, { useMemo } from "react";
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
  const { colors, theme } = useTheme();

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
      ]}
    >
      <Image
        source={uri || avatarPlaceholder}
        style={{
          width: size,
          height: size,
          borderRadius: rounded ? size / 2 : 8,
        }}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
      />

      {/* 定位头像框 */}
      {avatarFrameUri && (
        <Image
          source={{ uri: avatarFrameUri }}
          style={{
            position: "absolute",
            width: size * 1.3 - 2.6,
            height: size * 1.3 - 2.6,
            borderRadius: size / 6,
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
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

export default Avatar;
