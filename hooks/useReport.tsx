import { CreateReportDtoCategoryEnum } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { usePathname } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ReportPayload = {
  category: CreateReportDtoCategoryEnum;
  reason: string;
};

type ReportOptions = {
  onSubmit: (payload: ReportPayload) => void | Promise<void>;
};

type ReportContextValue = {
  report: (options: ReportOptions) => void;
  dismiss: () => void;
};

type ReportProviderProps = {
  children: React.ReactNode;
  /** 举报 sheet 显示/隐藏时回调，供原生 Modal 之类的宿主在关闭前先收起 sheet。 */
  onVisibilityChange?: (visible: boolean) => void;
};

type ReasonOption = {
  id: string;
  label: string;
  reason: string;
  category: CreateReportDtoCategoryEnum;
};

type SheetPhase = "closed" | "opening" | "open" | "dismissing";

const MAX_SHEET_HEIGHT = 640;

const ReportContext = createContext<ReportContextValue | null>(null);

/**
 * 把顶部指示条和标题一起放进 handleComponent：
 * 面板关闭了 enableContentPanningGesture 以保证列表顺畅滚动，
 * 如果 handle 只有 36x4 的细条（外加 10px 顶部间距），手指几乎抓不到；
 * 把整块头部放进 handle 后，顶部把手和标题区都能稳定触发下拉关闭手势。
 */
function SheetHandle() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={[styles.handleContainer, { backgroundColor: theme.card }]}
      collapsable={false}
    >
      <View style={[styles.handle, { backgroundColor: theme.border }]} />
      <View style={styles.header}>
        <ThemedText fontWeight="600" size={16}>
          {t("reportDialog.title")}
        </ThemedText>
      </View>
    </View>
  );
}

/**
 * 兜底：iOS 侧滑返回、代码里主动 router.back()、深链跳转都不经过
 * Android 的物理返回键，但路由一变就必须收起 sheet，避免它留在上一个页面上。
 * 单独拆成空组件，让路由订阅只重渲染它自己，不带着整棵导航栈重渲染。
 */
function RouteChangeDismissGuard({ onRouteChange }: { onRouteChange: () => void }) {
  const pathname = usePathname();
  const lastPathnameRef = useRef(pathname);

  useEffect(() => {
    if (lastPathnameRef.current === pathname) return;
    lastPathnameRef.current = pathname;
    onRouteChange();
  }, [onRouteChange, pathname]);

  return null;
}

export function ReportProvider({
  children,
  onVisibilityChange,
}: ReportProviderProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [selectedId, setSelectedId] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const optionsRef = useRef<ReportOptions | null>(null);
  const sheetPhaseRef = useRef<SheetPhase>("closed");
  const dismissAfterOpenRef = useRef(false);
  const pendingOptionsRef = useRef<ReportOptions | null>(null);

  // 面板按内容高度展开（和 share 面板一致），只有内容超过这个上限才滚动。
  const maxSheetHeight = useMemo(
    () => Math.min(Math.round(windowHeight * 0.9), MAX_SHEET_HEIGHT),
    [windowHeight],
  );
  // 列表高度上限 = 面板上限 - 头部 / 底部按钮与安全区预留高度，
  // 保证列表再长也不会把「提交」挤出可视区。
  const listMaxHeight = Math.max(
    180,
    maxSheetHeight - 130 - Math.max(insets.bottom, 12),
  );

  const presentSheet = useCallback((options: ReportOptions) => {
    optionsRef.current = options;
    pendingOptionsRef.current = null;
    dismissAfterOpenRef.current = false;
    setSelectedId("");
    setCustomReason("");
    if (!sheetRef.current) {
      sheetPhaseRef.current = "closed";
      return;
    }
    sheetPhaseRef.current = "opening";
    sheetRef.current.present();
  }, []);

  const report = useCallback(
    (options: ReportOptions) => {
      if (sheetPhaseRef.current === "dismissing") {
        // 上一次关闭动画还没卸载完成，等 onDismiss 复位后再弹出，
        // 避免 gorhom 在 isForcedClosing 期间把 present() 静默吞掉。
        pendingOptionsRef.current = options;
        dismissAfterOpenRef.current = false;
        return;
      }
      presentSheet(options);
    },
    [presentSheet],
  );

  const dismiss = useCallback(() => {
    pendingOptionsRef.current = null;

    if (
      sheetPhaseRef.current === "closed" ||
      sheetPhaseRef.current === "dismissing"
    ) {
      // 严禁在 BottomSheetModal 未挂载（MODAL_STATUS.INITIAL）时调 dismiss()：
      // gorhom v5 会把 statusRef 置为 DISMISSING，但 bottomSheetRef 为 null 导致
      // forceClose 不执行、unmount 永不触发，之后 present() 会被 handlePortalRender
      // 拦下而彻底打不开（路由切换守卫正是因此把文章详情的举报面板锁死）。
      return;
    }

    if (sheetPhaseRef.current === "opening") {
      // present() 刚排进下一帧或正在测布局，等真正展开后再收起。
      dismissAfterOpenRef.current = true;
      return;
    }

    if (!sheetRef.current) {
      sheetPhaseRef.current = "closed";
      return;
    }

    sheetPhaseRef.current = "dismissing";
    sheetRef.current.dismiss();
  }, []);

  const handleAnimate = useCallback(
    (_fromIndex: number, toIndex: number) => {
      if (toIndex >= 0) {
        if (dismissAfterOpenRef.current) {
          dismissAfterOpenRef.current = false;
          sheetPhaseRef.current = "dismissing";
          setIsOpen(false);
          onVisibilityChange?.(false);
          sheetRef.current?.dismiss();
          return;
        }
        sheetPhaseRef.current = "open";
        setIsOpen(true);
        onVisibilityChange?.(true);
        return;
      }

      if (
        sheetPhaseRef.current === "open" ||
        sheetPhaseRef.current === "opening"
      ) {
        sheetPhaseRef.current = "dismissing";
      }
      setIsOpen(false);
      onVisibilityChange?.(false);
    },
    [onVisibilityChange],
  );

  const handleChange = useCallback(
    (index: number) => {
      if (index < 0) return;

      if (dismissAfterOpenRef.current) {
        dismissAfterOpenRef.current = false;
        sheetPhaseRef.current = "dismissing";
        setIsOpen(false);
        onVisibilityChange?.(false);
        sheetRef.current?.dismiss();
        return;
      }

      if (sheetPhaseRef.current !== "open") {
        sheetPhaseRef.current = "open";
        setIsOpen(true);
        onVisibilityChange?.(true);
      }
    },
    [onVisibilityChange],
  );

  // 举报 sheet 挂在根布局上，不在任何页面里，页面自身的返回监听拦不到它。
  // 这里在 sheet 打开期间接管 Android 物理返回键：先关闭 sheet，而不是
  // 让导航栈直接把当前页面弹掉（否则 sheet 会残留在上一页之上）。
  // 挂在原生 Modal 里时返回键走 Modal 的 onRequestClose，由宿主调用
  // onVisibilityChange + ReportDismissHandle 处理。
  useEffect(() => {
    if (!isOpen) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      dismiss();
      return true;
    });
    return () => sub.remove();
  }, [dismiss, isOpen]);

  const reasons: ReasonOption[] = [
    {
      id: "spam-site",
      label: t("reportOptions.spamSite"),
      reason: t("reportOptions.spamSite"),
      category: CreateReportDtoCategoryEnum.Spam,
    },
    {
      id: "account-trading",
      label: t("reportOptions.accountTrading"),
      reason: t("reportOptions.accountTrading"),
      category: CreateReportDtoCategoryEnum.Other,
    },
    {
      id: "privacy-leak",
      label: t("reportOptions.privacyLeak"),
      reason: t("reportOptions.privacyLeak"),
      category: CreateReportDtoCategoryEnum.Inappropriate,
    },
    {
      id: "sensitive-content",
      label: t("reportOptions.sensitiveContent"),
      reason: t("reportOptions.sensitiveContent"),
      category: CreateReportDtoCategoryEnum.Inappropriate,
    },
    {
      id: "abuse-threat",
      label: t("reportOptions.abuseThreat"),
      reason: t("reportOptions.abuseThreat"),
      category: CreateReportDtoCategoryEnum.Abuse,
    },
    {
      id: "copyright",
      label: t("reportOptions.copyright"),
      reason: t("reportOptions.copyright"),
      category: CreateReportDtoCategoryEnum.Copyright,
    },
    {
      id: "impersonation",
      label: t("reportOptions.impersonation"),
      reason: t("reportOptions.impersonation"),
      category: CreateReportDtoCategoryEnum.Other,
    },
    {
      id: "community-violation",
      label: t("reportOptions.communityViolation"),
      reason: t("reportOptions.communityViolation"),
      category: CreateReportDtoCategoryEnum.Other,
    },
    {
      id: "minor-safety",
      label: t("reportOptions.minorSafety"),
      reason: t("reportOptions.minorSafety"),
      category: CreateReportDtoCategoryEnum.Inappropriate,
    },
    {
      id: "other",
      label: t("reportOptions.other"),
      reason: "",
      category: CreateReportDtoCategoryEnum.Other,
    },
  ];

  const selectedReason = reasons.find((r) => r.id === selectedId);
  const finalReason =
    selectedId === "other"
      ? customReason.trim()
      : (selectedReason?.reason ?? "");
  const canSubmit = Boolean(selectedReason && finalReason);

  const handleDismissed = useCallback(() => {
    sheetPhaseRef.current = "closed";
    dismissAfterOpenRef.current = false;
    setSelectedId("");
    setCustomReason("");
    setIsOpen(false);
    onVisibilityChange?.(false);

    const pending = pendingOptionsRef.current;
    if (pending) {
      pendingOptionsRef.current = null;
      requestAnimationFrame(() => {
        if (sheetPhaseRef.current === "closed") {
          presentSheet(pending);
        }
      });
    }
  }, [onVisibilityChange, presentSheet]);

  const handleSubmit = useCallback(async () => {
    if (!selectedReason || !finalReason) return;
    const onSubmit = optionsRef.current?.onSubmit;
    dismiss();
    await onSubmit?.({
      category: selectedReason.category,
      reason: finalReason,
    });
  }, [dismiss, selectedReason, finalReason]);

  const contextValue = useMemo(
    () => ({ report, dismiss }),
    [report, dismiss],
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </BottomSheetBackdrop>
    ),
    [dismiss],
  );

  return (
    <ReportContext.Provider value={contextValue}>
      {children}
      <RouteChangeDismissGuard onRouteChange={dismiss} />
      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        maxDynamicContentSize={maxSheetHeight}
        stackBehavior="replace"
        enablePanDownToClose
        enableHandlePanningGesture
        // 列表自己滚动，纵向手势不再交给面板，避免列表滑不动 / 误触关闭；
        // 顶部把手与标题整块放在 handleComponent 内，拖动顶部即可下拉关闭。
        enableContentPanningGesture={false}
        enableBlurKeyboardOnGesture
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        handleComponent={SheetHandle}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBackground, { backgroundColor: theme.card }]}
        onAnimate={handleAnimate}
        onChange={handleChange}
        onDismiss={handleDismissed}
      >
        <BottomSheetView style={{ backgroundColor: theme.card }}>
          <ScrollView
            style={{ maxHeight: listMaxHeight }}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
          {reasons.map((reason) => {
            const checked = selectedId === reason.id;
            return (
              <View key={reason.id}>
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: checked }}
                  style={({ pressed }) => [
                    styles.optionRow,
                    pressed && { backgroundColor: theme.primary + "18" },
                  ]}
                  onPress={() => setSelectedId(reason.id)}
                >
                  <ThemedText size={14} style={styles.optionLabel}>
                    {reason.label}
                  </ThemedText>
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: checked ? theme.primary : theme.secondary,
                      },
                    ]}
                  >
                    {checked && (
                      <View
                        style={[
                          styles.radioDot,
                          { backgroundColor: theme.primary },
                        ]}
                      />
                    )}
                  </View>
                </Pressable>

                {reason.id === "other" && checked && (
                  <View style={styles.textInputWrapper}>
                    <BottomSheetTextInput
                      value={customReason}
                      onChangeText={setCustomReason}
                      placeholder={t("reportDialog.otherPlaceholder")}
                      placeholderTextColor={theme.secondary}
                      selectionColor={theme.primary}
                      cursorColor={theme.primary}
                      multiline
                      maxLength={300}
                      style={[
                        styles.textInput,
                        {
                          color: theme.text,
                          borderColor: theme.border,
                          backgroundColor: theme.background,
                        },
                      ]}
                    />
                    <ThemedText
                      size={12}
                      color={theme.secondary}
                      style={styles.charCount}
                    >
                      {customReason.length}/300
                    </ThemedText>
                  </View>
                )}
              </View>
            );
          })}
          </ScrollView>

          <View
            style={[
              styles.footer,
              {
                borderTopColor: theme.border,
                paddingBottom: Math.max(insets.bottom, 12),
              },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit }}
              style={[
                styles.submitBtn,
                {
                  backgroundColor: canSubmit
                    ? theme.primary
                    : theme.secondaryBackground,
                },
              ]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <ThemedText
                size={15}
                fontWeight="600"
                color={canSubmit ? "white" : theme.secondary}
              >
                {t("reportDialog.submit")}
              </ThemedText>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </ReportContext.Provider>
  );
}

export function useReport() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be used within ReportProvider");
  return ctx;
}

/**
 * 把「收起举报 sheet」的能力交给宿主组件（例如包了原生 Modal 的大图查看器）。
 * 原生 Modal 会吞掉 Android 返回键，宿主需要在 onRequestClose 里先调用它，
 * 而不是直接关闭自己。
 */
export function ReportDismissHandle({
  register,
}: {
  register: (dismiss: (() => void) | null) => void;
}) {
  const { dismiss } = useReport();

  useEffect(() => {
    register(dismiss);
    return () => register(null);
  }, [dismiss, register]);

  return null;
}

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionLabel: {
    flex: 1,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textInputWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitBtn: {
    borderRadius: 40,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
