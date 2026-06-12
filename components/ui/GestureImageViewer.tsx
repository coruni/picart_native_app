import { api, ArticleLikeDtoReactionTypeEnum } from "@/api";
import { ArticleData } from "@/app/article/[id]";
import ShareModal from "@/components/article/ShareModal";
import CommentComposerModal from "@/components/comment/CommentComposerModal";
import { useRouterLock } from "@/hooks/useRouterLock";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { useAuthStore } from "@/store/authStore";
import type { ImageData } from "@/types/api";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import {
  Ellipsis,
  MessageCircle,
  Plus,
  Star,
  ThumbsUp,
  X,
} from "lucide-react-native";
import {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  GestureViewer,
  useGestureViewerEvent,
  useGestureViewerState,
} from "react-native-gesture-image-viewer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncImage from "./AsyncImage";
import { Avatar } from "./Avatar";
import ThemedText from "./ThemedText";

export type GestureImageViewerItem = {
  imageData?: ImageData;
  previewUrl: string;
  viewerUrl: string;
  originalUrl?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
};

export type GestureImageViewerAuthor = {
  avatar?: string | null;
  equippedDecorations?: {
    AVATAR_FRAME?: {
      imageUrl?: string | null;
    } | null;
  } | null;
};

type GestureImageViewerVariant = "article" | "comment";

type GestureImageViewerCommentAction = {
  articleId?: string;
  parentId?: number | string;
  replyToName?: string;
  isLiked?: boolean;
  likeCount?: number;
  onLike?: () => void;
  onSubmitted?: () => void;
};

type ArticleInteractionPatch = Partial<
  Pick<
    ArticleData,
    "isLiked" | "likes" | "isFavorited" | "favoriteCount" | "commentCount"
  >
>;

type GestureImageViewerProps = {
  article?: ArticleData | undefined;
  author?: GestureImageViewerAuthor | undefined;
  variant?: GestureImageViewerVariant;
  commentAction?: GestureImageViewerCommentAction;
  images: GestureImageViewerItem[];
  onCommentSubmitted?: () => void;
  onArticleInteractionChange?: (updates: ArticleInteractionPatch) => void;
  children: (helpers: { open: (index?: number) => void }) => ReactNode;
};

type ViewerChromeProps = {
  id: string;
  images: GestureImageViewerItem[];
  originalLoadedMap: Record<number, boolean>;
  article?: ArticleData | undefined;
  author?: GestureImageViewerAuthor | undefined;
  variant: GestureImageViewerVariant;
  commentAction?: GestureImageViewerCommentAction;
  visible: boolean;
  articleLiked: boolean;
  articleLikeCount: number;
  articleCommentCount: number;
  articleFavorited: boolean;
  articleFavoriteCount: number;
  canOpenCommentComposer: boolean;
  articleLikeLoading: boolean;
  articleFavoriteLoading: boolean;
  onClose: () => void;
  onOpenShare: () => void;
  onOpenCommentComposer: () => void;
  onOpenOriginal: (image?: GestureImageViewerItem, index?: number) => void;
  onOpenArticle: () => void;
  onArticleLike: () => void;
  onArticleFavorite: () => void;
};

function formatFileSize(bytes?: number) {
  if (!bytes || bytes <= 0) {
    return null;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  }

  const megabytes = bytes / (1024 * 1024);
  const value = megabytes >= 10 ? megabytes.toFixed(0) : megabytes.toFixed(1);
  return `${value.replace(/\.0$/, "")}MB`;
}

function ViewerChrome({
  id,
  images,
  originalLoadedMap,
  article,
  author,
  variant,
  commentAction,
  visible,
  articleLiked,
  articleLikeCount,
  articleCommentCount,
  articleFavorited,
  articleFavoriteCount,
  canOpenCommentComposer,
  articleLikeLoading,
  articleFavoriteLoading,
  onClose,
  onOpenShare,
  onOpenCommentComposer,
  onOpenOriginal,
  onOpenArticle,
  onArticleLike,
  onArticleFavorite,
}: ViewerChromeProps) {
  const { t } = useTranslation();
  const { currentIndex, totalCount } = useGestureViewerState(id);
  const insets = useSafeAreaInsets();
  const [chromeOpacity] = useState(() => new Animated.Value(1));
  const [topTranslateY] = useState(() => new Animated.Value(0));
  const [bottomTranslateY] = useState(() => new Animated.Value(0));
  const [rightTranslateX] = useState(() => new Animated.Value(0));
  const [controlsHidden, setControlsHidden] = useState(!visible);
  const chromeHiddenTargetRef = useRef(!visible);
  const profile = useAuthStore((state) => state.profile);
  const { theme } = useTheme();

  const activeImage = images[currentIndex] ?? images[0];
  const isOriginalLoaded = Boolean(originalLoadedMap[currentIndex]);
  const originalSize = formatFileSize(activeImage?.sizeBytes);
  const shouldShowOriginalButton = Boolean(originalSize) && !isOriginalLoaded;
  const originalLabel = originalSize
    ? t("imageViewer.viewOriginalWithSize", { size: originalSize })
    : "";
  const isArticleVariant = variant === "article" && Boolean(article);
  const showCommentBar = canOpenCommentComposer || !isArticleVariant;

  const animateChrome = useCallback(
    (hidden: boolean) => {
      if (chromeHiddenTargetRef.current === hidden) {
        return;
      }

      chromeHiddenTargetRef.current = hidden;

      if (!hidden) {
        requestAnimationFrame(() => setControlsHidden(false));
      }

      Animated.parallel([
        Animated.timing(chromeOpacity, {
          toValue: hidden ? 0 : 1,
          duration: hidden ? 160 : 220,
          useNativeDriver: true,
        }),
        Animated.timing(topTranslateY, {
          toValue: hidden ? -14 : 0,
          duration: hidden ? 160 : 220,
          useNativeDriver: true,
        }),
        Animated.timing(bottomTranslateY, {
          toValue: hidden ? 18 : 0,
          duration: hidden ? 160 : 220,
          useNativeDriver: true,
        }),
        Animated.timing(rightTranslateX, {
          toValue: hidden ? 34 : 0,
          duration: hidden ? 160 : 220,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && hidden) {
          setControlsHidden(true);
        }
      });
    },
    [bottomTranslateY, chromeOpacity, rightTranslateX, topTranslateY],
  );

  useEffect(() => {
    chromeHiddenTargetRef.current = visible;
    animateChrome(!visible);
  }, [animateChrome, visible]);

  useGestureViewerEvent(id, "zoomChange", ({ scale }) => {
    animateChrome(scale > 1.001);
  });

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents={controlsHidden ? "none" : "box-none"}
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 12,
            opacity: chromeOpacity,
            transform: [{ translateY: topTranslateY }],
          },
        ]}
      >
        <Pressable hitSlop={10} onPress={onClose} style={styles.iconButton}>
          <X color="#FFFFFF" size={24} strokeWidth={2.25} />
        </Pressable>

        {totalCount > 0 ? (
          <View style={styles.counterWrap}>
            <ThemedText color="#FFFFFF" fontWeight="700" size={16}>
              {`${currentIndex + 1}/${totalCount}`}
            </ThemedText>
          </View>
        ) : (
          <View />
        )}

        {isArticleVariant ? (
          <Pressable
            hitSlop={10}
            onPress={onOpenShare}
            style={styles.iconButton}
          >
            <Ellipsis color="#FFFFFF" size={24} strokeWidth={2.5} />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </Animated.View>

      {isArticleVariant ? (
        <Animated.View
          pointerEvents={controlsHidden ? "none" : "box-none"}
          style={[
            styles.rightRail,
            {
              bottom: insets.bottom + 78,
              opacity: chromeOpacity,
              transform: [{ translateX: rightTranslateX }],
            },
          ]}
        >
          <View style={styles.avatarAction}>
            <Avatar
              size={48}
              border
              rounded
              uri={author?.avatar ?? undefined}
              avatarFrameUri={
                author?.equippedDecorations?.AVATAR_FRAME?.imageUrl ?? undefined
              }
            />
            <View
              style={[styles.avatarPlus, { backgroundColor: theme.primary }]}
            >
              <Plus color="white" size={14} />
            </View>
          </View>

          <Pressable
            hitSlop={10}
            disabled={articleLikeLoading}
            onPress={onArticleLike}
            style={styles.railAction}
          >
            <ThumbsUp
              color={articleLiked ? theme.primary : "white"}
              fill={articleLiked ? theme.primary : "transparent"}
              size={28}
            />
            <ThemedText
              color={articleLiked ? theme.primary : "white"}
              size={12}
            >
              {articleLikeCount}
            </ThemedText>
          </Pressable>

          <Pressable
            hitSlop={10}
            disabled={!canOpenCommentComposer}
            onPress={onOpenCommentComposer}
            style={styles.railAction}
          >
            <MessageCircle color="white" size={28} />
            <ThemedText color="white" size={12}>
              {articleCommentCount}
            </ThemedText>
          </Pressable>

          <Pressable
            hitSlop={10}
            disabled={articleFavoriteLoading}
            onPress={onArticleFavorite}
            style={styles.railAction}
          >
            <Star
              color={articleFavorited ? theme.primary : "white"}
              fill={articleFavorited ? theme.primary : "transparent"}
              size={28}
            />
            <ThemedText
              color={articleFavorited ? theme.primary : "white"}
              size={12}
            >
              {articleFavoriteCount}
            </ThemedText>
          </Pressable>
        </Animated.View>
      ) : null}

      <Animated.View
        pointerEvents={controlsHidden ? "none" : "box-none"}
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            opacity: chromeOpacity,
            transform: [{ translateY: bottomTranslateY }],
          },
        ]}
      >
        {shouldShowOriginalButton ? (
          <Pressable
            hitSlop={10}
            onPress={() => onOpenOriginal(activeImage, currentIndex)}
            style={[
              styles.originalButton,
              !isArticleVariant && styles.originalButtonCentered,
            ]}
          >
            <ThemedText color="#FFFFFF" size={12}>
              {originalLabel}
            </ThemedText>
          </Pressable>
        ) : null}

        {isArticleVariant ? (
          <View style={styles.articleTitleRow}>
            <ThemedText color="white" numberOfLines={2} style={styles.articleTitle}>
              {article?.title}
            </ThemedText>
            <Pressable hitSlop={8} onPress={onOpenArticle}>
              <ThemedText color={theme.primary}>
                {t("imageViewer.viewArticle", {
                  defaultValue: "View article",
                })}
              </ThemedText>
            </Pressable>
          </View>
        ) : null}

        {showCommentBar ? (
          <View style={styles.commentActionRow}>
            <Pressable
              disabled={!canOpenCommentComposer}
              style={[
                styles.commentInputStub,
                !canOpenCommentComposer && styles.commentInputStubDisabled,
              ]}
              onPress={onOpenCommentComposer}
            >
              <Avatar uri={profile?.avatar} size={24} />
              <ThemedText color="white">
                {t("imageViewer.commentPlaceholder", {
                  defaultValue: "Say something...",
                })}
              </ThemedText>
            </Pressable>
            {!isArticleVariant ? (
              <Pressable
                hitSlop={8}
                style={styles.commentLikeButton}
                onPress={commentAction?.onLike}
              >
                <ThumbsUp
                  color={commentAction?.isLiked ? theme.primary : "white"}
                  size={22}
                />
                <ThemedText color="white" size={12}>
                  {commentAction?.likeCount ?? 0}
                </ThemedText>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

function GestureImageViewer({
  images,
  children,
  article,
  author,
  variant = "article",
  commentAction,
  onCommentSubmitted,
  onArticleInteractionChange,
}: GestureImageViewerProps) {
  const rawId = useId();
  const viewerId = useMemo(
    () => `gesture-image-viewer-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [rawId],
  );
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ id?: string | string[] }>();
  const lockRouter = useRouterLock();

  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [originalLoadedMap, setOriginalLoadedMap] = useState<
    Record<number, boolean>
  >({});
  const [showShare, setShowShare] = useState(false);
  const [showCommentComposer, setShowCommentComposer] = useState(false);
  const [articleLikeLoading, setArticleLikeLoading] = useState(false);
  const [articleFavoriteLoading, setArticleFavoriteLoading] = useState(false);
  const [articleInteraction, setArticleInteraction] = useState(() => ({
    isLiked: article?.isLiked ?? false,
    likes: article?.likes ?? 0,
    isFavorited: article?.isFavorited ?? false,
    favoriteCount: article?.favoriteCount ?? 0,
    commentCount: article?.commentCount ?? 0,
  }));

  const shareRef = useRef<BottomSheetModal>(null);
  const commentComposerRef = useRef<BottomSheetModal>(null);
  const composerArticleId =
    variant === "comment" ? commentAction?.articleId : article?.id;
  const canOpenCommentComposer = Boolean(composerArticleId);

  const open = useCallback(
    (index = 0) => {
      if (!images.length) {
        return;
      }

      setSelectedIndex(index);
      setChromeVisible(true);
      setOriginalLoadedMap({});
      setVisible(true);
    },
    [images.length],
  );

  const close = useCallback(() => {
    shareRef.current?.dismiss();
    commentComposerRef.current?.dismiss();
    setVisible(false);
    setChromeVisible(true);
    setOriginalLoadedMap({});
    setShowShare(false);
    setShowCommentComposer(false);
  }, []);

  const handleRequestClose = useCallback(() => {
    if (showCommentComposer) {
      commentComposerRef.current?.dismiss();
      return;
    }

    if (showShare) {
      shareRef.current?.dismiss();
      return;
    }

    close();
  }, [close, showCommentComposer, showShare]);

  const handleOpenShare = useCallback(() => {
    if (!article) {
      return;
    }

    setShowShare(true);
    requestAnimationFrame(() => {
      shareRef.current?.present();
    });
  }, [article]);

  const handleOpenCommentComposer = useCallback(() => {
    if (!composerArticleId || showCommentComposer) {
      return;
    }

    setShowCommentComposer(true);
    requestAnimationFrame(() => {
      commentComposerRef.current?.present();
    });
  }, [composerArticleId, showCommentComposer]);

  const handleOpenArticle = useCallback(() => {
    if (!article?.id) {
      return;
    }

    const currentArticleId = Array.isArray(params.id) ? params.id[0] : params.id;
    const isCurrentArticle =
      pathname === `/article/${article.id}` ||
      (pathname === "/article/[id]" &&
        String(currentArticleId) === String(article.id));

    close();

    if (isCurrentArticle) {
      return;
    }

    lockRouter(() => {
      router.push({
        pathname: "/article/[id]",
        params: {
          id: String(article.id),
          author: JSON.stringify(article.author),
        },
      });
    });
  }, [article, close, lockRouter, params.id, pathname, router]);

  const handleArticleLike = useCallback(async () => {
    if (!article?.id || articleLikeLoading) {
      return;
    }

    const previousState = {
      isLiked: articleInteraction.isLiked,
      likes: articleInteraction.likes,
    };
    const nextLiked = !previousState.isLiked;
    const nextLikes = Math.max(0, previousState.likes + (nextLiked ? 1 : -1));

    setArticleLikeLoading(true);
    setArticleInteraction((current) => ({
      ...current,
      isLiked: nextLiked,
      likes: nextLikes,
    }));
    onArticleInteractionChange?.({
      isLiked: nextLiked,
      likes: nextLikes,
    });

    try {
      if (nextLiked) {
        await api.articleControllerLike(String(article.id), {
          reactionType: ArticleLikeDtoReactionTypeEnum.Like,
        });
      } else {
        await api.articleControllerDislikeArticle(String(article.id), {});
      }
    } catch {
      setArticleInteraction((current) => ({
        ...current,
        isLiked: previousState.isLiked,
        likes: previousState.likes,
      }));
      onArticleInteractionChange?.(previousState);
      Alert.alert(t("article.actionFailed"));
    } finally {
      setArticleLikeLoading(false);
    }
  }, [article, articleInteraction.isLiked, articleInteraction.likes, articleLikeLoading, onArticleInteractionChange, t]);

  const handleArticleFavorite = useCallback(async () => {
    if (!article?.id || articleFavoriteLoading) {
      return;
    }

    const previousState = {
      isFavorited: articleInteraction.isFavorited,
      favoriteCount: articleInteraction.favoriteCount,
    };
    const nextFavorited = !previousState.isFavorited;
    const nextFavoriteCount = Math.max(
      0,
      previousState.favoriteCount + (nextFavorited ? 1 : -1),
    );

    setArticleFavoriteLoading(true);
    setArticleInteraction((current) => ({
      ...current,
      isFavorited: nextFavorited,
      favoriteCount: nextFavoriteCount,
    }));
    onArticleInteractionChange?.({
      isFavorited: nextFavorited,
      favoriteCount: nextFavoriteCount,
    });

    try {
      if (nextFavorited) {
        await api.articleControllerFavoriteArticle(String(article.id));
      } else {
        await api.articleControllerUnfavoriteArticle(String(article.id));
      }
    } catch {
      setArticleInteraction((current) => ({
        ...current,
        isFavorited: previousState.isFavorited,
        favoriteCount: previousState.favoriteCount,
      }));
      onArticleInteractionChange?.(previousState);
      Alert.alert(t("article.actionFailed"));
    } finally {
      setArticleFavoriteLoading(false);
    }
  }, [article, articleFavoriteLoading, articleInteraction.favoriteCount, articleInteraction.isFavorited, onArticleInteractionChange, t]);

  const handleViewerCommentSubmitted = useCallback(() => {
    if (variant === "comment") {
      commentAction?.onSubmitted?.();
      return;
    }

    const nextCommentCount = articleInteraction.commentCount + 1;
    setArticleInteraction((current) => ({
      ...current,
      commentCount: nextCommentCount,
    }));
    onCommentSubmitted?.();
  }, [
    articleInteraction.commentCount,
    commentAction,
    onCommentSubmitted,
    variant,
  ]);

  const handleOpenOriginal = useCallback(
    (image?: GestureImageViewerItem, index?: number) => {
      if (typeof index !== "number") {
        return;
      }

      const targetUrl = image?.imageData
        ? getImageUrl(image.imageData, "original") || image.originalUrl
        : image?.originalUrl;

      if (!targetUrl) {
        return;
      }

      setOriginalLoadedMap((current) => {
        if (current[index]) {
          return current;
        }

        return {
          ...current,
          [index]: true,
        };
      });
    },
    [],
  );

  const renderItem = useCallback(
    (item: GestureImageViewerItem, index: number) => {
      const isOriginalLoaded = Boolean(originalLoadedMap[index]);
      const sourceUrl = isOriginalLoaded
        ? item.imageData
          ? getImageUrl(item.imageData, "original") ||
            item.originalUrl ||
            item.viewerUrl
          : item.originalUrl || item.viewerUrl
        : item.viewerUrl;

      return (
        <AsyncImage
          source={{ uri: sourceUrl }}
          contentFit="contain"
          style={styles.viewerImage}
        />
      );
    },
    [originalLoadedMap],
  );

  return (
    <>
      {children({ open })}
      {visible ? (
        <Modal
          transparent
          visible
          animationType="fade"
          statusBarTranslucent
          presentationStyle="overFullScreen"
          onRequestClose={handleRequestClose}
        >
          <BottomSheetModalProvider>
            <View style={styles.modalRoot}>
              <GestureViewer
                id={viewerId}
                data={images}
                initialIndex={selectedIndex}
                onDismiss={close}
                onSingleTap={() => setChromeVisible((current) => !current)}
                renderItem={renderItem}
                ListComponent={ScrollView}
                backdropStyle={styles.backdrop}
                containerStyle={styles.viewerContainer}
                dismiss={{
                  enabled: true,
                }}
                enableHorizontalSwipe={images.length > 1}
                enableDoubleTapZoom
                enablePinchZoom
                maxZoomScale={3}
              />

              <ViewerChrome
                id={viewerId}
                article={article}
                author={author}
                variant={variant}
                commentAction={commentAction}
                images={images}
                originalLoadedMap={originalLoadedMap}
                visible={chromeVisible}
                articleLiked={articleInteraction.isLiked}
                articleLikeCount={articleInteraction.likes}
                articleCommentCount={articleInteraction.commentCount}
                articleFavorited={articleInteraction.isFavorited}
                articleFavoriteCount={articleInteraction.favoriteCount}
                canOpenCommentComposer={canOpenCommentComposer}
                articleLikeLoading={articleLikeLoading}
                articleFavoriteLoading={articleFavoriteLoading}
                onClose={close}
                onOpenShare={handleOpenShare}
                onOpenCommentComposer={handleOpenCommentComposer}
                onOpenOriginal={handleOpenOriginal}
                onOpenArticle={handleOpenArticle}
                onArticleLike={handleArticleLike}
                onArticleFavorite={handleArticleFavorite}
              />

              <View pointerEvents="none" style={styles.bottomFadeWrap}>
                <View
                  style={[
                    styles.bottomFade,
                    {
                      opacity: 0.08,
                    },
                  ]}
                />
              </View>

              <ShareModal
                ref={shareRef}
                data={showShare ? article : undefined}
                onClose={() => setShowShare(false)}
              />
              <CommentComposerModal
                ref={commentComposerRef}
                articleId={
                  showCommentComposer && composerArticleId
                    ? String(composerArticleId)
                    : undefined
                }
                parentId={
                  showCommentComposer ? commentAction?.parentId : undefined
                }
                replyToName={
                  showCommentComposer ? commentAction?.replyToName : undefined
                }
                onClose={() => setShowCommentComposer(false)}
                onSubmitted={handleViewerCommentSubmitted}
              />
            </View>
          </BottomSheetModalProvider>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: "#000000",
  },
  viewerContainer: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: "#000000",
  },
  viewerImage: {
    width: "100%",
    height: "100%",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  counterWrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  rightRail: {
    position: "absolute",
    right: 16,
    gap: 16,
    alignItems: "center",
  },
  avatarAction: {
    position: "relative",
  },
  avatarPlus: {
    position: "absolute",
    bottom: -5,
    left: "50%",
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 999,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -10 }],
  },
  railAction: {
    alignItems: "center",
    gap: 4,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    gap: 8,
  },
  originalButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(15,15,15,0.72)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  originalButtonCentered: {
    alignSelf: "center",
  },
  articleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  articleTitle: {
    flex: 1,
  },
  commentActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  commentInputStub: {
    flex: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  commentInputStubDisabled: {
    opacity: 0.6,
  },
  commentLikeButton: {
    minWidth: 54,
    height: 34,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  bottomFadeWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
    justifyContent: "flex-end",
  },
  bottomFade: {
    height: 140,
  },
});

export default memo(GestureImageViewer);
