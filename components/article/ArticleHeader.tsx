import { ArticleData } from "@/app/article/[id]";
import ShareModal from "@/components/article/ShareModal";
import CertificationBadge from "@/components/user/CertificationBadge";
import { useTheme } from "@/hooks/useTheme";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation, useRouter } from "expo-router";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import UserAdd01Icon from "@hugeicons/core-free-icons/UserAdd01Icon";
import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
import HugeIcon from "@/components/ui/HugeIcon";
import { memo, useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import AsyncImage from "../ui/AsyncImage";
import { Avatar } from "../ui/Avatar";
import ThemedIcon from "../ui/ThemedIcon";
import ThemedText from "../ui/ThemedText";

type ArticleHeaderProps = {
  data: ArticleData;
  author: ArticleData["author"];
  followLoading?: boolean;
  onToggleFollow?: () => void;
  onFollowChange?: (isFollowed: boolean) => void;
  topInset?: number;
};

function ArticleHeader({
  author,
  data,
  followLoading = false,
  onToggleFollow,
  onFollowChange,
  topInset = 0,
}: ArticleHeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();
  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef<BottomSheetModal>(null);
  const { theme } = useTheme();

  const handleShareModal = useCallback(() => {
    setShowShare(true);
    setTimeout(() => shareRef.current?.present(), 50);
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAuthorPress = useCallback(() => {
    if (!author?.id) return;
    router.push({
      pathname: "/user/[id]",
      params: { id: String(author.id), user: JSON.stringify(author) },
    });
  }, [author, router]);

  return (
    <>
      <View
        style={[
          styles.header,
          {
            paddingTop: topInset + 8,
            minHeight: topInset + 64,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Pressable onPress={() => handleGoBack()} hitSlop={10}>
            <ThemedIcon variant="default" icon={ArrowLeft01Icon} size={28} />
          </Pressable>
          <Pressable onPress={handleAuthorPress} hitSlop={8}>
            <View style={styles.authorInfo}>
              <Avatar
                size={36}
                uri={author?.avatar}
                avatarFrameUri={
                  author?.equippedDecorations?.AVATAR_FRAME?.imageUrl
                }
              />
              <View>
                <View style={styles.nameRow}>
                  <ThemedText variant="body" fontWeight={500}>
                    {author?.nickname ?? author?.username}
                  </ThemedText>
                  <CertificationBadge
                    certification={author?.certification}
                    size={14}
                  />
                </View>
                {author?.equippedDecorations?.ACHIEVEMENT_BADGE?.imageUrl && (
                  <AsyncImage
                    cachePolicy={"memory-disk"}
                    style={styles.badge}
                    source={{
                      uri: author?.equippedDecorations?.ACHIEVEMENT_BADGE
                        ?.imageUrl,
                    }}
                  />
                )}
              </View>
            </View>
          </Pressable>
        </View>
        {/* 右边容器 */}
        <View style={[styles.headerRight, { borderColor: theme.muted }]}>
          <Pressable
            disabled={!author?.id || followLoading}
            onPress={onToggleFollow}
            style={followLoading ? styles.disabledButton : undefined}
          >
            <ThemedIcon
              variant="default"
              icon={author?.isFollowed ? Tick02Icon : UserAdd01Icon}
              size={18}
              color={author?.isFollowed ? theme.primary : undefined}
              strokeWidth={author?.isFollowed ? 3 : undefined}
            />
          </Pressable>
          <ThemedText style={styles.divider}>|</ThemedText>
          <Pressable onPress={() => handleShareModal()}>
            <ThemedIcon variant="default" icon={MoreHorizontalIcon} size={18} />
          </Pressable>
        </View>
      </View>

      <ShareModal
        ref={shareRef}
        data={showShare ? data : undefined}
        onFollowChange={onFollowChange}
        onClose={() => {
          setShowShare(false);
        }}
      />
    </>
  );
}

export default memo(ArticleHeader);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authorInfo: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  badge: {
    width: 14,
    height: 14,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerRight: {
    borderWidth: 2,
    borderRadius: 15,
    height: 30,
    paddingHorizontal: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  divider: {
    paddingHorizontal: 8,
    fontWeight: "500",
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
