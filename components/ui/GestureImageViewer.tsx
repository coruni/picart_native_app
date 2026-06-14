import {
  api,
  ArticleLikeDtoReactionTypeEnum,
  isAuthRedirectedError,
} from "@/api";
import { ArticleData } from "@/app/article/[id]";
import ShareModal from "@/components/article/ShareModal";
import CommentComposerModal from "@/components/comment/CommentComposerModal";
import { useConfirm } from "@/hooks/useConfirm";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { useAuthStore } from "@/store/authStore";
import type { ImageData } from "@/types/api";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import {
  Check,
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
  Keyboard,
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
  articleAuthorFollowed: boolean;
  canOpenCommentComposer: boolean;
  canToggleArticleAuthorFollow: boolean;
  articleLikeLoading: boolean;
  articleFavoriteLoading: boolean;
  onClose: () => void;
  onOpenShare: () => void;
  onOpenCommentComposer: () => void;
  onOpenOriginal: (image?: GestureImageViewerItem, index?: number) => void;
  onOpenArticle: () => void;
  onToggleArticleAuthorFollow: () => void;
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
  articleAuthorFollowed,
  canOpenCommentComposer,
  canToggleArticleAuthorFollow,
  articleLikeLoading,
  articleFavoriteLoading,
  onClose,
  onOpenShare,
  onOpenCommentComposer,
  onOpenOriginal,
  onOpenArticle,
  onToggleArticleAuthorFollow,
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
              bottom: insets.bottom + 88,
              opacity: chromeOpacity,
              transform: [{ translateX: rightTranslateX }],
            },
          ]}
        >
          <Pressable
            disabled={!canToggleArticleAuthorFollow}
            hitSlop={10}
            onPress={onToggleArticleAuthorFollow}
            style={[
              styles.avatarAction,
              !canToggleArticleAuthorFollow && styles.avatarActionDisabled,
            ]}
          >
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
              {articleAuthorFollowed ? (
                <Check color="white" size={14} strokeWidth={3} />
              ) : (
                <Plus color="white" size={14} />
              )}
            </View>
          </Pressable>

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
            <ThemedText
              color="white"
              numberOfLines={2}
              style={styles.articleTitle}
            >
              {article?.title}
            </ThemedText>
            <Pressable hitSlop={8} onPress={onOpenArticle}>
              <ThemedText color={theme.primary}>
                {t("imageViewer.viewArticle")}
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
                {t("commentComposer.placeholder")}
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
  const {
    dismiss: dismissConfirm,
    visible: confirmVisible,
    consumeCancelCloseGuard,
  } = useConfirm();
  const router = useRouter();
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ id?: string | string[] }>();
  const currentUserId = useAuthStore(
    (state) => state.profile?.id ?? state.user?.id,
  );
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

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
  const [articleAuthorFollowLoading, setArticleAuthorFollowLoading] =
    useState(false);
  const [articleAuthorFollowed, setArticleAuthorFollowed] = useState(
    article?.author?.isFollowed ?? false,
  );
  const [articleInteraction, setArticleInteraction] = useState(() => ({
    isLiked: article?.isLiked ?? false,
    likes: article?.likes ?? 0,
    isFavorited: article?.isFavorited ?? false,
    favoriteCount: article?.favoriteCount ?? 0,
    commentCount: article?.commentCount ?? 0,
  }));

  const shareRef = useRef<BottomSheetModal>(null);
  const commentComposerRef = useRef<BottomSheetModal>(null);
  const keyboardVisibleRef = useRef(false);
  const composerArticleId =
    variant === "comment" ? commentAction?.articleId : article?.id;
  const canOpenCommentComposer = Boolean(composerArticleId);
  const articleAuthorId = article?.author?.id;
  const canToggleArticleAuthorFollow =
    Boolean(articleAuthorId) &&
    isLoggedIn &&
    !articleAuthorFollowLoading &&
    Number(currentUserId) !== Number(articleAuthorId);
  const resolvedArticle = useMemo(() => {
    if (!article?.author) {
      return article;
    }

    return {
      ...article,
      author: {
        ...article.author,
        isFollowed: articleAuthorFollowed,
      },
    };
  }, [article, articleAuthorFollowed]);

  useEffect(() => {
    setArticleAuthorFollowed(article?.author?.isFollowed ?? false);
  }, [article?.author?.id, article?.author?.isFollowed]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      keyboardVisibleRef.current = true;
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      keyboardVisibleRef.current = false;
    });

    return () => {
      keyboardVisibleRef.current = false;
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
    if (consumeCancelCloseGuard()) {
      return;
    }

    if (keyboardVisibleRef.current) {
      Keyboard.dismiss();
      return;
    }

    if (confirmVisible) {
      dismissConfirm();
      return;
    }

    if (showCommentComposer) {
      commentComposerRef.current?.dismiss();
      return;
    }

    if (showShare) {
      shareRef.current?.dismiss();
      return;
    }

    close();
  }, [
    close,
    confirmVisible,
    consumeCancelCloseGuard,
    dismissConfirm,
    showCommentComposer,
    showShare,
  ]);

  const handleOpenShare = useCallback(() => {
    if (!resolvedArticle) {
      return;
    }

    setShowShare(true);
    requestAnimationFrame(() => {
      shareRef.current?.present();
    });
  }, [resolvedArticle]);

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
    if (!resolvedArticle?.id) {
      return;
    }

    const currentArticleId = Array.isArray(params.id)
      ? params.id[0]
      : params.id;
    const isCurrentArticle =
      pathname === `/article/${resolvedArticle.id}` ||
      (pathname === "/article/[id]" &&
        String(currentArticleId) === String(resolvedArticle.id));

    close();

    if (isCurrentArticle) {
      return;
    }

    router.push(
      {
        pathname: "/article/[id]",
        params: {
          id: String(resolvedArticle.id),
          author: JSON.stringify(resolvedArticle.author),
        },
      },
      { dangerouslySingular: true },
    );
  }, [close, params.id, pathname, resolvedArticle, router]);

  const handleToggleArticleAuthorFollow = useCallback(async () => {
    if (
      !article?.author?.id ||
      articleAuthorFollowLoading ||
      Number(currentUserId) === Number(article.author.id)
    ) {
      return;
    }

    const nextFollowed = !articleAuthorFollowed;
    setArticleAuthorFollowLoading(true);

    try {
      if (nextFollowed) {
        await api.userControllerFollow(String(article.author.id));
      } else {
        await api.userControllerUnfollow(String(article.author.id));
      }

      setArticleAuthorFollowed(nextFollowed);
    } catch (error) {
      if (isAuthRedirectedError(error)) {
        return;
      }

      Alert.alert(t("article.actionFailed"));
    } finally {
      setArticleAuthorFollowLoading(false);
    }
  }, [
    article?.author?.id,
    articleAuthorFollowLoading,
    articleAuthorFollowed,
    currentUserId,
    isLoggedIn,
    t,
  ]);

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
    } catch (error) {
      setArticleInteraction((current) => ({
        ...current,
        isLiked: previousState.isLiked,
        likes: previousState.likes,
      }));
      onArticleInteractionChange?.(previousState);
      if (isAuthRedirectedError(error)) {
        return;
      }
      Alert.alert(t("article.actionFailed"));
    } finally {
      setArticleLikeLoading(false);
    }
  }, [
    article,
    articleInteraction.isLiked,
    articleInteraction.likes,
    articleLikeLoading,
    isLoggedIn,
    onArticleInteractionChange,
    t,
  ]);

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
    } catch (error) {
      setArticleInteraction((current) => ({
        ...current,
        isFavorited: previousState.isFavorited,
        favoriteCount: previousState.favoriteCount,
      }));
      onArticleInteractionChange?.(previousState);
      if (isAuthRedirectedError(error)) {
        return;
      }
      Alert.alert(t("article.actionFailed"));
    } finally {
      setArticleFavoriteLoading(false);
    }
  }, [
    article,
    articleFavoriteLoading,
    articleInteraction.favoriteCount,
    articleInteraction.isFavorited,
    isLoggedIn,
    onArticleInteractionChange,
    t,
  ]);

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
        <Image
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
                article={resolvedArticle}
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
                articleAuthorFollowed={articleAuthorFollowed}
                canOpenCommentComposer={canOpenCommentComposer}
                canToggleArticleAuthorFollow={canToggleArticleAuthorFollow}
                articleLikeLoading={articleLikeLoading}
                articleFavoriteLoading={articleFavoriteLoading}
                onClose={close}
                onOpenShare={handleOpenShare}
                onOpenCommentComposer={handleOpenCommentComposer}
                onOpenOriginal={handleOpenOriginal}
                onOpenArticle={handleOpenArticle}
                onToggleArticleAuthorFollow={handleToggleArticleAuthorFollow}
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
                data={showShare ? resolvedArticle : undefined}
                onFollowChange={setArticleAuthorFollowed}
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
  avatarActionDisabled: {
    opacity: 0.75,
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
    alignItems: "stretch",
    gap: 10,
  },
  commentInputStub: {
    flex: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(70, 70, 70, 0.6)",
  },
  commentInputStubDisabled: {
    opacity: 0.6,
  },
  commentLikeButton: {
    minWidth: 54,
    height: "100%",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "rgba(70, 70, 70, 0.6)",
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
