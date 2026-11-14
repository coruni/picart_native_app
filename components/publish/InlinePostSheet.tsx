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

import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

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
const CONFIRM_BUTTON_HEIGHT = 44;
const FOOTER_SPACING = 12;
const HANDLE_HEIGHT = 24;
const MAX_SHEET_HEIGHT = 760;
const SHEET_HEIGHT_RATIO = 0.84;

/**
 * 内联帖子选择面板。
 * 关键点：面板内容区使用明确的数值高度，防止列表内容反向撑高父容器；
 * 两列使用 BottomSheetScrollView，交由 Gorhom 协调列表滚动与面板手势。
 */
const InlinePostSheet = forwardRef<InlinePostSheetRef, InlinePostSheetProps>(
  function InlinePostSheet({ onConfirm, onDismiss }, ref) {
    const { theme, colors } = useTheme();
    const { t } = useTranslation();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();
    const sheetRef = useRef<BottomSheetModal>(null);

    const [link, setLink] = useState("");
    const [posts, setPosts] = useState<InlinePost[]>([]);
    const [selected, setSelected] = useState<InlinePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // snapPoint 是整个面板高度；内容区高度需要扣除 handle 的高度。
    const sheetHeight = useMemo(() => {
      const availableHeight = Math.max(240, windowHeight - insets.top - 8);
      const preferredHeight = Math.round(windowHeight * SHEET_HEIGHT_RATIO);

      return Math.min(availableHeight, MAX_SHEET_HEIGHT, preferredHeight);
    }, [insets.top, windowHeight]);

    const sheetContentHeight = Math.max(216, sheetHeight - HANDLE_HEIGHT);
    const snapPoints = useMemo(() => [sheetHeight], [sheetHeight]);

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
        snapPoints={snapPoints}
        handleHeight={HANDLE_HEIGHT}
        enableDynamicSizing={false}
        stackBehavior="switch"
        keyboardBehavior="extend"
        keyboardBlurBehavior="none"
        android_keyboardInputMode="adjustResize"
        // 单档位面板不需要拖动；避免触摸/轻微滑动被识别为关闭手势。
        enablePanDownToClose={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
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
          style={[
            styles.root,
            {
              height: sheetContentHeight,
              paddingBottom: insets.bottom + FOOTER_SPACING,
            },
          ]}
        >
          <View style={styles.header}>
            <ThemedText size={15} fontWeight="600">
              {t("publish.editor.inlineArticle")}
            </ThemedText>
            <ThemedText size={12} color={theme.mutedForeground}>
              {t("publish.editor.inlinePostHint")}
            </ThemedText>
          </View>

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
              cursorColor={colors.primary}
              selectionColor={colors.primary}
            />
          </View>

          <View style={styles.columns}>
            {/* 左：我的帖子 */}
            <View style={styles.column}>
              <View style={styles.columnHeader}>
                <ThemedText size={12} color={theme.mutedForeground}>
                  {t("publish.editor.myPosts")}
                </ThemedText>
              </View>

              <BottomSheetScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                showsVerticalScrollIndicator
                bounces={false}
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

                      <ThemedText
                        size={12}
                        numberOfLines={2}
                        style={styles.postTitle}
                      >
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
              <View style={styles.columnHeader}>
                <ThemedText size={12} color={theme.mutedForeground}>
                  {t("publish.editor.selectedPosts")}
                </ThemedText>
              </View>

              <BottomSheetScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                showsVerticalScrollIndicator
                bounces={false}
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

          {/* 插入按钮固定在内容区底部，不属于任何滚动容器。 */}
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
    // 使用 BottomSheetView 让内容区参与 Gorhom 手势/布局协调。
    // 高度固定，列表不能把面板撑大。
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: 16,
    gap: 12,
    overflow: "hidden",
  },
  header: {
    flexShrink: 0,
    gap: 2,
    paddingTop: 4,
  },
  linkRow: {
    flexShrink: 0,
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
    flexShrink: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 0,
    overflow: "hidden",
  },
  column: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    minHeight: 0,
    gap: 6,
    overflow: "hidden",
  },
  columnHeader: {
    flexShrink: 0,
  },
  list: {
    // BottomSheetScrollView 参与 Gorhom 的滚动手势协调，视口只取父容器剩余空间。
    flex: 1,
    flexShrink: 1,
    minHeight: 0,
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
    minWidth: 0,
  },
  confirmButton: {
    flexShrink: 0,
    height: CONFIRM_BUTTON_HEIGHT,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    elevation: 0,
  },
});
