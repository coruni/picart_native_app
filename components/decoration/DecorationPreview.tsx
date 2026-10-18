import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

/**
 * 装饰品真实预览：按类型渲染它在 App 里真正会呈现的样子
 * （套框头像 / 上色气泡 / 徽章图），而不是直接铺一张方形贴图。
 *
 * 预览区自身**不带底色**——网格项没有卡片底，视觉分隔由 hairline 负责；
 * 若这里再给一层 `secondaryBackground`，会凭空造出第二层容器。
 */
export interface DecorationPreviewProps {
  type: string;
  /** AVATAR_FRAME / ACHIEVEMENT_BADGE 的图片；COMMENT_BUBBLE 不用 */
  imageUrl?: string | null;
  /** COMMENT_BUBBLE 的填充色 */
  bubbleColor?: string | null;
  /** 头像地址，头像框预览时套在里面 */
  avatarUri?: string | null;
  /** 预览区边长 */
  size?: number;
  /** 未解锁时降低不透明度 */
  dimmed?: boolean;
}

function DecorationPreview({
  type,
  imageUrl,
  bubbleColor,
  avatarUri,
  size = 64,
  dimmed = false,
}: DecorationPreviewProps) {
  const { theme } = useTheme();

  const body = (() => {
    switch (type.toUpperCase()) {
      case "AVATAR_FRAME": {
        const avatarSize = size * 0.7;
        return (
          <View
            style={{
              width: size,
              height: size,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={avatarUri ? { uri: avatarUri } : undefined}
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: theme.muted,
              }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={0}
            />
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ position: "absolute", width: size, height: size }}
                contentFit="contain"
                cachePolicy="memory-disk"
                transition={0}
              />
            ) : null}
          </View>
        );
      }

      case "COMMENT_BUBBLE": {
        // 还原一条真实评论：左侧圆形头像 + 右侧气泡
        const bubbleH = size * 0.4;
        return (
          <View style={{ width: size, gap: size * 0.14 }}>
            <View
              style={{
                width: size * 0.26,
                height: size * 0.26,
                borderRadius: 999,
                backgroundColor: theme.muted,
              }}
            />
            <View
              style={{
                width: size * 0.72,
                height: bubbleH,
                borderRadius: bubbleH / 2,
                backgroundColor: bubbleColor || theme.muted,
              }}
            />
          </View>
        );
      }

      case "ACHIEVEMENT_BADGE":
        return imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: size * 0.8, height: size * 0.8 }}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={0}
          />
        ) : (
          <View
            style={{
              width: size * 0.56,
              height: size * 0.56,
              borderRadius: 999,
              backgroundColor: theme.muted,
            }}
          />
        );

      default:
        return (
          <View
            style={{
              width: size * 0.56,
              height: size * 0.56,
              borderRadius: 12,
              backgroundColor: theme.muted,
            }}
          />
        );
    }
  })();

  return <View style={[styles.stage, dimmed && styles.dimmed]}>{body}</View>;
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "center",
  },
  dimmed: {
    opacity: 0.32,
  },
});

export default memo(DecorationPreview);