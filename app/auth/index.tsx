import { api } from "@/api";
import { FloatInput } from "@/components/ui/FloatInput";
import ThemedText from "@/components/ui/ThemedText";
import { useForm } from "@/hooks/useForm";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { setAuth } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import { useNavigation, useRouter } from "expo-router";
import { Check, ChevronLeft } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Screen = "login" | "register" | "forgot";

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

function Checkbox({
  checked,
  onChange,
  children,
  style,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  style?: object;
}) {
  const { theme, colors } = useTheme();
  return (
    <Pressable
      style={[styles.checkRow, style]}
      onPress={() => onChange(!checked)}
      hitSlop={4}
    >
      <View
        style={[
          styles.checkBox,
          {
            borderColor: checked ? colors.primary : theme.border,
            backgroundColor: checked ? colors.primary : "transparent",
          },
        ]}
      >
        {checked && <Check size={11} color="#fff" strokeWidth={3} />}
      </View>
      <Text style={[styles.checkLabel, { color: theme.secondary }]}>
        {children}
      </Text>
    </Pressable>
  );
}

function AgreementFields({
  agreed1,
  agreed2,
  onChange1,
  onChange2,
}: {
  agreed1: boolean;
  agreed2: boolean;
  onChange1: (value: boolean) => void;
  onChange2: (value: boolean) => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Checkbox
        checked={agreed1}
        onChange={onChange1}
        style={styles.checkboxGap}
      >
        {t("auth.agreeToTerms")}
        <Text style={{ color: colors.primary }}>
          {t("auth.termsOfService")}
        </Text>
        {t("auth.required")}
      </Checkbox>

      <Checkbox
        checked={agreed2}
        onChange={onChange2}
        style={styles.checkboxSmallGap}
      >
        {t("auth.agreeToPrivacy")}
        <Text style={{ color: colors.primary }}>{t("auth.privacyPolicy")}</Text>
        {t("auth.collectInfo")}
      </Checkbox>
    </>
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
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);

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
        router.replace("/(tabs)");
      } catch (error) {
        showToast(getErrorMessage(error, t("auth.loginFailed")));
      }
    },
  });

  const canSubmit = Boolean(
    values.account && values.password && agreed1 && agreed2 && !isSubmitting,
  );

  return (
    <View>
      <ThemedText
        size={22}
        fontWeight="700"
        color={theme.foreground}
        style={styles.panelTitle}
      >
        {t("auth.useEmailLogin")}
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

      <AgreementFields
        agreed1={agreed1}
        agreed2={agreed2}
        onChange1={setAgreed1}
        onChange2={setAgreed2}
      />

      <Pressable
        style={[
          styles.primaryBtn,
          { backgroundColor: canSubmit ? colors.primary : theme.muted },
        ]}
        onPress={canSubmit ? handleSubmit : undefined}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <ThemedText
            size={15}
            fontWeight="600"
            color={canSubmit ? "#fff" : theme.secondary}
          >
            {t("auth.login")}
          </ThemedText>
        )}
      </Pressable>

      <View style={styles.footerRow}>
        <Pressable onPress={onForgot} hitSlop={8}>
          <ThemedText size={14} color={colors.primary}>
            {t("auth.forgotPassword")}
          </ThemedText>
        </Pressable>
        {canRegister ? (
          <Pressable onPress={onRegister} hitSlop={8}>
            <ThemedText size={14} color={colors.primary}>
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
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();
  const config = useConfigStore((state) => state.config);
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
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
        router.replace("/(tabs)");
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
    agreed1 &&
    agreed2 &&
    !isSubmitting &&
    (!inviteCodeRequired || values.inviteCode.trim()) &&
    (!emailVerificationRequired ||
      (values.email.trim() && values.verificationCode.trim())),
  );

  return (
    <View>
      <ThemedText
        size={22}
        fontWeight="700"
        color={theme.foreground}
        style={styles.panelTitle}
      >
        {t("auth.register")}
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
            <ThemedText size={14} color={colors.primary}>
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
                    backgroundColor: canSendCode ? colors.primary : theme.muted,
                  },
                ]}
                onPress={canSendCode ? sendCode : undefined}
                disabled={!canSendCode}
              >
                <ThemedText
                  size={13}
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

          <AgreementFields
            agreed1={agreed1}
            agreed2={agreed2}
            onChange1={setAgreed1}
            onChange2={setAgreed2}
          />

          <Pressable
            style={[
              styles.primaryBtn,
              { backgroundColor: canSubmit ? colors.primary : theme.muted },
            ]}
            onPress={canSubmit ? handleSubmit : undefined}
            disabled={!canSubmit}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText
                size={15}
                fontWeight="600"
                color={canSubmit ? "#fff" : theme.secondary}
              >
                {t("auth.register")}
              </ThemedText>
            )}
          </Pressable>

          <Pressable style={styles.backLink} onPress={onBack} hitSlop={8}>
            <ThemedText size={14} color={colors.primary}>
              {t("auth.backToLogin")}
            </ThemedText>
          </Pressable>
        </>
      )}
    </View>
  );
}

function ForgotPanel({ onBack }: { onBack: () => void }) {
  const { theme, colors } = useTheme();
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
        size={22}
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
            { backgroundColor: canSendCode ? colors.primary : theme.muted },
          ]}
          onPress={canSendCode ? sendCode : undefined}
          disabled={!canSendCode}
        >
          <ThemedText
            size={13}
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

      <Pressable
        style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <ThemedText size={15} fontWeight="600" color="#fff">
            {t("auth.confirmReset")}
          </ThemedText>
        )}
      </Pressable>

      <Pressable style={styles.backLink} onPress={onBack} hitSlop={8}>
        <ThemedText size={14} color={colors.primary}>
          {t("auth.backToLogin")}
        </ThemedText>
      </Pressable>
    </View>
  );
}

export default function AuthScreen() {
  const { theme } = useTheme();
  const config = useConfigStore((state) => state.config);
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<Screen>("login");

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
    if (screen === "forgot" || screen === "register") {
      switchTo("login");
    } else {
      router.back();
    }
  }, [screen, switchTo, router]);

  const canRegister = config?.user_registration_enabled ?? true;
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
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <ChevronLeft size={24} color={theme.foreground} />
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
          { flexGrow: 1, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.logoArea}>
          <ThemedText size={32} fontWeight="800" color={theme.foreground}>
            PicArt
          </ThemedText>
        </View>

        <View style={styles.formsContainer}>
          <Animated.View
            style={{
              opacity: panelOpacity,
              transform: [{ translateY: panelTranslateY }],
            }}
          >
            {renderPanel()}
          </Animated.View>
        </View>
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
    paddingHorizontal: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  logoArea: {
    marginTop: 24,
    marginBottom: 36,
    alignItems: "center",
  },
  formsContainer: {
    position: "relative",
  },
  panelTitle: {
    marginBottom: 28,
    textAlign: "center",
  },
  inputGap: {
    marginTop: 16,
  },
  checkboxGap: {
    marginTop: 24,
  },
  checkboxSmallGap: {
    marginTop: 12,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    flexShrink: 0,
    marginTop: 1,
  },
  checkLabel: {
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
