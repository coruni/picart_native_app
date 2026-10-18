import avatarPlaceholder from "@/assets/images/placeholder/avatar_placeholder.webp";
import { useTheme } from "@/hooks/useTheme";
import { normalizeImageUrl } from "@/lib/image";
import { Image } from "expo-image";
import { memo, useMemo } from "react";
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
  const borderRadius = rounded ? size / 2 : 8;
  // source 对象必须稳定：每次渲染新建 { uri } 会让 expo-image 重新加载并闪烁
  // 地址统一走 normalizeImageUrl：后端历史数据里有 http:// 与根相对路径，
  // release 包禁止明文 HTTP，不归一化会整片加载失败
  const imageSource = useMemo(() => {
    const url = normalizeImageUrl(uri);
    return url ? { uri: url } : avatarPlaceholder;
  }, [uri]);
  const frameSource = useMemo(() => {
    const url = normalizeImageUrl(avatarFrameUri);
    return url ? { uri: url } : null;
  }, [avatarFrameUri]);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderWidth: border ? 1 : 0,
          borderColor: colors.border,
          borderRadius,
        },
      ]}
    >
      <Image
        source={imageSource}
        style={{ width: size, height: size, borderRadius }}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={0}
      />

      {frameSource && (
        <Image
          source={frameSource}
          style={{
            position: "absolute",
            width: size * 1.3 - 2.6,
            height: size * 1.3 - 2.6,
            borderRadius: size / 6,
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={0}
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
