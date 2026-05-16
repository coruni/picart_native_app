import { api } from "@/api";
import { FloatInput } from "@/components/ui/FloatInput";
import ThemedText from "@/components/ui/ThemedText";
import { useForm } from "@/hooks/useForm";
import { useTheme } from "@/hooks/useTheme";
import { setAuth } from "@/store/authStore";
import { useNavigation, useRouter } from "expo-router";
import { Check, ChevronLeft } from "lucide-react-native";
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Screen = "login" | "forgot";

// ── Checkbox ─────────────────────────────────────────────────────────────────
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

// ── Login Panel ───────────────────────────────────────────────────────────────
function LoginPanel({ onForgot }: { onForgot: () => void }) {
  const { theme, colors } = useTheme();
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
      account: { required: "请输入用户名或邮箱" },
      password: {
        required: "请输入密码",
        minLength: { value: 6, message: "密码至少 6 位" },
      },
    },
    onSubmit: async (vals) => {
      const res = await api.userControllerLogin({
        account: vals.account,
        password: vals.password,
      });
      const user = res.data.data;
      await setAuth(user.token, user.refreshToken, user);
      router.replace("/(tabs)");
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
        请使用邮箱登录
      </ThemedText>

      <FloatInput
        label="用户名 / 邮箱"
        value={values.account}
        onChangeText={(v) => handleChange("account", v)}
        onBlur={() => handleBlur("account")}
        error={touched.account ? errors.account : undefined}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FloatInput
        label="密码"
        value={values.password}
        onChangeText={(v) => handleChange("password", v)}
        onBlur={() => handleBlur("password")}
        error={touched.password ? errors.password : undefined}
        secureTextEntry
        style={styles.inputGap}
      />

      <Checkbox
        checked={agreed1}
        onChange={setAgreed1}
        style={styles.checkboxGap}
      >
        阅读并同意
        <Text style={{ color: colors.primary }}>《社区用户协议》</Text>
        （必选）
      </Checkbox>

      <Checkbox
        checked={agreed2}
        onChange={setAgreed2}
        style={styles.checkboxSmallGap}
      >
        同意按照
        <Text style={{ color: colors.primary }}>《社区隐私政策》</Text>
        收集和使用个人信息（必选）
      </Checkbox>

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
            size={16}
            fontWeight="600"
            color={canSubmit ? "#fff" : theme.secondary}
          >
            登录
          </ThemedText>
        )}
      </Pressable>

      <View style={styles.footerRow}>
        <Pressable onPress={onForgot} hitSlop={8}>
          <ThemedText size={14} color={colors.primary}>
            忘记密码
          </ThemedText>
        </Pressable>
        <Pressable hitSlop={8}>
          <ThemedText size={14} color={colors.primary}>
            立即注册
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

// ── Forgot Panel ──────────────────────────────────────────────────────────────
function ForgotPanel({ onBack }: { onBack: () => void }) {
  const { theme, colors } = useTheme();
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
      email: { required: "请输入邮箱", email: "请输入有效的邮箱地址" },
      code: { required: "请输入验证码" },
      newPassword: {
        required: "请输入新密码",
        minLength: { value: 6, message: "密码至少 6 位" },
      },
    },
    onSubmit: async (vals) => {
      await api.userControllerResetPassword(
        undefined,
        undefined,
        undefined,
        undefined,
        { email: vals.email, code: vals.code, newPassword: vals.newPassword },
      );
      onBack();
    },
  });

  const sendCode = async () => {
    if (countdown > 0 || !values.email.trim()) return;
    await api.userControllerSendVerificationCode({
      email: values.email,
      type: "reset_password",
    });
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
        找回密码
      </ThemedText>

      {/* Email row with send code button */}
      <View style={styles.codeRow}>
        <FloatInput
          label="邮箱"
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
            {countdown > 0 ? `${countdown}s` : "获取验证码"}
          </ThemedText>
        </Pressable>
      </View>

      <FloatInput
        label="验证码"
        value={values.code}
        onChangeText={(v) => handleChange("code", v)}
        onBlur={() => handleBlur("code")}
        error={touched.code ? errors.code : undefined}
        keyboardType="number-pad"
        style={styles.inputGap}
      />

      <FloatInput
        label="新密码"
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
          <ThemedText size={16} fontWeight="600" color="#fff">
            重置密码
          </ThemedText>
        )}
      </Pressable>

      <Pressable style={styles.backLink} onPress={onBack} hitSlop={8}>
        <ThemedText size={14} color={colors.primary}>
          返回登录
        </ThemedText>
      </Pressable>
    </View>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────────
export default function AuthScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [screen, setScreen] = useState<Screen>("login");

  const loginOpacity = useRef(new Animated.Value(1)).current;
  const loginTranslateY = useRef(new Animated.Value(0)).current;
  const forgotOpacity = useRef(new Animated.Value(0)).current;
  const forgotTranslateY = useRef(new Animated.Value(20)).current;

  const switchTo = useCallback(
    (target: Screen) => {
      if (target === "forgot") {
        Animated.parallel([
          Animated.timing(loginOpacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(loginTranslateY, {
            toValue: -16,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setScreen("forgot");
          forgotOpacity.setValue(0);
          forgotTranslateY.setValue(20);
          Animated.parallel([
            Animated.timing(forgotOpacity, {
              toValue: 1,
              duration: 220,
              useNativeDriver: true,
            }),
            Animated.timing(forgotTranslateY, {
              toValue: 0,
              duration: 220,
              useNativeDriver: true,
            }),
          ]).start();
        });
      } else {
        Animated.parallel([
          Animated.timing(forgotOpacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(forgotTranslateY, {
            toValue: 20,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setScreen("login");
          loginOpacity.setValue(0);
          loginTranslateY.setValue(-16);
          Animated.parallel([
            Animated.timing(loginOpacity, {
              toValue: 1,
              duration: 220,
              useNativeDriver: true,
            }),
            Animated.timing(loginTranslateY, {
              toValue: 0,
              duration: 220,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }
    },
    [loginOpacity, loginTranslateY, forgotOpacity, forgotTranslateY],
  );

  const handleBack = useCallback(() => {
    if (screen === "forgot") {
      switchTo("login");
    } else {
      router.back();
    }
  }, [screen, switchTo, router]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.card }]}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <ChevronLeft size={24} color={theme.foreground} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <ThemedText size={32} fontWeight="800" color={theme.foreground}>
              PicArt
            </ThemedText>
          </View>

          {/* Forms Container */}
          <View style={styles.formsContainer}>
            {/* Login Panel */}
            <Animated.View
              pointerEvents={screen === "login" ? "auto" : "none"}
              style={{
                opacity: loginOpacity,
                transform: [{ translateY: loginTranslateY }],
              }}
            >
              <LoginPanel onForgot={() => switchTo("forgot")} />
            </Animated.View>

            {/* Forgot Panel — absolutely stacked on top */}
            <Animated.View
              pointerEvents={screen === "forgot" ? "auto" : "none"}
              style={[
                styles.forgotPanel,
                {
                  opacity: forgotOpacity,
                  transform: [{ translateY: forgotTranslateY }],
                },
              ]}
            >
              <ForgotPanel onBack={() => switchTo("login")} />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
  },
  logoArea: {
    marginTop: 24,
    marginBottom: 36,
    alignItems: "center",
  },
  formsContainer: {
    position: "relative",
  },
  forgotPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
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
    // (lineHeight - boxHeight) / 2 = (18 - 16) / 2 = 1，对齐首行文字中心
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
});
