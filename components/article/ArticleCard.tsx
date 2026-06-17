import { ArticleData } from "@/app/article/[id]";
import angry from "@/assets/images/reaction/angry.png";
import dislike from "@/assets/images/reaction/dislike.png";
import haha from "@/assets/images/reaction/haha.png";
import like from "@/assets/images/reaction/like.png";
import love from "@/assets/images/reaction/love.png";
import sad from "@/assets/images/reaction/sad.png";
import wow from "@/assets/images/reaction/wow.png";
import ShareModal from "@/components/article/ShareModal";
import AsyncImage from "@/components/ui/AsyncImage";
import { Avatar } from "@/components/ui/Avatar";
import GestureImageViewer from "@/components/ui/GestureImageViewer";
import ThemedIcon from "@/components/ui/ThemedIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useTranslate } from "@/hooks/useTranslate";
import { getImageUrl } from "@/lib/image";
import { formatRelativeTime } from "@/lib/time";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import {
  EllipsisVertical,
  Eye,
  FileImage,
  ImageIcon,
  MessageCircleMore,
  Play,
  ThumbsUp,
} from "lucide-react-native";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, StyleSheet, View } from "react-native";

type ArticleCardProps = {
  data: ArticleData;
  isLast?: boolean;
};

type ReactionType =
  | "like"
  | "love"
  | "haha"
  | "wow"
  | "sad"
  | "angry"
  | "dislike";

const reactionImageMap: Record<ReactionType, any> = {
  like,
  love,
  haha,
  wow,
  sad,
  angry,
  dislike,
};

const reactionTypes: ReactionType[] = [
  "like",
  "love",
  "haha",
  "wow",
  "sad",
  "angry",
  "dislike",
];

function ArticleCard({ data, isLast }: ArticleCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ id?: string | string[] }>();
  const shareRef = useRef<BottomSheetModal>(null);
  const [commentCount, setCommentCount] = useState(data?.commentCount ?? 0);
  const [authorFollowed, setAuthorFollowed] = useState(
    data?.author?.isFollowed ?? false,
  );

  useEffect(() => {
    setCommentCount(data?.commentCount ?? 0);
  }, [data?.commentCount, data?.id]);

  useEffect(() => {
    setAuthorFollowed(data?.author?.isFollowed ?? false);
  }, [data?.author?.id, data?.author?.isFollowed]);

  // 列表默认翻译标题与简介，跟随当前 App 语言
  const { displayText: titleText, fadeAnim: titleFade } = useTranslate(
    data?.title ?? "",
    {
      auto: true,
    },
  );

  const { displayText: categoryText, fadeAnim: categoryFade } = useTranslate(
    data?.category?.name ?? "",
    { auto: true },
  );
  const { displayText: summaryText, fadeAnim: summaryFade } = useTranslate(
    data?.summary ?? "",
    {
      auto: true,
    },
  );

  const shareModalArticle = useMemo(
    () => ({
      ...data,
      author: {
        ...data.author,
        isFollowed: authorFollowed,
      },
    }),
    [authorFollowed, data],
  );

  const handleArticleClick = () => {
    const articleId = data?.id ? String(data.id) : "";
    const currentRouteId = Array.isArray(params.id) ? params.id[0] : params.id;
    const isCurrentArticlePage =
      pathname === `/article/${articleId}` ||
      (pathname === "/article/[id]" && currentRouteId === articleId);

    if (!articleId || isCurrentArticlePage) return;

    router.push(
      {
        pathname: "/article/[id]",
        params: {
          id: articleId,
          author: JSON.stringify(data.author),
        },
      },
      { dangerouslySingular: true },
    );
  };

  const handleAuthorClick = () => {
    const authorId = data?.author?.id ? String(data.author.id) : "";
    const currentRouteId = Array.isArray(params.id) ? params.id[0] : params.id;
    const isCurrentUserPage =
      pathname === `/user/${authorId}` ||
      (pathname === "/user/[id]" && currentRouteId === authorId);

    if (!authorId || isCurrentUserPage) {
      return;
    }

    router.push(
      {
        pathname: "/user/[id]",
        params: { id: authorId, user: JSON.stringify(data.author) },
      },
      { dangerouslySingular: true },
    );
  };

  const handleMoreClick = () => {
    setTimeout(() => shareRef.current?.present(), 50);
  };

  const renderCover = useCallback(() => {
    return (
      <View style={styles.coverContainer}>
        <AsyncImage
          source={data?.cover}
          contentFit="cover"
          style={styles.coverImage}
        />

        {data?.type === "video" && (
          <View style={styles.videoBadge}>
            <Play color="white" />
          </View>
        )}

        {data?.cover && data?.type !== "video" && (
          <View style={styles.coverBadge}>
            <FileImage color="white" size={10} />
          </View>
        )}
      </View>
    );
  }, [data.type, data.cover]);

  const viewerImages = useMemo(
    () =>
      (data?.images ?? [])
        .map((image) => {
          const viewerUrl = getImageUrl(image, "large");
          if (!viewerUrl) return null;

          return {
            imageData: typeof image === "string" ? undefined : image,
            previewUrl: viewerUrl,
            viewerUrl,
            originalUrl: getImageUrl(image, "original") || viewerUrl,
            width: typeof image === "string" ? undefined : image.width,
            height: typeof image === "string" ? undefined : image.height,
            sizeBytes: typeof image === "string" ? undefined : image.size,
          };
        })
        .filter((item) => item !== null),
    [data.images],
  );

  const renderMedia = () => {
    const images = data?.images ?? [];

    if (!images.length || !viewerImages.length) {
      return null;
    }

    return (
      <GestureImageViewer
        article={data}
        author={data.author}
        images={viewerImages}
        onCommentSubmitted={() => {
          setCommentCount((current) => current + 1);
        }}
      >
        {({ open }) => {
          if (images.length === 1) {
            const image = images[0];
            const aspectRatio =
              typeof image !== "string" && image?.width && image?.height
                ? image.width / image.height
                : 16 / 9;
            return (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  open(0);
                }}
                style={[
                  styles.singleImagePressable,
                  { aspectRatio, borderColor: theme.border },
                ]}
              >
                <AsyncImage
                  source={getImageUrl(image, "large")}
                  contentFit="cover"
                  style={styles.singleImage}
                />
              </Pressable>
            );
          }

          if (images.length === 2) {
            return (
              <View style={styles.imageGrid}>
                <Pressable
                  onPress={(event) => {
                    event.stopPropagation();
                    open(0);
                  }}
                  style={styles.gridImageLeft}
                >
                  <AsyncImage
                    source={getImageUrl(images[0], "large")}
                    contentFit="cover"
                    style={[
                      styles.gridImageFill,
                      { borderColor: theme.border },
                    ]}
                  />
                </Pressable>
                <Pressable
                  onPress={(event) => {
                    event.stopPropagation();
                    open(1);
                  }}
                  style={styles.gridImageRight}
                >
                  <AsyncImage
                    source={getImageUrl(images[1], "large")}
                    contentFit="cover"
                    style={[
                      styles.gridImageFill,
                      { borderColor: theme.border },
                    ]}
                  />
                </Pressable>
              </View>
            );
          }

          return (
            <View style={styles.imageGrid3}>
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  open(0);
                }}
                style={styles.grid3ImageLeft}
              >
                <AsyncImage
                  source={getImageUrl(images[0], "large")}
                  contentFit="cover"
                  style={[styles.gridImageFill, { borderColor: theme.border }]}
                />
              </Pressable>
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  open(1);
                }}
                style={styles.grid3ImageMiddle}
              >
                <AsyncImage
                  source={getImageUrl(images[1], "large")}
                  contentFit="cover"
                  style={[styles.gridImageFill, { borderColor: theme.border }]}
                />
              </Pressable>
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  open(2);
                }}
                style={[styles.grid3ImageRight, { borderColor: theme.border }]}
              >
                <AsyncImage
                  source={getImageUrl(images[2], "large")}
                  contentFit="cover"
                  style={styles.gridImageFill}
                />
                {data?.imageCount - 3 > 0 && (
                  <View style={[styles.coverBadge, { gap: 4 }]}>
                    <ImageIcon color="white" size={10} />
                    <ThemedText color="white" size={12}>
                      +{data?.imageCount - 3}
                    </ThemedText>
                  </View>
                )}
              </Pressable>
            </View>
          );
        }}
      </GestureImageViewer>
    );
  };

  const totalReactions = Object.keys(data?.reactionStats || {}).reduce(
    (acc, key) => {
      const value = data.reactionStats[key as keyof typeof data.reactionStats];
      return acc + (value || 0);
    },
    0,
  );

  const topReactions = useMemo(() => {
    return reactionTypes
      .map((type) => ({
        type,
        count: data?.reactionStats?.[type] || 0,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 2);
  }, [data.reactionStats]);

  return (
    <>
      <Pressable onPress={handleArticleClick} style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={(e) => {
              e?.stopPropagation?.();
              handleAuthorClick();
            }}
            style={styles.authorPressable}
            hitSlop={8}
          >
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
                {formatRelativeTime(data?.createdAt, t)} • {categoryText}
              </ThemedText>
            </View>
          </Pressable>
          <View style={styles.headerMenu}>
            <Pressable
              onPress={(e) => {
                e?.stopPropagation?.();
                handleMoreClick();
              }}
              hitSlop={10}
            >
              <ThemedIcon icon={EllipsisVertical} variant="muted" size={20} />
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <Animated.Text
            style={[
              styles.titleAnimated,
              { color: theme.text },
              { opacity: titleFade },
            ]}
            numberOfLines={3}
          >
            {titleText}
          </Animated.Text>

          {/* {data?.summary ? (
            <Animated.Text
              style={[
                styles.summaryAnimated,
                { color: theme.secondary },
                { opacity: summaryFade },
              ]}
              numberOfLines={2}
            >
              {summaryText}
            </Animated.Text>
          ) : null} */}

          {data?.type === "image" && data?.images?.length > 0
            ? renderMedia()
            : data?.cover
              ? renderCover()
              : renderMedia()}
        </View>

        <View
          style={[
            styles.footer,
            { borderColor: theme.border },
            isLast && { borderBottomWidth: 0 },
          ]}
        >
          <View style={styles.footerInner}>
            <View style={styles.statsItem}>
              <ThemedIcon icon={Eye} variant="muted" size={18} />
              <ThemedText variant="caption">{data?.views}</ThemedText>
            </View>

            <View style={styles.footerRight}>
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
                <ThemedText size={12}>{commentCount}</ThemedText>
              </View>

              <View style={styles.statsItem}>
                {totalReactions > 0 && (
                  <View style={styles.reactionGroup}>
                    {topReactions.map((reaction, index) => (
                      <AsyncImage
                        key={reaction.type}
                        source={reactionImageMap[reaction.type]}
                        showLoading={false}
                        style={[
                          styles.reactionIcon,
                          { backgroundColor: theme.card },
                          { borderColor: theme.card },
                          index > 0 && styles.reactionIconOverlap,
                        ]}
                      />
                    ))}
                  </View>
                )}
                <ThemedIcon icon={ThumbsUp} variant="default" size={18} />
                <ThemedText size={12}>{data?.likes}</ThemedText>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
      <ShareModal
        ref={shareRef}
        data={shareModalArticle}
        onFollowChange={setAuthorFollowed}
        onClose={() => {
          // no-op: BottomSheetModal already dismissed itself
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authorPressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerInfo: {
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
    paddingHorizontal: 14,
  },
  title: {
    marginVertical: 6,
  },
  summary: {
    marginBottom: 8,
  },
  titleAnimated: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 6,
    lineHeight: 22,
  },
  summaryAnimated: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
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
    height: "100%",
  },
  singleImagePressable: {
    width: "80%",
    maxHeight: 280,
    borderRadius: 8,
    overflow: "hidden",
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
  gridImageFill: {
    width: "100%",
    height: "100%",
  },
  grid3ImageLeft: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    overflow: "hidden",
  },
  grid3ImageMiddle: {
    flex: 1,
  },
  grid3ImageRight: {
    flex: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
  imageGrid3: {
    flexDirection: "row",
    gap: 2,
    height: 140,
    overflow: "hidden",
  },
  footer: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
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
  },
  reactionIcon: {
    width: 20,
    height: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  reactionIconOverlap: {
    marginLeft: -4,
  },
  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 48,
  },
});

export default memo(ArticleCard);
