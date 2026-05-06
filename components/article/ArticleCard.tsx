import { ArticleControllerFindAll200Response } from "@/api";
import AsyncImage from "@/components/ui/AsyncImage";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import ThemedIcon from "@/components/ui/ThemedIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useRouterLock } from "@/hooks/useRouterLock";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { formatRelativeTime } from "@/lib/time";
import { ImageData } from "@/types/api";
import { useRouter } from "expo-router";
import {
  Ban,
  Ellipsis,
  EllipsisVertical,
  Eye,
  FileImage,
  Flag,
  HeartCrack,
  ImageIcon,
  Link2,
  MessageCircleMore,
  Play,
  ThumbsUp,
  UserRoundMinus,
  UserRoundPlus,
} from "lucide-react-native";
import React, { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

type MenuItem = {
  label: string;
  key: string;
  icon: React.ReactNode;
  onPress: () => void;
};

type ArticleCardProps = {
  data: Omit<
    ArticleControllerFindAll200Response["data"]["data"][number],
    "images"
  > & {
    images: ImageData[] | string[];
  };
};

function ArticleCard({ data }: ArticleCardProps) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { theme } = useTheme();
  const lockRouter = useRouterLock();
  const router = useRouter();
  const handleArticleClick = useCallback(() => {
    if (!data?.id) return;
    lockRouter(() => {
      router.push({
        pathname: "/article/[id]",
        params: {
          id: data.id,
          author: JSON.stringify(data.author),
        },
      });
    });
  }, [data, lockRouter, router]);

  const handleMoreClick = useCallback(() => {
    setShowModal(true);
  }, []);

  const renderCover = useCallback(() => {
    return (
      <View style={styles.coverContainer}>
        <AsyncImage
          source={data?.cover}
          contentFit="cover"
          style={styles.coverImage}
        />

        {/* 视频标识 */}
        {data?.type === "video" && (
          <View style={styles.videoBadge}>
            <Play color="white" />
          </View>
        )}
        {/* 封面标识 */}
        {data?.cover && data?.type !== "video" && (
          <View style={styles.coverBadge}>
            <FileImage color="white" size={10} />
          </View>
        )}
      </View>
    );
  }, [data?.type, data?.cover]);

  const renderMedia = () => {
    if (data?.images.length === 1) {
      const image = data?.images[0] as ImageData;
      const aspectRatio =
        image?.width && image?.height ? image.width / image.height : 16 / 9;
      return (
        <AsyncImage
          source={getImageUrl(image, "large")}
          contentFit="cover"
          style={[
            styles.singleImage,
            { aspectRatio, borderColor: theme.border },
          ]}
        />
      );
    }
    if (data?.images.length === 2) {
      return (
        <View style={styles.imageGrid}>
          <AsyncImage
            source={getImageUrl(data?.images[0], "large")}
            contentFit="cover"
            style={[styles.gridImageLeft, { borderColor: theme.border }]}
          />
          <AsyncImage
            source={getImageUrl(data?.images[1], "large")}
            contentFit="cover"
            style={[styles.gridImageRight, { borderColor: theme.border }]}
          />
        </View>
      );
    }
    if (data?.images.length >= 3) {
      return (
        <View style={styles.imageGrid3}>
          <AsyncImage
            source={getImageUrl(data?.images[0], "large")}
            contentFit="cover"
            style={[styles.grid3ImageLeft, { borderColor: theme.border }]}
          />
          <AsyncImage
            source={getImageUrl(data?.images[1], "large")}
            contentFit="cover"
            style={[styles.grid3ImageMiddle, { borderColor: theme.border }]}
          />
          <View style={[styles.grid3ImageRight, { borderColor: theme.border }]}>
            <AsyncImage
              source={getImageUrl(data?.images[2], "large")}
              contentFit="cover"
              style={[styles.grid3ImageRight, { borderColor: theme.border }]}
            />
            <View style={[styles.coverBadge, { gap: 4 }]}>
              <ImageIcon color="white" size={10} />
              <ThemedText color="white" size={12}>
                +{data?.imageCount - 3}
              </ThemedText>
            </View>
          </View>
        </View>
      );
    }
  };

  const getMenuActions = useCallback((): MenuItem[] => {
    return [
      {
        label: t("article.dislike"),
        key: "dislike",
        onPress: () => {},
        icon: <HeartCrack size={18} />,
      },
      {
        label: t("article.report"),
        onPress: () => {},
        key: "report",
        icon: <Flag size={18} />,
      },

      {
        label: t("article.blockUser"),
        onPress: () => {},
        key: "block",
        icon: <Ban size={18} />,
      },
      {
        label: t("article.copyLink"),
        onPress: () => {},
        key: "copy",
        icon: <Link2 size={18} />,
      },
      data?.author?.isFollowed
        ? {
            label: t("article.unfollow"),
            onPress: () => {},
            key: "follow",
            icon: <UserRoundMinus size={18} />,
          }
        : {
            label: t("article.follow"),
            onPress: () => {},
            key: "follow",
            icon: <UserRoundPlus size={18} />,
          },
      {
        label: t("article.shareViaSystem"),
        onPress: () => {},
        key: "share",
        icon: <Ellipsis size={18} />,
      },
    ];
  }, [t]);

  const totalReactions = Object.keys(data?.reactionStats || {}).reduce(
    (acc, key) => {
      const value = data.reactionStats[key as keyof typeof data.reactionStats];
      return acc + (value || 0);
    },
    0,
  );

  return (
    <>
      <Pressable onPress={handleArticleClick} style={styles.container}>
        {/* 头部 */}
        <View style={styles.header}>
          <Avatar
            uri={data.author.avatar}
            size={40}
            avatarFrameUri={
              data?.author?.equippedDecorations?.AVATAR_FRAME?.imageUrl
            }
          />
          <View style={styles.headerInfo}>
            <View style={styles.headerInfoUser}>
              <ThemedText variant="body" fontWeight="500">
                {data?.author?.nickname || data?.author?.username}
              </ThemedText>
              {data?.author?.equippedDecorations?.ACHIEVEMENT_BADGE
                ?.imageUrl && (
                <AsyncImage
                  source={
                    data?.author?.equippedDecorations?.ACHIEVEMENT_BADGE
                      ?.imageUrl
                  }
                  style={styles.badge}
                />
              )}
            </View>
            <ThemedText variant="caption" size={10}>
              {formatRelativeTime(data?.createdAt, t)} • {data?.category?.name}
            </ThemedText>
          </View>
          <View style={styles.headerMenu}>
            <Pressable onPress={handleMoreClick} hitSlop={10}>
              <ThemedIcon icon={EllipsisVertical} variant="muted" size={20} />
            </Pressable>
          </View>
        </View>

        {/* 内容 */}
        <View style={styles.content}>
          <ThemedText variant="body" fontWeight="500" style={styles.title}>
            {data?.title}
          </ThemedText>

          {data?.type === "image" && data?.images?.length > 0
            ? renderMedia()
            : data?.cover
              ? renderCover()
              : renderMedia()}
        </View>

        {/* 底部 */}
        <View style={[styles.footer, { borderColor: theme.border }]}>
          <View style={styles.footerInner}>
            <View style={styles.statsItem}>
              <ThemedIcon icon={Eye} variant="muted" size={18} />
              <ThemedText variant="caption">{data?.views}</ThemedText>
            </View>

            <View style={styles.footerRight}>
              {totalReactions > 0 && (
                <View style={styles.reactionGroup}>{/* reactions */}</View>
              )}

              {/* 有 reactions 时绝对居中，没有时普通流 */}
              <View
                style={[
                  styles.statsItem,
                  totalReactions > 0 && styles.statsItemAbsCenter,
                ]}
              >
                <ThemedIcon
                  icon={MessageCircleMore}
                  variant="default"
                  size={18}
                />
                <ThemedText size={12}>{data?.commentCount}</ThemedText>
              </View>

              <View style={styles.statsItem}>
                <ThemedIcon icon={ThumbsUp} variant="default" size={18} />
                <ThemedText size={12}>{data?.likes}</ThemedText>
              </View>
            </View>
          </View>
        </View>
      </Pressable>

      {/* 更多操作弹窗 */}
      <Modal
        visible={showModal}
        title={t("article.moreActions")}
        onClose={setShowModal}
      >
        <View style={styles.menuModalContent}>
          {getMenuActions().map((item) => (
            <View key={item.key} style={styles.menuItem}>
              <Pressable
                style={styles.menuButton}
                accessibilityLabel={item.label}
                accessibilityRole="button"
                onPress={item.onPress}
              >
                <View
                  style={[
                    styles.menuIconContainer,
                    { backgroundColor: theme.secondaryBackground },
                  ]}
                >
                  {item.icon}
                </View>
                <ThemedText variant="bodySmall">{item.label}</ThemedText>
              </Pressable>
            </View>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  headerInfoUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerMenu: {
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    width: 14,
    height: 14,
  },
  content: {
    paddingHorizontal: 12,
  },
  title: {
    marginVertical: 6,
  },
  coverContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  videoBadge: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 999,
    padding: 12,
  },
  coverBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    paddingVertical: 1,
    paddingHorizontal: 6,
  },

  imageGrid: {
    flexDirection: "row",
    gap: 2,
    height: 160,
  },
  singleImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    maxHeight: 280,
    borderRadius: 8,
  },
  gridImageLeft: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  gridImageRight: {
    flex: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  grid3ImageLeft: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  grid3ImageMiddle: {
    flex: 1,
  },
  grid3ImageRight: {
    flex: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  imageGrid3: {
    flexDirection: "row",
    gap: 2,
    height: 140,
    overflow: "hidden",
  },
  footer: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  footerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    gap: 24,
  },
  statsItemAbsCenter: {
    position: "absolute",
    alignSelf: "center",
    left: -18,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reactionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 48,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  menuModalContent: {
    paddingBottom: 12,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});

export default memo(ArticleCard);
