import { api } from "@/api";
import type { TagControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import TopicListItem, {
  TopicListItemSkeleton,
} from "@/components/topic/TopicListItem";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

type FollowTopicsProps = {
  refreshSignal?: number;
};

const TOPIC_LIMIT = 3;

function FollowTopics({ refreshSignal = 0 }: FollowTopicsProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [topics, setTopics] = useState<
    TagControllerFindAll200ResponseDataDataInner[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.tagControllerFollowedList(1, TOPIC_LIMIT);
      setTopics((res.data?.data || []).slice(0, TOPIC_LIMIT));
    } catch (error) {
      console.error("FollowTopics fetchTopics:", error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const task = setTimeout(() => {
      fetchTopics();
    }, 0);

    return () => clearTimeout(task);
  }, [fetchTopics, refreshSignal]);

  if (!loading && topics.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <ThemedText
        size={16}
        fontWeight="700"
        color={theme.foreground}
        style={styles.title}
      >
        {t("followTopics.title")}
      </ThemedText>

      {loading
        ? Array.from({ length: 2 }).map((_, index) => (
            <TopicListItemSkeleton key={index} />
          ))
        : topics.map((topic) => (
            <TopicListItem key={topic.id} topic={topic} showChevron />
          ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginBottom: 8,
  },
  title: {
    marginBottom: 12,
  },
});

export default memo(FollowTopics);
