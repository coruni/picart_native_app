import { api, CreateReportDtoTypeEnum, isAuthRedirectedError } from "@/api";
import type { CommentControllerFindAllComments200ResponseDataDataInner } from "@/api/generated";
import ThemedText from "@/components/ui/ThemedText";
import { useConfirm } from "@/hooks/useConfirm";
import { useReport } from "@/hooks/useReport";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import Clipboard from "@react-native-clipboard/clipboard";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
import Flag01Icon from "@hugeicons/core-free-icons/Flag01Icon";
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";
import HugeIcon from "@/components/ui/HugeIcon";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const RE_HTML_TAGS = /<[^>]*>/g;
const RE_BR_TAGS = /<br\s*\/?>|<\/p>|<\/div>/gi;
const RE_NBSP = /&nbsp;|&#160;/gi;

export function toPlainText(html?: string | null) {
  return (html || "")
    .replace(RE_BR_TAGS, "\n")
    .replace(RE_HTML_TAGS, "")
    .replace(RE_NBSP, " ")
    .trim();
}

export interface CommentActionSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface Props {
  comment: CommentControllerFindAllComments200ResponseDataDataInner | null;
  isOwner?: boolean;
  onDeleted?: (id: number) => void;
  onClosed?: () => void;
}

type SheetActionRowProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
};

function SheetHandle() {
  const { theme } = useTheme();
  return (
    <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
  );
}

function SheetActionRow({
  label,
  icon,
  onPress,
  danger,
}: SheetActionRowProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        pressed && { backgroundColor: theme.secondaryBackground },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <ThemedText variant={danger ? "danger" : "bodySmall"}>{label}</ThemedText>
    </Pressable>
  );
}

const CommentActionSheet = forwardRef<CommentActionSheetRef, Props>(
  function CommentActionSheet({ comment, isOwner, onDeleted, onClosed }, ref) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { confirm } = useConfirm();
    const { report } = useReport();
    const sheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: () => sheetRef.current?.present(),
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const dismiss = useCallback(() => {
      sheetRef.current?.dismiss();
    }, []);

    const renderBackdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    const plainText = useMemo(
      () => toPlainText(comment?.content),
      [comment?.content],
    );

    const handleCopy = useCallback(() => {
      dismiss();
      if (!plainText) return;
      Clipboard.setString(plainText);
      toast.show(t("commentCard.copySuccess"));
    }, [dismiss, plainText, t]);

    const handleReport = useCallback(() => {
      if (!comment?.id) return;
      const commentId = Number(comment.id);
      dismiss();
      report({
        onSubmit: async ({ category, reason }) => {
          try {
            await api.reportControllerCreate({
              type: CreateReportDtoTypeEnum.Comment,
              category,
              reason,
              reportedCommentId: commentId,
            });
            toast.show(t("commentCard.reportSuccess"));
          } catch (error) {
            if (isAuthRedirectedError(error)) return;
            toast.show(t("article.actionFailed"));
          }
        },
      });
    }, [comment, dismiss, report, t]);

    const handleDelete = useCallback(() => {
      if (!comment?.id) return;
      const commentId = Number(comment.id);
      dismiss();
      confirm({
        title: t("commentCard.deleteTitle"),
        message: t("commentCard.deleteMessage"),
        confirmText: t("commentCard.delete"),
        onConfirm: async () => {
          try {
            await api.commentControllerRemove(String(commentId));
            toast.show(t("commentCard.deleteSuccess"));
            onDeleted?.(commentId);
          } catch (error) {
            if (isAuthRedirectedError(error)) return;
            toast.show(t("commentCard.deleteFailed"));
          }
        },
      });
    }, [comment, confirm, dismiss, onDeleted, t]);

    return (
      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        handleComponent={SheetHandle}
        backdropComponent={renderBackdrop}
        onDismiss={onClosed}
        backgroundStyle={[
          styles.sheetBackground,
          {
            backgroundColor: theme.card,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        ]}
      >
        <BottomSheetView style={styles.sheetContent}>
          {plainText ? (
            <SheetActionRow
              label={t("commentCard.copy")}
              icon={<HugeIcon icon={Copy01Icon} size={20} color={theme.foreground} />}
              onPress={handleCopy}
            />
          ) : null}
          {!isOwner ? (
            <SheetActionRow
              label={t("article.report")}
              icon={<HugeIcon icon={Flag01Icon} size={20} color={theme.foreground} />}
              onPress={handleReport}
            />
          ) : null}
          {isOwner ? (
            <SheetActionRow
              label={t("commentCard.delete")}
              icon={<HugeIcon icon={Delete02Icon} size={20} color={theme.danger} />}
              onPress={handleDelete}
              danger
            />
          ) : null}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default CommentActionSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  sheetContent: {
    overflow: "hidden",
    paddingTop: 8,
    paddingBottom: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
});
