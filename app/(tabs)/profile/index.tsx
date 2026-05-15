import { Avatar } from "@/components/ui/Avatar";
import LoadingWidget from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
    FileText,
    IdCard,
    MessageSquareText,
    PencilLine,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { HERO_HEIGHT, useProfileContext } from "./_layout";

const profileTabs = ["帖子", "评论", "收藏", "话题", "我看过的"];
const categoryTabs = ["全部", "原神", "崩坏：星穹铁道", "绝区零"];

export default function ProfileIndexScreen() {
  const { theme, colors } = useTheme();
  const {
    profile,
    loading,
    displayName,
    avatarFrameUri,
    description,
    stats,
    scrollY,
  } = useProfileContext();

  const [activeTab, setActiveTab] = useState(profileTabs[0]);
  const [activeCategory, setActiveCategory] = useState(categoryTabs[0]);

  if (loading) {
    return <LoadingWidget loading />;
  }

  return (
    <Animated.ScrollView
      style={StyleSheet.absoluteFill}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false },
      )}
    >
      {/* 撑开 Hero 占位，减去卡片圆角高度使卡片嵌入头图底部 */}
      <View style={styles.heroSpacer} />

      {/* 资料卡 */}
      <View style={[styles.profileSheet, { backgroundColor: theme.card }]}>
        {/* 头像行 */}
        <View style={styles.profileHeaderRow}>
          <View style={styles.avatarSlot}>
            <Avatar
              uri={profile?.avatar}
              avatarFrameUri={avatarFrameUri}
              size={96}
              border
              rounded
            />
          </View>
          <Pressable
            style={[styles.editButton, { borderColor: colors.primary }]}
            hitSlop={8}
          >
            <PencilLine size={16} color={colors.primary} />
            <ThemedText fontWeight="600" color={colors.primary}>
              编辑
            </ThemedText>
          </Pressable>
        </View>

        {/* 身份信息 */}
        <View style={styles.identityWrap}>
          <View style={styles.nameRow}>
            <ThemedText fontWeight="800">{displayName}</ThemedText>
            {!!profile?.membershipLevelName && (
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: theme.secondaryBackground },
                ]}
              >
                <ThemedText fontWeight="700" color={colors.primary}>
                  {profile.membershipLevelName}
                </ThemedText>
              </View>
            )}
          </View>
          <View style={styles.metaLine}>
            <IdCard size={14} color={colors.primary} />
            <ThemedText color={theme.foreground}>
              通行证ID: {profile?.id ?? "--"}
            </ThemedText>
          </View>
          <View style={styles.metaLine}>
            <MessageSquareText size={14} color={theme.secondary} />
            <ThemedText color={theme.secondary}>{description}</ThemedText>
          </View>
        </View>

        {/* 统计 */}
        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statItem}>
              <ThemedText fontWeight="700">{item.value}</ThemedText>
              <ThemedText color={theme.secondary}>{item.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* 主 Tab */}
        <View style={styles.primaryTabsRow}>
          {profileTabs.map((tab) => {
            const active = tab === activeTab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={styles.primaryTabButton}
              >
                <ThemedText
                  fontWeight={active ? "700" : "500"}
                  color={active ? theme.foreground : theme.secondary}
                >
                  {tab}
                </ThemedText>
                {active && (
                  <View
                    style={[
                      styles.primaryTabIndicator,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* 分类筛选 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {categoryTabs.map((tab) => {
            const active = tab === activeCategory;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveCategory(tab)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active
                      ? "rgba(102, 128, 255, 0.14)"
                      : theme.muted,
                  },
                ]}
              >
                <ThemedText
                  fontWeight={active ? "700" : "500"}
                  color={active ? colors.primary : theme.foreground}
                >
                  {tab}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 内容占位 */}
        <View style={styles.placeholderWrap}>
          <FileText size={32} color={theme.secondary} />
          <ThemedText color={theme.secondary} style={styles.placeholderText}>
            {activeTab}内容区域预留，后续接列表数据。
          </ThemedText>
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  heroSpacer: {
    height: HERO_HEIGHT - 28,
  },
  profileSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 48,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  avatarSlot: {
    marginTop: -60,
  },
  editButton: {
    marginTop: 4,
    height: 32,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  identityWrap: {
    marginTop: 12,
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  levelBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  primaryTabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  primaryTabButton: {
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  primaryTabIndicator: {
    position: "absolute",
    bottom: 0,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  categoryTabsContent: {
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  categoryChip: {
    height: 36,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderWrap: {
    marginTop: 18,
    minHeight: 200,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "rgba(102, 128, 255, 0.06)",
  },
  placeholderText: {
    textAlign: "center",
  },
});
