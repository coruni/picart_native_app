import { ArticleData } from "@/app/article/[id]";
import { useTheme } from "@/hooks/useTheme";
import { useNavigation } from "expo-router";
import {
  ChevronLeft,
  MoreHorizontal,
  UserRoundPlus,
} from "lucide-react-native";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import AsyncImage from "../ui/AsyncImage";
import { Avatar } from "../ui/Avatar";
import ThemedIcon from "../ui/ThemedIcon";
import ThemedText from "../ui/ThemedText";
import ShareModal from "./ShareModal";

type ArticleHeaderProps = {
  data: ArticleData;
  author: ArticleData["author"];
};
function ArticleHeader({ author, data }: ArticleHeaderProps) {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const handleShareModal = () => {
    setShowModal(true);
  };
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => handleGoBack()} hitSlop={10}>
            <ThemedIcon variant="default" icon={ChevronLeft} size={28} />
          </Pressable>
          <Pressable>
            <View style={styles.authorInfo}>
              <Avatar
                size={36}
                uri={author?.avatar}
                avatarFrameUri={
                  author?.equippedDecorations?.AVATAR_FRAME?.imageUrl
                }
              />
              <View>
                <ThemedText variant="body" fontWeight={500}>
                  {author?.nickname ?? author?.username}
                </ThemedText>
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
          <Pressable>
            <ThemedIcon variant="default" icon={UserRoundPlus} size={18} />
          </Pressable>
          <ThemedText style={styles.divider}>|</ThemedText>
          <Pressable onPress={() => handleShareModal()}>
            <ThemedIcon variant="default" icon={MoreHorizontal} size={18} />
          </Pressable>
        </View>
      </View>
      <ShareModal
        data={data}
        visible={showModal}
        title={t("article.moreActions")}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

export default memo(ArticleHeader);

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 6,
    paddingRight: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    width: 14,
    height: 14,
  },
  headerRight: {
    borderWidth: 1,
    borderRadius: 15,
    height: 30,
    paddingHorizontal: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  divider: {
    paddingHorizontal: 8,
    fontWeight: 500,
    fontSize: 12,
  },
});
