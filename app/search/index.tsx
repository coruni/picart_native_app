import type {
  ArticleControllerFindAll200ResponseDataDataInner,
  ArticleControllerSearchSortByEnum,
  TagControllerFindAll200ResponseDataDataInner,
  UserControllerFindAll200ResponseDataDataInner,
} from "@/api";
import { api } from "@/api";
import ArticleSearchCard from "@/components/article/ArticleSearchCard";
import OptionPickerSheet, {
  type OptionPickerSheetRef,
  type PickerOption,
} from "@/components/search/OptionPickerSheet";
import TopicListItem, {
  TopicListItemSkeleton,
} from "@/components/topic/TopicListItem";
import ThemedText from "@/components/ui/ThemedText";
import UserSearchCard from "@/components/user/UserSearchCard";
import { useConfirm } from "@/hooks/useConfirm";
import { useTheme } from "@/hooks/useTheme";
import { getCachedCategories } from "@/store/categoryStore";
import {
  addSearchHistory,
  clearSearchHistory,
  getSearchHistory,
  removeSearchHistory,
} from "@/utils/searchHistory";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ChevronDown,
  ChevronLeft,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

type Topic = TagControllerFindAll200ResponseDataDataInner;
type Article = ArticleControllerFindAll200ResponseDataDataInner;
type User = UserControllerFindAll200ResponseDataDataInner;
type SortValue = ArticleControllerSearchSortByEnum;

const PAGE_SIZE = 20;
const RECOMMEND_LIMIT = 20;
const HOT_LIMIT = 5;
const INACTIVE_COLOR = "#666";
const ALL_CATEGORY = "all";
const CONTENT_TOP_RADIUS = 20;

const SORT_VALUES: SortValue[] = ["relevance", "latest", "views", "likes"];

/** 帖子结果列表：articleControllerSearch，支持排序 + 分类 */
function ArticleResults({
  keyword,
  sort,
  categoryId,
}: {
  keyword: string;
  sort: SortValue;
  categoryId?: number;
}) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const fetchData = useCallback(
    async (isRefresh: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      if (isRefresh) {
        pageRef.current = 1;
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const { data: res } = await api.articleControllerSearch(
          keyword,
          pageRef.current,
          PAGE_SIZE,
          categoryId,
          sort,
        );
        const list = res.data?.data ?? [];
        setItems((prev) => {
          if (isRefresh) return list;
          const ids = new Set(prev.map((a) => a.id));
          return [...prev, ...list.filter((a) => !ids.has(a.id))];
        });
        setHasMore(list.length >= PAGE_SIZE);
        if (list.length > 0) pageRef.current += 1;
      } catch {
        if (isRefresh) setItems([]);
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [keyword, sort, categoryId],
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.skeletonWrap}>
        {Array.from({ length: 4 }).map((_, index) => (
          <TopicListItemSkeleton key={index} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ArticleSearchCard data={item} keyword={keyword} />
      )}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      onEndReachedThreshold={0.6}
      onEndReached={() => {
        if (!loadingRef.current && hasMore) fetchData(false);
      }}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <ThemedText size={14} color={theme.secondary}>
            {t("noContent")}
          </ThemedText>
        </View>
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            color={colors.primary}
            style={styles.footerLoading}
          />
        ) : null
      }
    />
  );
}

/** 话题结果列表：tagControllerFindAll(name) */
function TopicResults({ keyword }: { keyword: string }) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const [items, setItems] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const fetchData = useCallback(
    async (isRefresh: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      if (isRefresh) {
        pageRef.current = 1;
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const { data: res } = await api.tagControllerFindAll(
          pageRef.current,
          PAGE_SIZE,
          keyword,
        );
        const list = res.data?.data ?? [];
        setItems((prev) => {
          if (isRefresh) return list;
          const ids = new Set(prev.map((a) => a.id));
          return [...prev, ...list.filter((a) => !ids.has(a.id))];
        });
        setHasMore(list.length >= PAGE_SIZE);
        if (list.length > 0) pageRef.current += 1;
      } catch {
        if (isRefresh) setItems([]);
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [keyword],
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.skeletonWrap}>
        {Array.from({ length: 4 }).map((_, index) => (
          <TopicListItemSkeleton key={index} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <TopicListItem topic={item} compact />}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      onEndReachedThreshold={0.6}
      onEndReached={() => {
        if (!loadingRef.current && hasMore) fetchData(false);
      }}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <ThemedText size={14} color={theme.secondary}>
            {t("noContent")}
          </ThemedText>
        </View>
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            color={colors.primary}
            style={styles.footerLoading}
          />
        ) : null
      }
    />
  );
}

/** 用户结果列表：userControllerFindAll(keyword) */
function UserResults({ keyword }: { keyword: string }) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const fetchData = useCallback(
    async (isRefresh: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      if (isRefresh) {
        pageRef.current = 1;
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const { data: res } = await api.userControllerFindAll(
          pageRef.current,
          PAGE_SIZE,
          undefined,
          keyword,
        );
        const list = res.data?.data ?? [];
        setItems((prev) => {
          if (isRefresh) return list;
          const ids = new Set(prev.map((a) => a.id));
          return [...prev, ...list.filter((a) => !ids.has(a.id))];
        });
        setHasMore(list.length >= PAGE_SIZE);
        if (list.length > 0) pageRef.current += 1;
      } catch {
        if (isRefresh) setItems([]);
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [keyword],
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.skeletonWrap}>
        {Array.from({ length: 4 }).map((_, index) => (
          <TopicListItemSkeleton key={index} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <UserSearchCard data={item} keyword={keyword} />
      )}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      onEndReachedThreshold={0.6}
      onEndReached={() => {
        if (!loadingRef.current && hasMore) fetchData(false);
      }}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <ThemedText size={14} color={theme.secondary}>
            {t("noContent")}
          </ThemedText>
        </View>
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            color={colors.primary}
            style={styles.footerLoading}
          />
        ) : null
      }
    />
  );
}

export default function SearchScreen() {
  const { theme, isDark, colors } = useTheme();
  const { t } = useTranslation();
  const { confirm } = useConfirm();
  const layout = useWindowDimensions();

  const [keyword, setKeyword] = useState("");
  // 已提交的搜索关键词（驱动结果列表，避免每次输入都打请求）
  const [submitted, setSubmitted] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hotWords, setHotWords] = useState<string[]>([]);
  const [recommendTopics, setRecommendTopics] = useState<Topic[]>([]);
  const [recommendLoading, setRecommendLoading] = useState(true);

  const [tabIndex, setTabIndex] = useState(0);
  const [sort, setSort] = useState<SortValue>("relevance");
  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORY);

  const sortSheetRef = useRef<OptionPickerSheetRef>(null);
  const categorySheetRef = useRef<OptionPickerSheetRef>(null);

  const isSearchMode = submitted.length > 0;

  // 搜索模式下顶部为 primary 深色背景，状态栏用 light；离开页面还原主题默认
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle(isSearchMode ? "light" : isDark ? "light" : "dark");
      return () => {
        StatusBar.setStyle(isDark ? "light" : "dark");
      };
    }, [isDark, isSearchMode]),
  );

  const categories = getCachedCategories() ?? [];

  const routes = useMemo(
    () => [
      { key: "article", title: t("searchTabs.article") },
      { key: "topic", title: t("searchTabs.topic") },
      { key: "user", title: t("searchTabs.user") },
    ],
    [t],
  );

  const sortOptions = useMemo<PickerOption[]>(
    () =>
      SORT_VALUES.map((value) => ({
        value,
        label: t(`searchSort.${value}`),
      })),
    [t],
  );

  const categoryOptions = useMemo<PickerOption[]>(
    () => [
      { value: ALL_CATEGORY, label: t("searchCategory.all") },
      ...categories.map((c) => ({ value: String(c.id), label: c.name })),
    ],
    [categories, t],
  );

  const categoryLabel = useMemo(() => {
    if (categoryId === ALL_CATEGORY) return t("searchCategory.all");
    return (
      categories.find((c) => String(c.id) === categoryId)?.name ??
      t("searchCategory.all")
    );
  }, [categoryId, categories, t]);

  // 初始数据：历史、热门、推荐话题
  useEffect(() => {
    void getSearchHistory().then(setHistory);

    api
      .articleControllerFindHotSearch(HOT_LIMIT)
      .then((res) => {
        const words = res.data?.data?.data?.map((k) => k.keyword) ?? [];
        setHotWords(words);
      })
      .catch(() => { });

    api
      .tagControllerFindAll(1, RECOMMEND_LIMIT, undefined, "hot", "DESC")
      .then((res) => {
        setRecommendTopics(res.data?.data?.data ?? []);
      })
      .catch(() => { })
      .finally(() => setRecommendLoading(false));
  }, []);

  const submitSearch = useCallback((word: string) => {
    const next = word.trim();
    if (!next) return;
    setKeyword(next);
    setSubmitted(next);
    Keyboard.dismiss();
    void addSearchHistory(next).then(setHistory);
  }, []);

  const handleChangeText = useCallback((text: string) => {
    setKeyword(text);
    // 清空输入即退出搜索态，回到初始页
    if (text.trim().length === 0) setSubmitted("");
  }, []);

  const handleRemoveHistory = useCallback(async (word: string) => {
    const next = await removeSearchHistory(word);
    setHistory(next);
  }, []);

  const handleClearHistory = useCallback(() => {
    confirm({
      title: t("history.clearTitle"),
      message: t("history.clearMessage"),
      confirmText: t("history.clearConfirm"),
      onConfirm: async () => {
        await clearSearchHistory();
        setHistory([]);
      },
    });
  }, [confirm, t]);

  const numericCategoryId =
    categoryId === ALL_CATEGORY ? undefined : Number(categoryId);

  const renderScene = useMemo(
    () =>
      SceneMap({
        article: () => (
          <ArticleResults
            keyword={submitted}
            sort={sort}
            categoryId={numericCategoryId}
          />
        ),
        topic: () => <TopicResults keyword={submitted} />,
        user: () => <UserResults keyword={submitted} />,
      }),
    [submitted, sort, numericCategoryId],
  );

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      style={[
        styles.tabBar,
        { backgroundColor: theme.card, borderBottomColor: theme.border },
      ]}
      tabStyle={styles.tabStyle}
      renderIndicator={({ getTabWidth }: any) => {
        const inputRange = routes.map((_, i) => i);
        const outputRange = inputRange.map((i) => {
          let offset = 0;
          for (let j = 0; j < i; j++) offset += getTabWidth(j);
          return offset + getTabWidth(i) / 2 - 10;
        });
        const translateX =
          inputRange.length >= 2
            ? props.position.interpolate({ inputRange, outputRange })
            : (outputRange[0] ?? 0);
        return (
          <Animated.View
            style={[styles.tabIndicator, { transform: [{ translateX }] }]}
          />
        );
      }}
      renderTabBarItem={({ route, onPress, onLayout }: any) => {
        const routeIndex = routes.findIndex((r) => r.key === route.key);
        const isFocused = tabIndex === routeIndex;
        return (
          <Pressable
            key={route.key}
            onLayout={onLayout}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Animated.Text
              style={[
                styles.tabLabel,
                { color: isFocused ? colors.primary : theme.secondary },
              ]}
            >
              {route.title}
            </Animated.Text>
          </Pressable>
        );
      }}
    />
  );

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, { backgroundColor: isSearchMode ? theme.primary : theme.card }]}
    >
      {/* 顶部搜索栏 */}
      <View
        style={[
          styles.searchHeader,

        ]}
      >
        <Pressable
          hitSlop={8}
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ChevronLeft size={28} color={isSearchMode ? theme.card : theme.foreground} />
        </Pressable>

        <View
          style={[
            styles.inputWrap,
            { backgroundColor: theme.secondaryBackground },
          ]}
        >
          {/* 分类下拉 */}
          <Pressable
            style={styles.categoryBtn}
            hitSlop={6}
            onPress={() => {
              Keyboard.dismiss();
              categorySheetRef.current?.present();
            }}
          >
            <ThemedText
              size={13}
              color={theme.foreground}
              numberOfLines={1}
              style={styles.categoryLabel}
            >
              {categoryLabel}
            </ThemedText>
            <ChevronDown size={14} color={theme.secondary} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TextInput
            value={keyword}
            onChangeText={handleChangeText}
            autoFocus
            placeholder={t("search.placeholder")}
            cursorColor={theme.primary}
            selectionColor={theme.primary}
            placeholderTextColor={theme.secondary}
            returnKeyType="search"
            onSubmitEditing={() => submitSearch(keyword)}
            style={[styles.input, { color: theme.foreground }]}
          />
          {keyword.length > 0 ? (
            <Pressable
              hitSlop={8}
              onPress={() => {
                setKeyword("");
                setSubmitted("");
              }}
            >
              <Ionicons name="close-circle" size={18} color={theme.secondary} />
            </Pressable>
          ) : null}
        </View>

        <Pressable
          onPress={() => submitSearch(keyword)}
          style={[styles.searchBtn, { backgroundColor: theme.foreground }]}
        >
          <Ionicons name="search" size={18} color={theme.card} />
        </Pressable>
      </View>

      {isSearchMode ? (
        <View
          style={[styles.flex1, { backgroundColor: theme.primary }]}
        >
          {/* tab 栏 + 排序入口（仅帖子 tab 显示排序） */}
          <View
            style={[
              styles.tabRow,
              {
                backgroundColor: theme.card,
                borderTopLeftRadius: CONTENT_TOP_RADIUS,
                borderTopRightRadius: CONTENT_TOP_RADIUS,
                overflow: "hidden",
              },
            ]}
          >
            <View style={styles.flex1}>
              <TabView
                navigationState={{ index: tabIndex, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setTabIndex}
                initialLayout={{ width: layout.width }}
                swipeEnabled
              />
            </View>
          </View>

          {/* 帖子 tab 的悬浮排序按钮 */}
          {tabIndex === 0 ? (
            <Pressable
              style={[
                styles.sortFab,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => {
                Keyboard.dismiss();
                sortSheetRef.current?.present();
              }}
            >
              <SlidersHorizontal size={15} color={theme.foreground} />
              <ThemedText size={12} color={theme.foreground}>
                {t(`searchSort.${sort}`)}
              </ThemedText>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.initialContent}
        >
          {/* 搜索历史 */}
          {history.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={theme.secondary}
                />
                <ThemedText
                  size={15}
                  fontWeight="600"
                  color={theme.foreground}
                  style={styles.sectionTitleWithIcon}
                >
                  {t("search.history")}
                </ThemedText>
                <Pressable hitSlop={8} onPress={handleClearHistory}>
                  <Trash2 size={17} color={theme.secondary} />
                </Pressable>
              </View>
              <View style={styles.chipRow}>
                {history.map((word) => (
                  <Pressable
                    key={word}
                    onPress={() => submitSearch(word)}
                    style={[
                      styles.historyChip,
                      { backgroundColor: theme.muted },
                    ]}
                  >
                    <ThemedText size={13} color={theme.foreground}>
                      {word}
                    </ThemedText>
                    <Pressable
                      hitSlop={6}
                      onPress={() => handleRemoveHistory(word)}
                    >
                      <X size={13} color={theme.secondary} />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* 热门搜索 */}
          {hotWords.length > 0 ? (
            <View style={styles.section}>
              <ThemedText
                size={16}
                fontWeight="700"
                color={theme.foreground}
                style={styles.sectionTitle}
              >
                {t("search.hotSearch")}
              </ThemedText>
              <View style={styles.chipRow}>
                {hotWords.map((word) => (
                  <Pressable
                    key={word}
                    onPress={() => submitSearch(word)}
                    style={[styles.hotChip, { backgroundColor: theme.muted }]}
                  >
                    <ThemedText size={13} color={theme.foreground}>
                      {word}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* 推荐的话题 */}
          <View style={styles.section}>
            <ThemedText
              size={16}
              fontWeight="700"
              color={theme.foreground}
              style={styles.sectionTitle}
            >
              {t("search.recommendTopics")}
            </ThemedText>
            {recommendLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                <TopicListItemSkeleton key={index} />
              ))
              : recommendTopics.map((topic) => (
                <TopicListItem key={topic.id} topic={topic} showChevron />
              ))}
          </View>
        </ScrollView>
      )}

      <OptionPickerSheet
        ref={sortSheetRef}
        scrollable={false}
        title={t("searchSort.title")}
        options={sortOptions}
        selectedValue={sort}
        onSelect={(value) => setSort(value as SortValue)}
      />
      <OptionPickerSheet
        ref={categorySheetRef}
        title={t("searchCategory.title")}
        options={categoryOptions}
        selectedValue={categoryId}
        onSelect={setCategoryId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  backBtn: {
    width: 32,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    gap: 6,
  },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    maxWidth: 96,
  },
  categoryLabel: {
    flexShrink: 1,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 18,
    marginHorizontal: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabRow: {
    flex: 1,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 4,
  },
  tabStyle: {
    width: "auto",
    minWidth: 60,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6680ff",
  },
  sortFab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  skeletonWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  footerLoading: {
    paddingVertical: 16,
  },
  initialContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionTitleWithIcon: {
    flex: 1,
    marginLeft: 6,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  historyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  hotChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  emptyWrap: {
    paddingTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
