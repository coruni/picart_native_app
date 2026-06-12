import { CreateReportDtoCategoryEnum } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

type ReportPayload = {
  category: CreateReportDtoCategoryEnum;
  reason: string;
};

type ReportOptions = {
  onSubmit: (payload: ReportPayload) => void | Promise<void>;
};

type ReportContextValue = {
  report: (options: ReportOptions) => void;
};

type ReasonOption = {
  id: string;
  label: string;
  reason: string;
  category: CreateReportDtoCategoryEnum;
};

const ReportContext = createContext<ReportContextValue | null>(null);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [customReason, setCustomReason] = useState("");
  const optionsRef = useRef<ReportOptions | null>(null);

  const report = useCallback((options: ReportOptions) => {
    optionsRef.current = options;
    setSelectedId("");
    setCustomReason("");
    setVisible(true);
  }, []);

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

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedReason || !finalReason) return;
    setVisible(false);
    await optionsRef.current?.onSubmit({
      category: selectedReason.category,
      reason: finalReason,
    });
  }, [selectedReason, finalReason]);

  return (
    <ReportContext.Provider value={{ report }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        hardwareAccelerated
        onRequestClose={handleClose}
      >
        <View style={styles.keyboardAwareRoot}>
          <Pressable style={styles.overlayBackdrop} onPress={handleClose} />
          <KeyboardAwareScrollView
            bottomOffset={16}
            extraKeyboardSpace={24}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.overlayContent}
            showsVerticalScrollIndicator={false}
            style={styles.keyboardAwareScroll}
          >
            <Pressable style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.header}>
                <ThemedText fontWeight="600" size={16}>
                  {t("reportDialog.title")}
                </ThemedText>
              </View>

              <KeyboardAwareScrollView
                enabled={false}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {reasons.map((reason) => {
                  const checked = selectedId === reason.id;
                  return (
                    <View key={reason.id}>
                      <Pressable
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
                              borderColor: checked
                                ? theme.primary
                                : theme.secondary,
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
                          <TextInput
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
              </KeyboardAwareScrollView>

              <View style={[styles.footer, { borderTopColor: theme.border }]}>
                <Pressable
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
            </Pressable>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    </ReportContext.Provider>
  );
}

export function useReport() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be used within ReportProvider");
  return ctx;
}

const styles = StyleSheet.create({
  keyboardAwareRoot: {
    flex: 1,
  },
  keyboardAwareScroll: {
    flex: 1,
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  overlayContent: {
    flexGrow: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  card: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    maxHeight: "75%",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  list: {
    flexGrow: 0,
    paddingHorizontal: 8,
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
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitBtn: {
    borderRadius: 40,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
