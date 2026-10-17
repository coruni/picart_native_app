import { useTheme } from "@/hooks/useTheme";
import { ReactNode, memo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import ThemedText from "../ui/ThemedText";

type CommentListEmptyStateProps = {
  loading: boolean;
  initialized: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyText?: string;
  skeleton?: ReactNode;
};

export const CommentListEmptyState = memo(function CommentListEmptyState({
  loading,
  initialized,
  error,
  onRetry,
  emptyText,
  skeleton = null,
}: CommentListEmptyStateProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (loading && !initialized) {
    return <>{skeleton}</>;
  }

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText size={14} color={theme.secondary}>
          {error}
        </ThemedText>
        {onRetry ? (
          <Pressable
            style={[styles.retryBtn, { backgroundColor: theme.primary }]}
            onPress={onRetry}
          >
            <ThemedText size={13} color="#fff">
              {t("commentList.retry")}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <ThemedText size={14} color={theme.secondary}>
        {emptyText ?? t("commentList.noComments")}
      </ThemedText>
    </View>
  );
});

type CommentListFooterStateProps = {
  hasItems: boolean;
  loading: boolean;
  hasMore: boolean;
  loadingText?: string;
  allLoadedText?: string;
};

export const CommentListFooterState = memo(function CommentListFooterState({
  hasItems,
  loading,
  hasMore,
  loadingText,
  allLoadedText,
}: CommentListFooterStateProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!hasItems) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.footer}>
        <ThemedText size={12} color={theme.secondary}>
          {loadingText ?? t("commentList.loading")}
        </ThemedText>
      </View>
    );
  }

  if (!hasMore) {
    return (
      <View style={styles.footer}>
        <ThemedText size={12} color={theme.secondary}>
          {allLoadedText ?? t("commentList.allLoaded")}
        </ThemedText>
      </View>
    );
  }

  return null;
});

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 12,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
