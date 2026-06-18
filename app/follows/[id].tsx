import type { UserControllerGetFollowers200ResponseDataDataInner } from "@/api";
import { api, isAuthRedirectedError } from "@/api";
import FollowedCard from "@/components/profile/FollowedCard";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type FollowUser = UserControllerGetFollowers200ResponseDataDataInner;
type FollowType = "following" | "followers";

const PAGE_SIZE = 20;

export default function FollowsScreen() {
  const { id, type } = useLocalSearchParams<{ id?: string; type?: string }>();
  const userId = Array.isArray(id) ? id[0] : id;
  const followType: FollowType =
    type === "followers" ? "followers" : "following";

  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const currentUserId = useAuthStore((s) => s.profile?.id ?? s.user?.id);

  const [items, setItems] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [followLoadingId, setFollowLoadingId] = useState<number | null>(null);
  const loadingRef = useRef(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        followType === "followers"
          ? t("followsPage.followersTitle")
          : t("followsPage.followingTitle"),
    });
  }, [navigation, t, followType]);

  const fetchPage = useCallback(
    async (nextPage: number, replace: boolean) => {
      if (!userId || loadingRef.current) return;
      loadingRef.current = true;
      if (replace) setRefreshing(true);
      else setLoading(true);
      try {
        const fetcher =
          followType === "followers"
            ? api.userControllerGetFollowers
            : api.userControllerGetFollowings;
        const { data } = await fetcher(String(userId), nextPage, PAGE_SIZE);
        const list = data.data.data ?? [];
        const meta = data.data.meta;
        setItems((prev) => (replace ? list : [...prev, ...list]));
        setPage(nextPage);
        setHasMore(nextPage < (meta?.totalPages ?? nextPage));
      } catch (error) {
        if (!isAuthRedirectedError(error)) {
          toast.show(t("article.actionFailed"));
        }
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId, followType, t],
  );

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const handleRefresh = useCallback(() => {
    setHasMore(true);
    fetchPage(1, true);
  }, [fetchPage]);

  const handleEndReached = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    fetchPage(page + 1, false);
  }, [fetchPage, hasMore, page]);

  const handlePressUser = useCallback((id: number) => {
    router.push({ pathname: "/user/[id]", params: { id: String(id) } });
  }, []);

  const handleToggleFollow = useCallback(
    async (targetId: number, nextFollowed: boolean) => {
      setFollowLoadingId(targetId);
      setItems((prev) =>
        prev.map((u) =>
          u.id === targetId ? { ...u, isFollowed: nextFollowed } : u,
        ),
      );
      try {
        if (nextFollowed) {
          await api.userControllerFollow(String(targetId));
        } else {
          await api.userControllerUnfollow(String(targetId));
        }
      } catch (error) {
        setItems((prev) =>
          prev.map((u) =>
            u.id === targetId ? { ...u, isFollowed: !nextFollowed } : u,
          ),
        );
        if (!isAuthRedirectedError(error)) {
          toast.show(t("article.actionFailed"));
        }
      } finally {
        setFollowLoadingId(null);
      }
    },
    [t],
  );

  const renderItem = useCallback(
    ({ item }: { item: FollowUser }) => (
      <FollowedCard
        data={item}
        showFollowButton={
          currentUserId == null || Number(item.id) !== Number(currentUserId)
        }
        followLoading={followLoadingId === item.id}
        onToggleFollow={handleToggleFollow}
        onPressUser={handlePressUser}
      />
    ),
    [currentUserId, followLoadingId, handleToggleFollow, handlePressUser],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.card }]}
      edges={["bottom", "left", "right"]}
    >
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) },
          items.length === 0 && styles.emptyContent,
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading || refreshing ? null : (
            <View style={styles.empty}>
              <ThemedText size={14} color={theme.secondary}>
                {followType === "followers"
                  ? t("followsPage.emptyFollowers")
                  : t("followsPage.emptyFollowing")}
              </ThemedText>
            </View>
          )
        }
        ListFooterComponent={
          loading && items.length > 0 ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={theme.secondary} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 8 },
  emptyContent: { flexGrow: 1 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
