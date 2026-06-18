import { api } from "@/api";
import { FloatInput, type FloatInputHandle } from "@/components/ui/FloatInput";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** 通用分组容器，样式对齐 system 页 */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionWrap}>
      <ThemedText size={13} color={theme.secondary} style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export default function InfoManagementScreen() {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("infoManagementPage.title") });
  }, [navigation, t]);

  // ── Email state ──────────────────────────────────────────────
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Verification bottom sheet
  const verifySheetRef = useRef<BottomSheetModal>(null);
  const codeInputRef = useRef<FloatInputHandle>(null);
  const [codeValue, setCodeValue] = useState("");
  const [codeError, setCodeError] = useState("");

  // ── Address state ─────────────────────────────────────────────
  const [addressValue, setAddressValue] = useState("");
  const [addressError, setAddressError] = useState("");
  const [addressSuccess, setAddressSuccess] = useState("");
  const [submittingAddress, setSubmittingAddress] = useState(false);

  // countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleSendCode = useCallback(
    async (email: string) => {
      setSendingCode(true);
      setEmailError("");
      setEmailSuccess("");
      try {
        await api.userControllerSendVerificationCode({
          email,
          type: "verification",
        });
        setCountdown(60);
        setEmailSuccess(t("infoManagementPage.email.codeSent"));
        codeInputRef.current?.focus();
      } catch {
        setEmailError(t("infoManagementPage.email.codeSendError"));
      } finally {
        setSendingCode(false);
      }
    },
    [t],
  );

  const handleEmailSubmit = useCallback(async () => {
    setEmailError("");
    setEmailSuccess("");
    const trimmed = emailValue.trim();
    if (!trimmed) {
      setEmailError(t("infoManagementPage.email.required"));
      return;
    }
    if (!isValidEmail(trimmed)) {
      setEmailError(t("infoManagementPage.email.invalid"));
      return;
    }

    setSendingCode(true);
    try {
      await api.userControllerSendVerificationCode({
        email: trimmed,
        type: "verification",
      });
      setCountdown(60);
      setEmailSuccess(t("infoManagementPage.email.codeSent"));
      setCodeValue("");
      setCodeError("");
      requestAnimationFrame(() => {
        verifySheetRef.current?.present();
        // sheet 入场动画后再聚焦，否则 focus 会被动画打断
        setTimeout(() => codeInputRef.current?.focus(), 350);
      });
    } catch {
      setEmailError(t("infoManagementPage.email.codeSendError"));
    } finally {
      setSendingCode(false);
    }
  }, [emailValue, t]);

  const handleEmailConfirm = useCallback(async () => {
    const trimmedEmail = emailValue.trim();
    const trimmedCode = codeValue.trim();
    setCodeError("");
    if (!trimmedCode) {
      setCodeError(t("infoManagementPage.email.codeRequired"));
      return;
    }

    setSubmittingEmail(true);
    try {
      await api.userControllerUpdateProfileContact({
        email: trimmedEmail,
        verificationCode: trimmedCode,
      });
      const s = useAuthStore.getState();
      if (s.token && s.refreshToken && s.user) {
        s.setAuth(s.token, s.refreshToken, { ...s.user, email: trimmedEmail });
      }
      toast.show(t("infoManagementPage.email.success"));
      verifySheetRef.current?.dismiss();
      setEmailValue("");
      setEmailSuccess("");
      setCountdown(0);
    } catch {
      setCodeError(t("infoManagementPage.email.updateError"));
    } finally {
      setSubmittingEmail(false);
    }
  }, [emailValue, codeValue, t]);

  const handleAddressSubmit = useCallback(async () => {
    setAddressError("");
    setAddressSuccess("");
    const trimmed = addressValue.trim();
    if (!trimmed) {
      setAddressError(t("infoManagementPage.address.required"));
      return;
    }
    if (!user?.id) return;

    setSubmittingAddress(true);
    try {
      await api.userControllerUpdate(String(user.id), { address: trimmed });
      const s = useAuthStore.getState();
      if (s.token && s.refreshToken && s.user) {
        s.setAuth(s.token, s.refreshToken, { ...s.user, address: trimmed });
      }
      toast.show(t("infoManagementPage.address.success"));
      setAddressValue("");
    } catch {
      setAddressError(t("infoManagementPage.address.updateError"));
    } finally {
      setSubmittingAddress(false);
    }
  }, [addressValue, user, t]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["bottom", "left", "right"]}
    >
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText size={13} color={theme.secondary} style={styles.notice}>
          {t("infoManagementPage.notice")}
        </ThemedText>

        {/* Email */}
        <Section title={t("infoManagementPage.email.sectionTitle")}>
          <View style={styles.sectionContent}>
            {user?.email ? (
              <ThemedText
                size={13}
                color={theme.secondary}
                style={styles.currentValue}
              >
                {t("infoManagementPage.email.current", { value: user.email })}
              </ThemedText>
            ) : null}
            <FloatInput
              label={t("infoManagementPage.email.label")}
              value={emailValue}
              onChangeText={(v) => {
                setEmailValue(v);
                setEmailError("");
                setEmailSuccess("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError}
            />
            {!emailError && emailSuccess ? (
              <ThemedText
                size={12}
                color={colors.primary}
                style={styles.feedbackText}
              >
                {emailSuccess}
              </ThemedText>
            ) : null}
            <Pressable
              style={[
                styles.submitBtn,
                { backgroundColor: colors.primary },
                (sendingCode || submittingEmail) && styles.submitBtnDisabled,
              ]}
              onPress={handleEmailSubmit}
              disabled={sendingCode || submittingEmail}
            >
              {sendingCode ? (
                <ActivityIndicator size={16} color="#fff" />
              ) : (
                <ThemedText size={15} fontWeight="600" color="#fff">
                  {t("infoManagementPage.email.submit")}
                </ThemedText>
              )}
            </Pressable>
          </View>
        </Section>

        {/* Address */}
        <Section title={t("infoManagementPage.address.sectionTitle")}>
          <View style={styles.sectionContent}>
            {user?.address ? (
              <ThemedText
                size={13}
                color={theme.secondary}
                style={styles.currentValue}
              >
                {t("infoManagementPage.address.current", {
                  value: user.address,
                })}
              </ThemedText>
            ) : null}
            <FloatInput
              label={t("infoManagementPage.address.label")}
              value={addressValue}
              onChangeText={(v) => {
                setAddressValue(v);
                setAddressError("");
                setAddressSuccess("");
              }}
              error={addressError}
            />
            {!addressError && addressSuccess ? (
              <ThemedText
                size={12}
                color={colors.primary}
                style={styles.feedbackText}
              >
                {addressSuccess}
              </ThemedText>
            ) : null}
            <Pressable
              style={[
                styles.submitBtn,
                { backgroundColor: colors.primary },
                submittingAddress && styles.submitBtnDisabled,
              ]}
              onPress={handleAddressSubmit}
              disabled={submittingAddress}
            >
              {submittingAddress ? (
                <ActivityIndicator size={16} color="#fff" />
              ) : (
                <ThemedText size={15} fontWeight="600" color="#fff">
                  {t("infoManagementPage.address.submit")}
                </ThemedText>
              )}
            </Pressable>
          </View>
        </Section>
      </KeyboardAwareScrollView>

      {/* Email verification bottom sheet */}
      <BottomSheetModal
        ref={verifySheetRef}
        enableDynamicSizing
        enablePanDownToClose
        index={0}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
        handleComponent={null}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView
          style={[
            styles.sheetContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 8 },
          ]}
        >
          <View
            style={[styles.sheetHandle, { backgroundColor: theme.border }]}
          />
          <ThemedText size={17} fontWeight="600" style={styles.sheetTitle}>
            {t("infoManagementPage.email.modalTitle")}
          </ThemedText>
          <ThemedText
            size={13}
            color={theme.secondary}
            style={styles.sheetDesc}
          >
            {t("infoManagementPage.email.modalDescription")}
          </ThemedText>

          <FloatInput
            ref={codeInputRef}
            label={t("infoManagementPage.email.codeLabel")}
            value={codeValue}
            onChangeText={(v) => {
              setCodeValue(v);
              setCodeError("");
            }}
            keyboardType="number-pad"
            error={codeError}
            style={styles.codeInput}
            InputComponent={BottomSheetTextInput}
          />

          <View style={styles.sheetRow}>
            <Pressable
              style={[
                styles.sheetBtn,
                { borderColor: theme.border, borderWidth: 1 },
                (sendingCode || countdown > 0) && styles.submitBtnDisabled,
              ]}
              onPress={() => handleSendCode(emailValue.trim())}
              disabled={sendingCode || countdown > 0}
            >
              {sendingCode ? (
                <ActivityIndicator size={14} color={colors.primary} />
              ) : (
                <ThemedText size={14} color={colors.primary}>
                  {countdown > 0
                    ? t("infoManagementPage.email.resendIn", {
                        seconds: countdown,
                      })
                    : t("infoManagementPage.email.sendCode")}
                </ThemedText>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.sheetBtn,
                { backgroundColor: colors.primary },
                submittingEmail && styles.submitBtnDisabled,
              ]}
              onPress={handleEmailConfirm}
              disabled={submittingEmail}
            >
              {submittingEmail ? (
                <ActivityIndicator size={14} color="#fff" />
              ) : (
                <ThemedText size={14} fontWeight="600" color="#fff">
                  {t("infoManagementPage.email.confirm")}
                </ThemedText>
              )}
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingTop: 12 },
  notice: {
    marginHorizontal: 16,
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionWrap: { marginBottom: 16 },
  sectionTitle: { marginLeft: 16, marginBottom: 8 },
  section: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  sectionContent: {
    padding: 16,
    gap: 12,
  },
  currentValue: { lineHeight: 18 },
  feedbackText: { marginTop: -4 },
  submitBtn: {
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.6 },
  // bottom sheet
  sheetBg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  sheetTitle: { marginBottom: 6 },
  sheetDesc: { marginBottom: 20, lineHeight: 18 },
  codeInput: { marginBottom: 4 },
  sheetRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  sheetBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
