import { api, ArticleControllerFindAll200Response } from "@/api";
import HugeIcon from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { normalizeImageUrl } from "@/lib/image";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type InlinePost = ArticleControllerFindAll200Response["data"]["data"][number];

export type InlinePostSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type InlinePostSheetProps = {
  /**
   * 确认插入：帖子走内部链接，直接粘贴的地址走外部链接。
   * 两者可能同时存在，交给调用方决定怎么落进正文。
   */
  onConfirm: (payload: { posts: InlinePost[]; link: string }) => void;
  onDismiss?: () => void;
};

const PAGE_SIZE = 20;

/**
 * 内联帖子选择面板。
 * 顶部输入外链，左侧从「我的帖子」里挑，右侧是已选，底部确认插入。
 */
const InlinePostSheet = forwardRef<InlinePostSheetRef, InlinePostSheetProps>(
  function InlinePostSheet({ onConfirm, onDismiss }, ref) {
    const { theme, colors } = useTheme();
    const { t } = useTranslation();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheetModal>(null);

    const [link, setLink] = useState("");
    const [posts, setPosts] = useState<InlinePost[]>([]);
    const [selected, setSelected] = useState<InlinePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const snapPoints = useMemo(() => ["62%"], []);

    const loadPosts = useCallback(async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data: res } = await api.articleControllerFindByAuthor(
          String(user.id),
          1,
          PAGE_SIZE,
        );
        setPosts(res.data.data ?? []);
        setLoaded(true);
      } catch (error) {
        console.error("InlinePostSheet loadPosts:", error);
      } finally {
        setLoading(false);
      }
    }, [user?.id]);

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          sheetRef.current?.present();
          if (!loaded && !loading) void loadPosts();
        },
        dismiss: () => sheetRef.current?.dismiss(),
      }),
      [loadPosts, loaded, loading],
    );

    const togglePost = useCallback((post: InlinePost) => {
      setSelected((prev) =>
        prev.some((item) => item.id === post.id)
          ? prev.filter((item) => item.id !== post.id)
          : [...prev, post],
      );
    }, []);

    const handleConfirm = useCallback(() => {
      onConfirm({ posts: selected, link: link.trim() });
      sheetRef.current?.dismiss();
    }, [link, onConfirm, selected]);

    const renderBackdrop = useCallback(
      (props: ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.4}
          pressBehavior="close"
        />
      ),
      [],
    );

    const canConfirm = selected.length > 0 || link.trim().length > 0;

    return (
      <BottomSheetModal
        ref={sheetRef}
        name="inlinePost"
        // 固定档位 + flex 布局：BottomSheetScrollView 需要确定高度才量得出来，
        // 用动态高度会让整块塌成 0，面板直接不可见
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        stackBehavior="switch"
        keyboardBehavior="interactive"
        keyboardBlurBehavior="none"
        android_keyboardInputMode="adjustResize"
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.card }}
        handleIndicatorStyle={{ backgroundColor: theme.border }}
        onDismiss={() => {
          setLink("");
          setSelected([]);
          onDismiss?.();
        }}
      >
        <BottomSheetView
          style={[styles.root, { paddingBottom: insets.bottom + 12 }]}
        >
          <View style={styles.header}>
            <ThemedText size={15} fontWeight="600">
              {t("publish.editor.inlineArticle")}
            </ThemedText>
            <ThemedText size={12} color={theme.mutedForeground}>
              {t("publish.editor.inlinePostHint")}
            </ThemedText>
          </View>

          {/* 顶部输入外链 */}
          <View
            style={[
              styles.linkRow,
              { backgroundColor: theme.muted, borderColor: theme.border },
            ]}
          >
            <HugeIcon
              icon={Link01Icon}
              size={16}
              color={theme.mutedForeground}
            />
            <BottomSheetTextInput
              style={[styles.linkInput, { color: theme.foreground }]}
              value={link}
              onChangeText={setLink}
              placeholder={t("publish.editor.inlinePostLinkPlaceholder")}
              placeholderTextColor={theme.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>

          <View style={styles.columns}>
            {/* 左：我的帖子 */}
            <View style={styles.column}>
              <ThemedText size={12} color={theme.mutedForeground}>
                {t("publish.editor.myPosts")}
              </ThemedText>
              <BottomSheetScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
              >
                {posts.map((post) => {
                  const active = selected.some((item) => item.id === post.id);
                  return (
                    <Pressable
                      key={post.id}
                      onPress={() => togglePost(post)}
                      style={[
                        styles.postRow,
                        {
                          backgroundColor: active ? theme.muted : "transparent",
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      {post.cover ? (
                        <Image
                          source={{ uri: normalizeImageUrl(post.cover) }}
                          style={styles.postCover}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.postCover,
                            { backgroundColor: theme.muted },
                          ]}
                        />
                      )}
                      <ThemedText size={12} numberOfLines={2} style={styles.postTitle}>
                        {post.title}
                      </ThemedText>
                    </Pressable>
                  );
                })}
                {!posts.length ? (
                  <ThemedText size={12} color={theme.mutedForeground}>
                    {loading
                      ? t("publish.editor.loading")
                      : t("publish.editor.noPosts")}
                  </ThemedText>
                ) : null}
              </BottomSheetScrollView>
            </View>

            {/* 右：已选 */}
            <View style={styles.column}>
              <ThemedText size={12} color={theme.mutedForeground}>
                {t("publish.editor.selectedPosts")}
              </ThemedText>
              <BottomSheetScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
              >
                {selected.map((post) => (
                  <Pressable
                    key={post.id}
                    onPress={() => togglePost(post)}
                    style={[
                      styles.postRow,
                      {
                        backgroundColor: theme.muted,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <HugeIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      color={colors.primary}
                    />
                    <ThemedText
                      size={12}
                      numberOfLines={2}
                      style={styles.postTitle}
                    >
                      {post.title}
                    </ThemedText>
                  </Pressable>
                ))}
              </BottomSheetScrollView>
            </View>
          </View>

          <Pressable
            disabled={!canConfirm}
            onPress={handleConfirm}
            style={[
              styles.confirmButton,
              {
                backgroundColor: canConfirm ? colors.primary : theme.muted,
              },
            ]}
          >
            <ThemedText
              size={14}
              fontWeight="600"
              color={canConfirm ? "#FFFFFF" : theme.mutedForeground}
            >
              {t("publish.editor.insert")}
            </ThemedText>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default InlinePostSheet;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  header: {
    gap: 2,
    paddingTop: 4,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  linkInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  columns: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 6,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 8,
    paddingBottom: 8,
  },
  postRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  postCover: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  postTitle: {
    flex: 1,
  },
  confirmButton: {
    // 列表用 flex 吃掉剩余空间后，按钮靠 auto 外边距钉在面板底部
    marginTop: "auto",
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
