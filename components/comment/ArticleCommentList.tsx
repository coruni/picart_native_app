import { api } from "@/api";
import type {
  CommentControllerFindAll200ResponseDataDataInner,
  CommentControllerFindAllSortByEnum,
} from "@/api/generated";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { ChevronDown } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  CommentListEmptyState,
  CommentListFooterState,
} from "./CommentListState";
import CommentItem from "./CommentItem";
import CommentListSkeleton from "./CommentSkeleton";

export type CommentSortKey = "all" | "hot" | "oldest" | "latest";

const SORT_OPTIONS: { key: CommentSortKey; labelKey: string }[] = [
  { key: "all", labelKey: "commentList.sortOptions.all" },
  { key: "hot", labelKey: "commentList.sortOptions.hot" },
  { key: "oldest", labelKey: "commentList.sortOptions.oldest" },
  { key: "latest", labelKey: "commentList.sortOptions.latest" },
];

const SORT_BY_MAP: Record<
  CommentSortKey,
  CommentControllerFindAllSortByEnum | undefined
> = {
  all: undefined as any,
  hot: "hot" as CommentControllerFindAllSortByEnum,
  oldest: "oldest" as CommentControllerFindAllSortByEnum,
  latest: "latest" as CommentControllerFindAllSortByEnum,
};

interface Props {
  articleId: string;
  articleAuthorId?: number;
  compact?: boolean;
  refreshSignal?: number;
  onReady?: () => void;
  hideHeader?: boolean;
  sortKey?: CommentSortKey;
  onSortKeyChange?: (key: CommentSortKey) => void;
}

type ArticleCommentListLabelProps = {
  sortKey: CommentSortKey;
  onSortKeyChange: (key: CommentSortKey) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export function ArticleCommentListLabel({
  sortKey,
  onSortKeyChange,
  onLayout,
}: ArticleCommentListLabelProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [showSortPicker, setShowSortPicker] = useState(false);
  const [sortIndicatorAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(sortIndicatorAnim, {
      toValue: showSortPicker ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [showSortPicker, sortIndicatorAnim]);

  const handleSortSelect = (key: CommentSortKey) => {
    setShowSortPicker(false);
    if (key === sortKey) return;
    onSortKeyChange(key);
  };

  const currentSortLabel = t(
    sortKey === "all"
      ? "commentList.sortOptions.all"
      : `commentList.sortOptions.${sortKey}`,
  );

  const sortIndicatorStyle = {
    transform: [
      {
        rotate: sortIndicatorAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.sortBar,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <Pressable
        style={styles.sortBtn}
        onPress={() => setShowSortPicker(!showSortPicker)}
      >
        <ThemedText size={14} color={theme.foreground}>
          {currentSortLabel}
        </ThemedText>
        <Animated.View style={sortIndicatorStyle}>
          <ChevronDown size={14} color={theme.secondary} />
        </Animated.View>
      </Pressable>

      {showSortPicker && (
        <View
          style={[
            styles.sortPicker,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              style={[
                styles.sortOption,
                sortKey === opt.key && {
                  backgroundColor: theme.primary + "15",
                },
              ]}
              onPress={() => handleSortSelect(opt.key)}
            >
              <ThemedText
                size={12}
                color={sortKey === opt.key ? theme.primary : theme.text}
                fontWeight={sortKey === opt.key ? "600" : "400"}
              >
                {t(opt.labelKey)}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ArticleCommentList({
  articleId,
  articleAuthorId,
  refreshSignal = 0,
  onReady,
  hideHeader = false,
  sortKey: controlledSortKey,
  onSortKeyChange,
}: Props) {
  const { t } = useTranslation();

  const [comments, setComments] = useState<
    CommentControllerFindAll200ResponseDataDataInner[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalSortKey, setInternalSortKey] = useState<CommentSortKey>("all");
  const sortKey = controlledSortKey ?? internalSortKey;

  const loadingRef = useRef(false);
  const hasNotifiedReady = useRef(false);
  const hasInitializedRef = useRef(false);
  const hasHandledRefreshSignalRef = useRef(false);
  const pageSize = 10;

  const fetchComments = useCallback(
    async (
      pageToLoad: number,
      isRefresh: boolean,
      currentSort: CommentSortKey,
      options?: {
        showLoadingState?: boolean;
      },
    ) => {
      if (loadingRef.current && !isRefresh) return;
      loadingRef.current = true;
      const showLoadingState = options?.showLoadingState ?? true;

      if (showLoadingState) {
        setLoading(true);
      }
      setError(null);

      try {
        const { data: res } = await api.commentControllerFindAll(
          articleId,
          pageToLoad,
          pageSize,
          SORT_BY_MAP[currentSort],
        );
        const newData = res.data?.data || [];
        const total = res.data?.meta?.total || 0;
        let nextCount = newData.length;

        if (isRefresh) {
          setComments(newData);
          setCurrentPage(pageToLoad);
        } else {
          setComments((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const unique = newData.filter(
              (item: CommentControllerFindAll200ResponseDataDataInner) =>
                !existingIds.has(item.id),
            );
            nextCount = prev.length + unique.length;
            return [...prev, ...unique];
          });
          setCurrentPage(pageToLoad);
        }
        setHasMore(nextCount < total);
      } catch (e) {
        console.error("Failed to fetch comments:", e);
        setError(t("commentList.loadFailed"));
      } finally {
        loadingRef.current = false;
        if (showLoadingState) {
          setLoading(false);
        }
        hasInitializedRef.current = true;
        if (!hasNotifiedReady.current) {
          hasNotifiedReady.current = true;
          onReady?.();
        }
      }
    },
    [articleId, pageSize, t, onReady],
  );

  useEffect(() => {
    const task = setTimeout(() => {
      hasNotifiedReady.current = false;
      setComments([]);
      setCurrentPage(0);
      setHasMore(true);
      setLoading(true);
      fetchComments(1, true, sortKey, { showLoadingState: true });
    }, 0);
    return () => clearTimeout(task);
  }, [articleId, fetchComments, sortKey]);

  useEffect(() => {
    if (!hasHandledRefreshSignalRef.current) {
      hasHandledRefreshSignalRef.current = true;
      return;
    }

    fetchComments(1, true, sortKey, { showLoadingState: false });
  }, [fetchComments, refreshSignal, sortKey]);

  const handleLoadMore = () => {
    if (!loading && hasMore && !loadingRef.current) {
      fetchComments(currentPage + 1, false, sortKey);
    }
  };

  const handleSortKeyChange = (key: CommentSortKey) => {
    if (onSortKeyChange) {
      onSortKeyChange(key);
      return;
    }
    setInternalSortKey(key);
  };

  const renderItem: ListRenderItem<
    CommentControllerFindAll200ResponseDataDataInner
  > = ({ item }) => (
    <CommentItem
      data={item}
      articleId={articleId}
      articleAuthorId={articleAuthorId}
    />
  );

  const renderEmpty = useCallback(
    () => (
      <CommentListEmptyState
        loading={loading}
        initialized={hasInitializedRef.current}
        error={error}
        onRetry={() => fetchComments(1, true, sortKey)}
        skeleton={<CommentListSkeleton />}
      />
    ),
    [error, fetchComments, loading, sortKey],
  );

  const renderFooter = useCallback(
    () => (
      <CommentListFooterState
        hasItems={comments.length > 0}
        loading={loading}
        hasMore={hasMore}
      />
    ),
    [comments.length, hasMore, loading],
  );

  return (
    <View style={styles.wrapper}>
      {!hideHeader && (
        <ArticleCommentListLabel
          sortKey={sortKey}
          onSortKeyChange={handleSortKeyChange}
        />
      )}
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={1}
        scrollEnabled={false}
        nestedScrollEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    overflow: "visible",
  },
  sortBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,

    position: "relative",
    zIndex: 10,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
  },
  sortPicker: {
    position: "absolute",
    top: 34,
    left: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 4,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 16,
    zIndex: 9999,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 12,
  },
});
