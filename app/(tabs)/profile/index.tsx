import { Avatar } from "@/components/ui/Avatar";
import LoadingWidget from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { IdCard, MessageSquareText, PencilLine } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
    Animated,
    FlatList,
    Pressable,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { TabView } from "react-native-tab-view";
import { HERO_HEIGHT, useProfileContext } from "./_layout";

const TAB_ROUTES = [
  { key: "posts", title: "帖子" },
  { key: "comments", title: "评论" },
  { key: "favorites", title: "收藏" },
  { key: "topics", title: "话题" },
  { key: "history", title: "我看过的" },
];

const PLACEHOLDER_DATA = [{ key: "content" }];

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList as new (props: any) => FlatList<{ key: string }>,
);

export default function ProfileIndexScreen() {
  const { theme, colors } = useTheme();
  const layout = useWindowDimensions();
  const {
    profile,
    loading,
    displayName,
    avatarFrameUri,
    description,
    stats,
    scrollY,
  } = useProfileContext();

  const [tabIndex, setTabIndex] = useState(0);

  // ── 资料卡头部（FlatList ListHeaderComponent） ──────────────────────────────
  const ProfileHeader = useMemo(
    () => (
      <View style={[styles.profileSheet, { backgroundColor: theme.card }]}>
        {/* 头像行 */}
        <View style={styles.profileHeaderRow}>
          <View style={styles.avatarSlot}>
            <Avatar
              uri={profile?.avatar}
              avatarFrameUri={avatarFrameUri}
              size={96}
              border
              rounded
            />
          </View>
          <Pressable
            style={[styles.editButton, { borderColor: colors.primary }]}
            hitSlop={8}
          >
            <PencilLine size={16} color={colors.primary} />
            <ThemedText fontWeight="600" color={colors.primary}>
              编辑
            </ThemedText>
          </Pressable>
        </View>

        {/* 身份信息 */}
        <View style={styles.identityWrap}>
          <View style={styles.nameRow}>
            <ThemedText fontWeight="800">{displayName}</ThemedText>
            {!!profile?.membershipLevelName && (
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: theme.secondaryBackground },
                ]}
              >
                <ThemedText fontWeight="700" color={colors.primary}>
                  {profile.membershipLevelName}
                </ThemedText>
              </View>
            )}
          </View>
          <View style={styles.metaLine}>
            <IdCard size={14} color={colors.primary} />
            <ThemedText color={theme.foreground}>
              通行证ID: {profile?.id ?? "--"}
            </ThemedText>
          </View>
          <View style={styles.metaLine}>
            <MessageSquareText size={14} color={theme.secondary} />
            <ThemedText color={theme.secondary}>{description}</ThemedText>
          </View>
        </View>

        {/* 统计 */}
        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statItem}>
              <ThemedText fontWeight="700">{item.value}</ThemedText>
              <ThemedText color={theme.secondary}>{item.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* Tab 栏 */}
        <View
          style={[styles.primaryTabsRow, { borderBottomColor: theme.border }]}
        >
          {TAB_ROUTES.map((route, index) => {
            const active = index === tabIndex;
            return (
              <Pressable
                key={route.key}
                onPress={() => setTabIndex(index)}
                style={styles.primaryTabButton}
              >
                <ThemedText
                  fontWeight={active ? "700" : "500"}
                  color={active ? theme.foreground : theme.secondary}
                >
                  {route.title}
                </ThemedText>
                {active && (
                  <View
                    style={[
                      styles.primaryTabIndicator,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    ),

    [
      theme,
      colors,
      profile,
      displayName,
      avatarFrameUri,
      description,
      stats,
      tabIndex,
    ],
  );

  // ── 当前 Tab 占位内容（后续替换为真实列表组件） ─────────────────────────
  const renderItem = useCallback(
    () => (
      <View style={[styles.tabContent, { backgroundColor: theme.card }]}>
        <ThemedText color={theme.secondary}>
          {TAB_ROUTES[tabIndex].title} 内容占位
        </ThemedText>
      </View>
    ),
    [theme, tabIndex],
  );

  // ── TabView 横划手势层（scene 透明 pointerEvents=none，不拦截纵向滚动） ─────
  const renderScene = useCallback(
    () => <View style={styles.swipeOverlayScene} pointerEvents="none" />,
    [],
  );

  if (loading) {
    return <LoadingWidget loading />;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {/*
       * 唯一纵向滚动源：Animated.FlatList
       * - ListHeaderComponent = 资料卡（头像 / 资料 / 统计 / Tab 栏）
       * - renderItem = 当前 Tab 占位内容
       * - onScroll 驱动 _layout.tsx 里的 heroAnimHeight
       */}
      <AnimatedFlatList
        style={StyleSheet.absoluteFill}
        data={PLACEHOLDER_DATA}
        keyExtractor={(item: { key: string }) => item.key}
        renderItem={renderItem}
        ListHeaderComponent={ProfileHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      />

      {/*
       * TabView 横划手势层
       * - 覆盖在 FlatList 上方，scene 为透明 pointerEvents=none
       * - 仅捕获水平 swipe 来切换 tabIndex，纵向滚动穿透到 FlatList
       */}
      <TabView
        style={StyleSheet.absoluteFill}
        navigationState={{ index: tabIndex, routes: TAB_ROUTES }}
        renderScene={renderScene}
        renderTabBar={() => null}
        onIndexChange={setTabIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: HERO_HEIGHT - 28,
    paddingBottom: 48,
  },
  profileSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  avatarSlot: {
    marginTop: -60,
  },
  editButton: {
    marginTop: 4,
    height: 32,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  identityWrap: {
    marginTop: 12,
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  levelBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  primaryTabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  primaryTabButton: {
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  primaryTabIndicator: {
    position: "absolute",
    bottom: 0,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  tabContent: {
    minHeight: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeOverlayScene: {
    flex: 1,
  },
});
