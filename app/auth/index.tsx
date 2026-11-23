import { api } from "@/api";
import AuthProviderIcon, {
  type AuthProvider,
} from "@/components/auth/AuthProviderIcon";
import Button from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import HugeIcon from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useForm } from "@/hooks/useForm";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { setAuth } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import { useNavigation, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { Animated, Image, Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type Screen = "providers" | "login" | "register" | "forgot";

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: string | string[] };
    if (Array.isArray(data.message) && data.message[0]) {
      return data.message[0];
    }
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  }
  return fallback;
}

function CloseGlyph({ color, size = 26 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 5l14 14M19 5 5 19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ProviderButton({
  provider,
  label,
  onPress,
}: {
  provider: AuthProvider;
  label: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.providerButton,
        {
          backgroundColor: theme.secondaryBackground,
          borderColor: theme.border,
        },
        pressed && styles.providerPressed,
      ]}
    >
      <AuthProviderIcon provider={provider} />
      <ThemedText
        size={16}
        maxFontSizeMultiplier={1.15}
        fontWeight="500"
        color={theme.foreground}
        style={styles.providerLabel}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function AgreementConsent({
  type,
  checked,
  onToggle,
  onOpen,
}: {
  type: "terms" | "privacy";
  checked: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const label = t(type === "terms" ? "auth.termsOfService" : "auth.privacyPolicy");

  return (
    <View style={styles.agreementRow}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked }}
        onPress={onToggle}
        style={styles.agreementToggle}
      >
        <View
          style={[
            styles.agreementBox,
            {
              borderColor: checked ? theme.primary : theme.mutedForeground,
              backgroundColor: checked ? theme.primary : "transparent",
            },
          ]}
        >
          {checked && (
            <Svg width={13} height={13} viewBox="0 0 16 16" fill="none">
              <Path
                d="m3 8 3.2 3.2L13 4.4"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>
      </Pressable>
      <ThemedText
        size={13}
        lineHeight={20}
        maxFontSizeMultiplier={1.15}
        color={theme.mutedForeground}
        style={styles.agreementCopy}
      >
        <Trans
          i18nKey={type === "terms" ? "auth.termsConsent" : "auth.privacyConsent"}
          components={{
            agreement: (
              <ThemedText
                accessibilityRole="link"
                color={theme.primary}
                onPress={onOpen}
              />
            ),
          }}
        />
      </ThemedText>
    </View>
  );
}

function LoginPanel({
  onForgot,
  onRegister,
  canRegister,
}: {
  onForgot: () => void;
  onRegister: () => void;
  canRegister: boolean;
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: { account: "", password: "" },
    validationRules: {
      account: { required: t("auth.usernameRequired") },
      password: {
        required: t("auth.passwordRequired"),
        minLength: { value: 6, message: t("auth.passwordMinLength") },
      },
    },
    onSubmit: async (vals) => {
      try {
        const res = await api.userControllerLogin({
          account: vals.account.trim(),
          password: vals.password,
        });
        const user = res.data.data;
        await setAuth(user.token, user.refreshToken, user);
        router.replace("/");
      } catch (error) {
        showToast(getErrorMessage(error, t("auth.loginFailed")));
      }
    },
  });

  const canSubmit = Boolean(values.account && values.password && !isSubmitting);

  return (
    <View>
      <ThemedText
        size={24}
        fontWeight="700"
        color={theme.foreground}
        style={styles.panelTitle}
      >
        {t("auth.emailUsernameLogin")}
      </ThemedText>

      <FloatInput
        label={t("auth.usernameLabel")}
        value={values.account}
        onChangeText={(v) => handleChange("account", v)}
        onBlur={() => handleBlur("account")}
        error={touched.account ? errors.account : undefined}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FloatInput
        label={t("auth.passwordLabel")}
        value={values.password}
        onChangeText={(v) => handleChange("password", v)}
        onBlur={() => handleBlur("password")}
        error={touched.password ? errors.password : undefined}
        secureTextEntry
        style={styles.inputGap}
      />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        label={t("auth.login")}
        loading={isSubmitting}
        disabled={!canSubmit}
        onPress={handleSubmit}
        style={styles.submitBtn}
      />

      <View style={styles.footerRow}>
        <Pressable onPress={onForgot} hitSlop={8}>
          <ThemedText size={14} color={theme.primary}>
            {t("auth.forgotPassword")}
          </ThemedText>
        </Pressable>
        {canRegister ? (
          <Pressable onPress={onRegister} hitSlop={8}>
            <ThemedText size={14} color={theme.primary}>
              {t("auth.register")}
            </ThemedText>
          </Pressable>
        ) : (
          <ThemedText size={13} color={theme.secondary}>
            {t("auth.registrationClosedShort")}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

function RegisterPanel({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();
  const config = useConfigStore((state) => state.config);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const registrationEnabled = config?.user_registration_enabled ?? true;
  const inviteCodeEnabled = config?.invite_code_enabled ?? false;
  const inviteCodeRequired =
    inviteCodeEnabled && (config?.invite_code_required ?? false);
  const emailVerificationRequired = config?.user_email_verification ?? false;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      inviteCode: "",
      verificationCode: "",
    },
    validationRules: {
      username: { required: t("auth.registerUsernameRequired") },
      email: {
        required: t("auth.emailRequired"),
        email: t("auth.emailInvalid"),
      },
      password: {
        required: t("auth.passwordRequired"),
        minLength: { value: 6, message: t("auth.passwordMinLength") },
      },
      inviteCode: {
        required: inviteCodeRequired ? t("auth.inviteCodeRequired") : false,
      },
      verificationCode: {
        required: emailVerificationRequired ? t("auth.codeRequired") : false,
      },
    },
    onSubmit: async (vals) => {
      if (!registrationEnabled) {
        showToast(t("auth.registrationDisabled"));
        return;
      }

      try {
        const res = await api.userControllerRegisterUser({
          username: vals.username.trim(),
          email: vals.email.trim() || undefined,
          password: vals.password,
          inviteCode: inviteCodeEnabled
            ? vals.inviteCode.trim() || undefined
            : undefined,
          verificationCode: emailVerificationRequired
            ? vals.verificationCode.trim() || undefined
            : undefined,
        });
        const user = res.data.data;
        await setAuth(user.token, user.refreshToken, user);
        router.replace("/");
      } catch (error) {
        showToast(getErrorMessage(error, t("auth.registerFailed")));
      }
    },
  });

  const sendCode = async () => {
    if (countdown > 0 || !values.email.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      showToast(t("auth.emailInvalid"));
      return;
    }
    try {
      await api.userControllerSendVerificationCode({
        email: values.email.trim(),
        type: "verification",
      });
      setCountdown(60);
      showToast(t("auth.codeSent"));
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      showToast(getErrorMessage(error, t("auth.codeSendFailed")));
    }
  };

  const canSendCode = Boolean(values.email.trim()) && countdown === 0;
  const canSubmit = Boolean(
    registrationEnabled &&
    values.username.trim() &&
    values.password &&
    !isSubmitting &&
    (!inviteCodeRequired || values.inviteCode.trim()) &&
    (!emailVerificationRequired ||
      (values.email.trim() && values.verificationCode.trim())),
  );

  return (
    <View>
      <ThemedText
        size={24}
        fontWeight="700"
        color={theme.foreground}
        style={styles.panelTitle}
      >
        {t("auth.registerTitle")}
      </ThemedText>

      {!registrationEnabled ? (
        <>
          <ThemedText
            size={14}
            color={theme.secondary}
            style={styles.closedText}
          >
            {t("auth.registrationDisabledHint")}
          </ThemedText>
          <Pressable style={styles.backLink} onPress={onBack} hitSlop={8}>
            <ThemedText size={14} color={theme.primary}>
              {t("auth.backToLogin")}
            </ThemedText>
          </Pressable>
        </>
      ) : (
        <>
          <FloatInput
            label={t("auth.registerUsernameLabel")}
            value={values.username}
            onChangeText={(v) => handleChange("username", v)}
            onBlur={() => handleBlur("username")}
            error={touched.username ? errors.username : undefined}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FloatInput
            label={t("auth.emailLabel")}
            value={values.email}
            onChangeText={(v) => handleChange("email", v)}
            onBlur={() => handleBlur("email")}
            error={touched.email ? errors.email : undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.inputGap}
          />

          {emailVerificationRequired ? (
            <View style={styles.codeRow}>
              <FloatInput
                label={t("auth.codeLabel")}
                value={values.verificationCode}
                onChangeText={(v) => handleChange("verificationCode", v)}
                onBlur={() => handleBlur("verificationCode")}
                error={
                  touched.verificationCode ? errors.verificationCode : undefined
                }
                keyboardType="number-pad"
                style={styles.codeInput}
              />
              <Pressable
                style={[
                  styles.sendCodeBtn,
                  {
                    backgroundColor: canSendCode ? theme.primary : theme.muted,
                  },
                ]}
                onPress={canSendCode ? sendCode : undefined}
                disabled={!canSendCode}
              >
                <ThemedText
                  size={15}
                  fontWeight="600"
                  color={canSendCode ? "#fff" : theme.secondary}
                >
                  {countdown > 0 ? `${countdown}s` : t("auth.getCode")}
                </ThemedText>
              </Pressable>
            </View>
          ) : null}

          <FloatInput
            label={t("auth.passwordLabel")}
            value={values.password}
            onChangeText={(v) => handleChange("password", v)}
            onBlur={() => handleBlur("password")}
            error={touched.password ? errors.password : undefined}
            secureTextEntry
            style={styles.inputGap}
          />

          {inviteCodeEnabled ? (
            <FloatInput
              label={t("auth.inviteCodeLabel")}
              value={values.inviteCode}
              onChangeText={(v) => handleChange("inviteCode", v)}
              onBlur={() => handleBlur("inviteCode")}
              error={touched.inviteCode ? errors.inviteCode : undefined}
              autoCapitalize="characters"
              autoCorrect={false}
              style={styles.inputGap}
            />
          ) : null}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            label={t("auth.register")}
            loading={isSubmitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            style={styles.submitBtn}
          />

          <Pressable style={styles.backLink} onPress={onBack} hitSlop={8}>
            <ThemedText size={14} color={theme.primary}>
              {t("auth.backToLogin")}
            </ThemedText>
          </Pressable>
        </>
      )}
    </View>
  );
}

function ForgotPanel({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: { email: "", code: "", newPassword: "" },
    validationRules: {
      email: {
        required: t("auth.emailRequired"),
        email: t("auth.emailInvalid"),
      },
      code: { required: t("auth.codeRequired") },
      newPassword: {
        required: t("auth.newPasswordRequired"),
        minLength: { value: 6, message: t("auth.passwordMinLength") },
      },
    },
    onSubmit: async (vals) => {
      try {
        await api.userControllerResetPassword(
          undefined,
          undefined,
          undefined,
          undefined,
          { email: vals.email, code: vals.code, newPassword: vals.newPassword },
        );
        showToast(t("auth.resetSuccess"));
        onBack();
      } catch (error) {
        showToast(getErrorMessage(error, t("auth.resetFailed")));
      }
    },
  });

  const sendCode = async () => {
    if (countdown > 0 || !values.email.trim()) return;
    await api.userControllerSendVerificationCode({
      email: values.email,
      type: "reset_password",
    });
    setCountdown(60);
    showToast(t("auth.codeSent"));
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const canSendCode = Boolean(values.email.trim()) && countdown === 0;

  return (
    <View>
      <ThemedText
        size={24}
        fontWeight="700"
        color={theme.foreground}
        style={styles.panelTitle}
      >
        {t("auth.resetPasswordTitle")}
      </ThemedText>

      <View style={styles.codeRow}>
        <FloatInput
          label={t("auth.emailLabel")}
          value={values.email}
          onChangeText={(v) => handleChange("email", v)}
          onBlur={() => handleBlur("email")}
          error={touched.email ? errors.email : undefined}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.codeInput}
        />
        <Pressable
          style={[
            styles.sendCodeBtn,
            { backgroundColor: canSendCode ? theme.primary : theme.muted },
          ]}
          onPress={canSendCode ? sendCode : undefined}
          disabled={!canSendCode}
        >
          <ThemedText
            size={15}
            fontWeight="600"
            color={canSendCode ? "#fff" : theme.secondary}
          >
            {countdown > 0 ? `${countdown}s` : t("auth.getCode")}
          </ThemedText>
        </Pressable>
      </View>

      <FloatInput
        label={t("auth.codeLabel")}
        value={values.code}
        onChangeText={(v) => handleChange("code", v)}
        onBlur={() => handleBlur("code")}
        error={touched.code ? errors.code : undefined}
        keyboardType="number-pad"
        style={styles.inputGap}
      />

      <FloatInput
        label={t("auth.newPasswordLabel")}
        value={values.newPassword}
        onChangeText={(v) => handleChange("newPassword", v)}
        onBlur={() => handleBlur("newPassword")}
        error={touched.newPassword ? errors.newPassword : undefined}
        secureTextEntry
        style={styles.inputGap}
      />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        label={t("auth.confirmReset")}
        loading={isSubmitting}
        onPress={handleSubmit}
        style={styles.submitBtn}
      />

      <Pressable style={styles.backLink} onPress={onBack} hitSlop={8}>
        <ThemedText size={14} color={theme.primary}>
          {t("auth.backToLogin")}
        </ThemedText>
      </Pressable>
    </View>
  );
}

export default function AuthScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const config = useConfigStore((state) => state.config);
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<Screen>("providers");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [panelOpacity] = useState(() => new Animated.Value(1));
  const [panelTranslateY] = useState(() => new Animated.Value(0));

  const setPanelVisible = useCallback(
    (
      opacity: Animated.Value,
      translateY: Animated.Value,
      toValue: number,
      toTranslateY: number,
      duration: number,
      callback?: () => void,
    ) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: toTranslateY,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => callback?.());
    },
    [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const switchTo = useCallback(
    (target: Screen) => {
      setPanelVisible(panelOpacity, panelTranslateY, 0, 12, 180, () => {
        setScreen(target);
        panelOpacity.setValue(0);
        panelTranslateY.setValue(20);
        setPanelVisible(panelOpacity, panelTranslateY, 1, 0, 220);
      });
    },
    [panelOpacity, panelTranslateY, setPanelVisible],
  );

  const handleBack = useCallback(() => {
    if (screen !== "providers") {
      switchTo("providers");
      return;
    }

    if (navigation.canGoBack()) {
      router.back();
    } else {
      // 回首页，不要回「我的」：未登录状态下我的页会一直请求个人信息，
      // 401 后再被送回登录页，就成了登录页和我的页互相跳。
      router.replace("/");
    }
  }, [navigation, router, screen, switchTo]);

  const handleProviderPress = useCallback(
    (provider: string) => {
      showToast(t("auth.providerComingSoon", { provider }));
    },
    [showToast, t],
  );

  const canRegister = config?.user_registration_enabled ?? true;
  const isProviderScreen = screen === "providers";

  const openEmailLogin = () => {
    if (termsAccepted && privacyAccepted) {
      switchTo("login");
      return;
    }
    showToast(t("auth.consentRequired"));
  };

  const renderPanel = () => {
    if (screen === "register") {
      return <RegisterPanel onBack={() => switchTo("login")} />;
    }

    if (screen === "forgot") {
      return <ForgotPanel onBack={() => switchTo("login")} />;
    }

    return (
      <LoginPanel
        onForgot={() => switchTo("forgot")}
        onRegister={() => switchTo("register")}
        canRegister={canRegister}
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.card }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(isProviderScreen ? "auth.close" : "auth.back")}
          onPress={handleBack}
          style={styles.headerButton}
          hitSlop={10}
        >
          {isProviderScreen ? (
            <CloseGlyph color={theme.foreground} size={24} />
          ) : (
            <HugeIcon icon={ArrowLeft01Icon} size={24} color={theme.foreground} />
          )}
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        bottomOffset={16}
        extraKeyboardSpace={insets.bottom}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.flex1}
        contentContainerStyle={[
          styles.scrollContent,
          isProviderScreen && styles.landingContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
      >
        <View
          style={[
            styles.logoArea,
            isProviderScreen ? styles.logoAreaLanding : styles.logoAreaForm,
          ]}
        >
          <Image
            source={require("@/assets/images/icon.png")}
            accessible={isProviderScreen}
            accessibilityLabel={isProviderScreen ? "CeryLab" : undefined}
            style={[styles.brandIcon, isProviderScreen && styles.landingBrandIcon]}
          />
          {!isProviderScreen && (
            <ThemedText size={21} fontWeight="700" style={styles.brandName}>
              CeryLab
            </ThemedText>
          )}
        </View>

        {isProviderScreen ? (
          <View>
            <ThemedText
              accessibilityRole="header"
              size={25}
              fontWeight="800"
              maxFontSizeMultiplier={1.15}
              color={theme.foreground}
              style={styles.landingTitle}
            >
              {t("auth.loginCreateAccount")}
            </ThemedText>

            <View style={styles.providerList}>
              <ProviderButton
                provider="email"
                label={t("auth.emailUsernameLogin")}
                onPress={openEmailLogin}
              />
              <ProviderButton
                provider="qq"
                label={t("auth.qqLogin")}
                onPress={() => handleProviderPress("QQ")}
              />
              <ProviderButton
                provider="wechat"
                label={t("auth.wechatLogin")}
                onPress={() => handleProviderPress(t("auth.wechatName"))}
              />
            </View>

            <View style={styles.agreements}>
              <AgreementConsent
                type="terms"
                checked={termsAccepted}
                onToggle={() => setTermsAccepted((accepted) => !accepted)}
                onOpen={() => router.push("/agreement?type=terms")}
              />
              <AgreementConsent
                type="privacy"
                checked={privacyAccepted}
                onToggle={() => setPrivacyAccepted((accepted) => !accepted)}
                onOpen={() => router.push("/agreement?type=privacy")}
              />
            </View>
          </View>
        ) : (
          <Animated.View
            style={{
              opacity: panelOpacity,
              transform: [{ translateY: panelTranslateY }],
            }}
          >
            {renderPanel()}
          </Animated.View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  header: {
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 480,
    paddingHorizontal: 24,
  },
  landingContent: {
    paddingHorizontal: 29,
  },
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoAreaLanding: {
    marginTop: 42,
    marginBottom: 28,
    minHeight: 48,
  },
  logoAreaForm: {
    marginTop: 4,
    marginBottom: 28,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  landingBrandIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  brandName: {
    letterSpacing: -0.5,
  },
  landingTitle: {
    textAlign: "center",
    marginBottom: 26,
  },
  providerList: {
    gap: 16,
  },
  providerButton: {
    minHeight: 53,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
  },
  providerPressed: {
    opacity: 0.72,
  },
  providerLabel: {
    flex: 1,
    marginLeft: 15,
  },
  agreements: {
    marginTop: 32,
  },
  agreementRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  agreementToggle: {
    width: 44,
    height: 44,
    marginLeft: -10,
    alignItems: "center",
    justifyContent: "center",
  },
  agreementBox: {
    width: 19,
    height: 19,
    borderWidth: 1.5,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  agreementCopy: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 8,
  },
  panelTitle: {
    marginBottom: 28,
    textAlign: "center",
  },
  inputGap: {
    marginTop: 16,
  },
  submitBtn: {
    marginTop: 28,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 4,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  codeInput: {
    flex: 1,
  },
  sendCodeBtn: {
    height: 54,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 90,
  },
  backLink: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 4,
  },
  closedText: {
    marginTop: -8,
    lineHeight: 20,
    textAlign: "center",
  },
});
