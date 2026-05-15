import { Avatar } from "@/components/ui/Avatar";
import LoadingWidget from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { IdCard, MessageSquareText, PencilLine } from "lucide-react-native";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Animated,
    FlatList,
    ListRenderItem,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
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

const SCENE_ITEMS = [{ key: "content" }];

type ProfileTabRoute = (typeof TAB_ROUTES)[number];

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList as new (props: any) => FlatList<{ key: string }>,
);

interface ProfileDetailsProps {
  profile: ReturnType<typeof useProfileContext>["profile"];
  avatarFrameUri: string | undefined;
  displayName: string;
  description: string;
  stats: ReturnType<typeof useProfileContext>["stats"];
}

function ProfileDetails({
  profile,
  avatarFrameUri,
  displayName,
  description,
  stats,
}: ProfileDetailsProps) {
  const { theme, colors } = useTheme();

  return (
    <View style={[styles.profileSheet, { backgroundColor: theme.card }]}>
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

      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View key={item.label} style={styles.statItem}>
            <ThemedText fontWeight="700">{item.value}</ThemedText>
            <ThemedText color={theme.secondary}>{item.label}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

interface ProfileTabsBarProps {
  tabIndex: number;
  onPressTab: (index: number) => void;
}

function ProfileTabsBar({ tabIndex, onPressTab }: ProfileTabsBarProps) {
  const { theme, colors } = useTheme();

  return (
    <View
      style={[
        styles.primaryTabsRow,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
        },
      ]}
    >
      {TAB_ROUTES.map((route, index) => {
        const active = index === tabIndex;
        return (
          <Pressable
            key={route.key}
            onPress={() => onPressTab(index)}
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
  );
}

interface ProfileSceneProps {
  route: ProfileTabRoute;
  tabViewHeight: number;
  isActive: boolean;
  initialOffset: number;
  onOffsetChange: (routeKey: string, offset: number) => void;
  onListRefChange: (
    routeKey: string,
    ref: FlatList<{ key: string }> | null,
  ) => void;
}

function ProfileScene({
  route,
  tabViewHeight,
  isActive,
  initialOffset,
  onOffsetChange,
  onListRefChange,
}: ProfileSceneProps) {
  const { theme } = useTheme();
  const listRef = useRef<FlatList<{ key: string }> | null>(null);
  const wasActiveRef = useRef(isActive);

  useEffect(() => {
    onListRefChange(route.key, listRef.current);
    return () => {
      onListRefChange(route.key, null);
    };
  }, [onListRefChange, route.key]);

  useEffect(() => {
    if (isActive && !wasActiveRef.current && listRef.current) {
      listRef.current.scrollToOffset({
        offset: initialOffset,
        animated: false,
      });
    }
    wasActiveRef.current = isActive;
  }, [initialOffset, isActive]);

  const renderItem: ListRenderItem<{ key: string }> = useCallback(() => {
    return (
      <View style={[styles.tabContent, { backgroundColor: theme.card }]}>
        <ThemedText color={theme.secondary}>{route.title} 内容占位</ThemedText>
      </View>
    );
  }, [route.title, theme.card, theme.secondary]);

  return (
    <AnimatedFlatList
      ref={(ref) => {
        listRef.current = ref as FlatList<{ key: string }> | null;
      }}
      style={styles.flex1}
      data={SCENE_ITEMS}
      keyExtractor={(item: { key: string }) => item.key}
      renderItem={renderItem}
      nestedScrollEnabled
      contentContainerStyle={[
        styles.listContent,
        { minHeight: tabViewHeight + styles.listContent.paddingBottom },
      ]}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
        onOffsetChange(route.key, event.nativeEvent.contentOffset.y);
      }}
    />
  );
}

export default function ProfileIndexScreen() {
  const layout = useWindowDimensions();
  const {
    profile,
    loading,
    displayName,
    avatarFrameUri,
    description,
    stats,
    scrollY,
    heroMinHeight,
  } = useProfileContext();

  const [tabIndex, setTabIndex] = useState(0);
  const [tabBarHeight, setTabBarHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const routeOffsetsRef = useRef<Record<string, number>>(
    Object.fromEntries(TAB_ROUTES.map((route) => [route.key, 0])),
  );
  const listRefs = useRef<Record<string, FlatList<{ key: string }> | null>>(
    Object.fromEntries(TAB_ROUTES.map((route) => [route.key, null])),
  );

  const headerSpacerHeight = useMemo(
    () => Math.max(HERO_HEIGHT - heroMinHeight - 28, 0),
    [heroMinHeight],
  );

  const tabViewHeight = useMemo(
    () => Math.max(layout.height - heroMinHeight - tabBarHeight, 1),
    [heroMinHeight, layout.height, tabBarHeight],
  );

  const handleOffsetChange = useCallback((routeKey: string, offset: number) => {
    routeOffsetsRef.current[routeKey] = offset;
  }, []);

  const handleListRefChange = useCallback(
    (routeKey: string, ref: FlatList<{ key: string }> | null) => {
      listRefs.current[routeKey] = ref;
    },
    [],
  );

  const handleTabIndexChange = useCallback((nextIndex: number) => {
    setTabIndex(nextIndex);
  }, []);

  const renderScene = useCallback(
    ({ route }: { route: ProfileTabRoute }) => (
      <ProfileScene
        route={route}
        tabViewHeight={tabViewHeight}
        isActive={route.key === TAB_ROUTES[tabIndex].key}
        initialOffset={routeOffsetsRef.current[route.key] ?? 0}
        onOffsetChange={handleOffsetChange}
        onListRefChange={handleListRefChange}
      />
    ),
    [handleListRefChange, handleOffsetChange, tabIndex, tabViewHeight],
  );

  if (loading) {
    return <LoadingWidget loading />;
  }

  return (
    <View style={[styles.flex1, { marginTop: heroMinHeight }]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.flex1}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <View style={{ height: headerSpacerHeight }} />
        <View>
          <ProfileDetails
            profile={profile}
            avatarFrameUri={avatarFrameUri}
            displayName={displayName}
            description={description}
            stats={stats}
          />
        </View>
        <View
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            if (nextHeight !== tabBarHeight) {
              setTabBarHeight(nextHeight);
            }
          }}
        >
          <ProfileTabsBar
            tabIndex={tabIndex}
            onPressTab={handleTabIndexChange}
          />
        </View>

        <View style={{ height: tabViewHeight }}>
          <TabView
            style={styles.flex1}
            navigationState={{ index: tabIndex, routes: TAB_ROUTES }}
            renderScene={renderScene}
            renderTabBar={() => null}
            onIndexChange={handleTabIndexChange}
            initialLayout={{ width: layout.width }}
            swipeEnabled
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
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
});
