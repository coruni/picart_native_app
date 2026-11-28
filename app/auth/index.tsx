import { api } from "@/api";
import {
  resetPassword,
  sendSmsCode,
  sendVerificationCode,
  smsLogin,
} from "@/api/compat";
import AuthProviderIcon, {
  type AuthProvider,
} from "@/components/auth/AuthProviderIcon";
import AppBrand from "@/components/ui/AppBrand";
import Button from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import HugeIcon, { TOPIC_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useForm } from "@/hooks/useForm";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { getApiErrorMessage } from "@/lib/apiMessage";
import { setAuth, setProfile, type AuthUser } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import { useNavigation, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Keyboard,
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

type Screen = "providers" | "login" | "register" | "forgot";

// 登录和注册拿到的是同一份登录态，收尾统一走这里：先落 token，再补拉一次用户资料
// （装扮、关注数这些登录响应里没有）。资料不阻塞跳转，拉失败也不影响登录。
async function finishAuth(
  token: string,
  refreshToken: string,
  user: AuthUser,
): Promise<void> {
  await setAuth(token, refreshToken, user);
  void (async () => {
    try {
      const { data } = await api.userControllerGetProfile();
      if (data.data) await setProfile(data.data);
    } catch {
      // 「我的」页聚焦时还会再拉一次，这里静默即可
    }
  })();
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
        size={15}
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
  const { theme, isDark } = useTheme();
  return (
    <Pressable
      style={[styles.checkRow, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      hitSlop={4}
    >
      <View
        style={[
          styles.checkBox,
          {
            borderColor: checked
              ? theme.primary
              : isDark
                ? "white"
                : theme.border,
            backgroundColor: checked ? theme.primary : "transparent",
          },
        ]}
      >
        {checked && <HugeIcon icon={Tick02Icon} size={12} color="#fff" strokeWidth={TOPIC_STROKE_WIDTH} />}
      </View>
      <Text style={[styles.checkLabel, { color: theme.secondary }]}>
        {children}
      </Text>
    </Pressable>
  );
}

type AgreementFieldsProps = {
  agreed1: boolean;
  agreed2: boolean;
  onChange1: (value: boolean) => void;
  onChange2: (value: boolean) => void;
};

function AgreementFields({
  agreed1,
  agreed2,
  onChange1,
  onChange2,
}: AgreementFieldsProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Checkbox
        checked={agreed1}
        onChange={onChange1}
        style={styles.checkboxGap}
      >
        {t("auth.agreeToTerms")}
        {/* 链接前后留空格，否则可跳转文字会和相邻文案贴在一起 */}
        {" "}
        <Text
          style={{ color: theme.primary }}
          onPress={() =>
            router.push({
              pathname: "/agreement",
              params: {
                type: "terms",
              },
            })
          }
          suppressHighlighting
        >
          {t("auth.termsOfService")}
        </Text>
        {" "}
        {t("auth.required")}
      </Checkbox>

      <Checkbox
        checked={agreed2}
        onChange={onChange2}
        style={styles.checkboxSmallGap}
      >
        {t("auth.agreeToPrivacy")}
        {" "}
        <Text
          style={{ color: theme.primary }}
          onPress={() =>
            router.push({
              pathname: "/agreement",
              params: {
                type: "privacy",
              },
            })
          }
          suppressHighlighting
        >
          {t("auth.privacyPolicy")}
        </Text>
        {" "}
        {t("auth.collectInfo")}
      </Checkbox>
    </>
  );
}

type LoginMode = "password" | "sms";

// 短信登录暂时隐藏入口：后端短信通道还没开，翻成 true 就能放出来。
const SMS_LOGIN_ENABLED = false;

const RE_NON_DIGIT = /\D/g;
const RE_PHONE = /^1[3-9]\d{9}$/;

/** 手机号 / 验证码只收数字，顺手按长度截断 */
function digitsOnly(value: string, maxLength: number): string {
  return value.replace(RE_NON_DIGIT, "").slice(0, maxLength);
}

/** 粘贴 +86 前缀的号码时去掉国家码，只留 11 位 */
function normalizePhone(value: string): string {
  const digits = value.replace(RE_NON_DIGIT, "");
  const local =
    digits.length > 11 && digits.startsWith("86") ? digits.slice(2) : digits;
  return local.slice(0, 11);
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
  // 与「切换登录方式」页的勾选状态互不影响：两边各自独立维护。
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
  const [mode, setMode] = useState<LoginMode>("password");
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const isSms = mode === "sms";

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: { account: "", password: "", phone: "", code: "" },
    validationRules: isSms
      ? {
          phone: {
            required: t("auth.phoneRequired"),
            pattern: { value: RE_PHONE, message: t("auth.phoneInvalid") },
          },
          code: {
            required: t("auth.codeRequired"),
            pattern: { value: /^\d{6}$/, message: t("auth.codeInvalid") },
          },
        }
      : {
          account: { required: t("auth.usernameRequired") },
          password: {
            required: t("auth.passwordRequired"),
            minLength: { value: 6, message: t("auth.passwordMinLength") },
          },
        },
    onSubmit: async (vals) => {
      try {
        const res = isSms
          ? await smsLogin({ phone: vals.phone, code: vals.code })
          : await api.userControllerLogin({
              account: vals.account.trim(),
              password: vals.password,
            });
        const user = res.data.data;
        if (!user?.token || !user.refresh_token) {
          showToast(t("auth.loginFailed"));
          return;
        }
        await finishAuth(user.token, user.refresh_token, user);
        router.replace("/");
      } catch (error) {
        showToast(getApiErrorMessage(error, t("auth.loginFailed")));
      }
    },
  });

  // 号码没填满时按钮可点，点了给提示，不然用户不知道哪里不对
  const canSendCode = isSms && Boolean(values.phone) && countdown === 0;

  const handleSendCode = useCallback(async () => {
    if (countdown > 0) return;
    if (!RE_PHONE.test(values.phone)) {
      showToast(t("auth.phoneInvalid"));
      return;
    }
    try {
      await sendSmsCode({ phone: values.phone, scene: "login" });
      // 发送成功不弹提示：按钮转成倒计时本身就是反馈
      setCountdown(60);
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
      showToast(getApiErrorMessage(error, t("auth.codeSendFailed")));
    }
  }, [countdown, showToast, t, values.phone]);

  const canSubmit = Boolean(
    agreed1 &&
    agreed2 &&
    !isSubmitting &&
    (isSms
      ? values.phone && values.code
      : values.account && values.password),
  );

  return (
    <View>
      {SMS_LOGIN_ENABLED ? (
        <View style={[styles.modeSwitch, { backgroundColor: theme.muted }]}>
          {(["password", "sms"] as LoginMode[]).map((key) => {
            const active = mode === key;
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setMode(key)}
                style={[
                  styles.modeItem,
                  active && { backgroundColor: theme.card },
                ]}
              >
                <ThemedText
                  size={14}
                  fontWeight={active ? "600" : "400"}
                  color={active ? theme.foreground : theme.secondary}
                >
                  {t(
                    key === "password" ? "auth.passwordLogin" : "auth.smsLogin",
                  )}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <ThemedText
          size={22}
          fontWeight="700"
          color={theme.foreground}
          style={styles.panelTitle}
        >
          {t("auth.useEmailLogin")}
        </ThemedText>
      )}

      {isSms ? (
        <>
          <FloatInput
            label={t("auth.phoneLabel")}
            value={values.phone}
            onChangeText={(v) => handleChange("phone", normalizePhone(v))}
            onBlur={() => handleBlur("phone")}
            error={touched.phone ? errors.phone : undefined}
            keyboardType="number-pad"
            maxLength={11}
          />

          <View style={[styles.codeRow, styles.inputGap]}>
            <FloatInput
              label={t("auth.codeLabel")}
              value={values.code}
              onChangeText={(v) => handleChange("code", digitsOnly(v, 6))}
              onBlur={() => handleBlur("code")}
              error={touched.code ? errors.code : undefined}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.codeInput}
            />
            <Pressable
              style={[
                styles.sendCodeBtn,
                {
                  backgroundColor: canSendCode ? theme.primary : theme.muted,
                },
              ]}
              onPress={handleSendCode}
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
        </>
      ) : (
        <>
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
        </>
      )}

      <AgreementFields
        agreed1={agreed1}
        agreed2={agreed2}
        onChange1={setAgreed1}
        onChange2={setAgreed2}
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
        const username = vals.username.trim();
        // 设备号由 client 的默认 header 统一带，这里不用再单传
        const res = await api.userControllerRegisterUser({
          username,
          email: vals.email.trim() || undefined,
          password: vals.password,
          invite_code: inviteCodeEnabled
            ? vals.inviteCode.trim() || undefined
            : undefined,
          verification_code: emailVerificationRequired
            ? vals.verificationCode.trim() || undefined
            : undefined,
        });
        // 注册接口直接回登录态（和登录同一份），不用再补一次登录
        const user = res.data.data;
        if (!user?.token || !user.refresh_token) {
          showToast(t("auth.loginFailed"));
          return;
        }
        await finishAuth(user.token, user.refresh_token, user);
        router.replace("/");
      } catch (error) {
        showToast(getApiErrorMessage(error, t("auth.registerFailed")));
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
      await sendVerificationCode({
        email: values.email.trim(),
        type: "verification",
      });
      // 发送成功不弹提示：按钮转成倒计时本身就是反馈
      setCountdown(60);
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
      showToast(getApiErrorMessage(error, t("auth.codeSendFailed")));
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

          <AgreementFields
            agreed1={agreed1}
            agreed2={agreed2}
            onChange1={setAgreed1}
            onChange2={setAgreed2}
          />

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
        await resetPassword({
          email: vals.email,
          code: vals.code,
          new_password: vals.newPassword,
        });
        // 成功直接回登录面板，不再弹提示
        onBack();
      } catch (error) {
        showToast(getApiErrorMessage(error, t("auth.resetFailed")));
      }
    },
  });

  const sendCode = async () => {
    if (countdown > 0 || !values.email.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      showToast(t("auth.emailInvalid"));
      return;
    }
    // 之前这里没有 catch，发码失败会变成未捕获的 rejection，界面上什么都不显示
    try {
      await sendVerificationCode({
        email: values.email.trim(),
        type: "reset_password",
      });
      // 发送成功不弹提示：按钮转成倒计时本身就是反馈
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      showToast(getApiErrorMessage(error, t("auth.codeSendFailed")));
    }
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
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
  const agreements = {
    agreed1,
    agreed2,
    onChange1: setAgreed1,
    onChange2: setAgreed2,
  };

  // 面板切换动画：只驱动 opacity / translateY，且全部走 native driver
  const [panelOpacity] = useState(() => new Animated.Value(1));
  const [panelTranslateY] = useState(() => new Animated.Value(0));
  const transitionInProgress = useRef(false);

  const panelAnimStyle = {
    opacity: panelOpacity,
    transform: [{ translateY: panelTranslateY }],
  };

  const runPanelAnimation = useCallback(
    (
      toOpacity: number,
      toTranslateY: number,
      duration: number,
      callback?: () => void,
    ) => {
      Animated.parallel([
        Animated.timing(panelOpacity, {
          toValue: toOpacity,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(panelTranslateY, {
          toValue: toTranslateY,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => callback?.());
    },
    [panelOpacity, panelTranslateY],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const switchTo = useCallback(
    (target: Screen) => {
      if (target === screen || transitionInProgress.current) return;
      transitionInProgress.current = true;
      Keyboard.dismiss();
      runPanelAnimation(0, 12, 180, () => {
        setScreen(target);
        panelOpacity.setValue(0);
        panelTranslateY.setValue(20);
        runPanelAnimation(1, 0, 220, () => {
          transitionInProgress.current = false;
        });
      });
    },
    [panelOpacity, panelTranslateY, runPanelAnimation, screen],
  );

  const handleBack = useCallback(() => {
    if (transitionInProgress.current) return;
    if (screen === "register" || screen === "forgot") {
      switchTo("login");
      return;
    }
    if (screen === "login") {
      switchTo("providers");
      return;
    }

    if (navigation.canGoBack()) {
      router.back();
    } else {
      // 回首页，不要回「我的」：未登录状态下我的页会一直请求个人信息，401 后再被送回登录页，就成了登录页和我的页互相跳。
      router.replace("/");
    }
  }, [navigation, router, screen, switchTo]);

  // 落地页这两条协议只拦快捷登录（QQ / 微信）；邮箱登录在登录面板里有自己的勾选。
  const ensureConsent = useCallback(() => {
    if (agreed1 && agreed2) return true;
    showToast(t("auth.consentRequired"));
    return false;
  }, [agreed1, agreed2, showToast, t]);

  const handleProviderPress = useCallback(
    (provider: string) => {
      if (!ensureConsent()) return;
      showToast(t("auth.providerComingSoon", { provider }));
    },
    [ensureConsent, showToast, t],
  );

  const canRegister = config?.user_registration_enabled ?? true;
  const isProviderScreen = screen === "providers";

  const openEmailLogin = () => {
    switchTo("login");
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
          hitSlop={8}
        >
          {isProviderScreen ? (
            <HugeIcon icon={Cancel01Icon} size={24} color={theme.foreground} />
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
          { paddingBottom: insets.bottom + (isProviderScreen ? 32 : 24) },
        ]}
      >
        <View>
          {/* APP 名称在两种登录方式下的位置必须完全一致，不要随面板上下跳动 */}
          <View style={styles.logoArea}>
            <AppBrand />
          </View>

          <Animated.View style={panelAnimStyle}>
            {isProviderScreen ? (
              <View>
                <ThemedText
                  accessibilityRole="header"
                  size={22}
                  fontWeight="700"
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
                <AgreementFields {...agreements} />
              </View>
            ) : (
              renderPanel()
            )}
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
    // 8 + 按钮内 8 = 16，图标左边缘与页面 gutter（16）对齐。
    paddingHorizontal: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 480,
    // 页面 gutter 统一 16（DESIGN_CONSTRAINTS 2.3）。
    paddingHorizontal: 16,
  },
  // 落地页与各面板共用同一套外边距，保证切换时品牌位置不动。
  logoArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 28,
    minHeight: 48,
  },
  landingTitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  providerList: {
    gap: 16,
  },
  providerButton: {
    minHeight: 52,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
  },
  providerPressed: {
    opacity: 0.72,
  },
  providerLabel: {
    flex: 1,
    marginLeft: 16,
  },
  panelTitle: {
    marginBottom: 28,
    textAlign: "center",
  },
  // 密码登录 / 短信登录切换：轨道用 muted，选中项浮回卡片底色
  modeSwitch: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 12,
    marginBottom: 28,
  },
  modeItem: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
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
  submitBtn: {
    marginTop: 28,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
