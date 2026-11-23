import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export type AuthProvider = "email" | "qq" | "wechat";

const providerLogos = {
  qq: require("@/assets/images/auth/tencent-qq.svg"),
  wechat: require("@/assets/images/auth/wechat-logo-1.svg"),
};

export default function AuthProviderIcon({
  provider,
}: {
  provider: AuthProvider;
}) {
  const { theme } = useTheme();

  if (provider === "email") {
    return (
      <LinearGradient
        colors={["#8CB3FF", "#4F7DFF"]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.badge}
      >
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3.4 6.6h17.2v10.8H3.4z"
            stroke="#fff"
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
          <Path
            d="m4.1 7.2 7.9 5.9 7.9-5.9"
            stroke="#fff"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        styles.logoBadge,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Image
        source={providerLogos[provider]}
        style={styles.logo}
        contentFit="contain"
        accessible={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoBadge: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    width: 23,
    height: 23,
  },
});
