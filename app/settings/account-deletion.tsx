import { api } from "@/api";
import type { DtoDeletionStatusDto } from "@/api/generated/api";
import {
  SettingsRow,
  SettingsScreen,
  SettingsSection,
} from "@/components/settings/SettingsPrimitives";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { useConfirm } from "@/hooks/useConfirm";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { getApiErrorMessage } from "@/lib/apiMessage";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

/** 后端给的是 ISO 串，这里只用得到日期 */
function formatYmd(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function AccountDeletionScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { confirm } = useConfirm();

  const [status, setStatus] = useState<DtoDeletionStatusDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("accountSettingPage.deletion.title") });
  }, [navigation, t]);

  // 查状态：拿不到就按「未申请」处理，别把页面卡在加载态
  const fetchStatus = useCallback(async () => {
    try {
      const response = await api.userControllerGetDeletionStatus();
      return response.data?.data ?? null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      const next = await fetchStatus();
      if (!active) return;
      setStatus(next);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [fetchStatus]);

  const reload = useCallback(async () => {
    setStatus(await fetchStatus());
  }, [fetchStatus]);

  const handleApply = useCallback(() => {
    confirm({
      title: t("accountSettingPage.deletion.applyConfirmTitle"),
      message: t("accountSettingPage.deletion.applyConfirmMessage"),
      confirmText: t("accountSettingPage.deletion.apply"),
      onConfirm: async () => {
        setSubmitting(true);
        try {
          await api.userControllerRequestAccountDeletion();
          await reload();
        } catch (error) {
          toast.show(
            getApiErrorMessage(error, t("accountSettingPage.deletion.applyFailed")),
          );
        } finally {
          setSubmitting(false);
        }
      },
    });
  }, [confirm, reload, t]);

  const handleCancelApply = useCallback(() => {
    confirm({
      title: t("accountSettingPage.deletion.cancelConfirmTitle"),
      message: t("accountSettingPage.deletion.cancelConfirmMessage"),
      confirmText: t("accountSettingPage.deletion.cancelApply"),
      onConfirm: async () => {
        setSubmitting(true);
        try {
          await api.userControllerCancelAccountDeletion();
          await reload();
        } catch (error) {
          toast.show(
            getApiErrorMessage(error, t("accountSettingPage.deletion.cancelFailed")),
          );
        } finally {
          setSubmitting(false);
        }
      },
    });
  }, [confirm, reload, t]);

  const pending = Boolean(status?.deletion_pending);
  const scheduledAt = formatYmd(status?.scheduled_at);
  const statusText = pending
    ? scheduledAt
      ? t("accountSettingPage.deletion.statusPending", { date: scheduledAt })
      : t("accountSettingPage.deletion.statusPendingNoDate")
    : t("accountSettingPage.deletion.statusNone");

  return (
    <SettingsScreen contentStyle={styles.content}>
      <SettingsSection
        title={t("accountSettingPage.deletion.section")}
        footer={t("accountSettingPage.deletion.footer")}
      >
        <SettingsRow
          label={t("accountSettingPage.deletion.statusLabel")}
          value={loading ? t("accountSettingPage.deletion.statusLoading") : statusText}
        />
      </SettingsSection>

      <View style={styles.actions}>
        {pending ? (
          <Button
            label={t("accountSettingPage.deletion.cancelApply")}
            variant="outline"
            loading={submitting}
            fullWidth
            onPress={handleCancelApply}
          />
        ) : (
          <Button
            label={t("accountSettingPage.deletion.apply")}
            variant="danger"
            loading={submitting}
            disabled={loading}
            fullWidth
            onPress={handleApply}
          />
        )}
        <ThemedText
          size={12}
          color={theme.mutedForeground}
          style={styles.hint}
        >
          {t("accountSettingPage.deletion.itemHint")}
        </ThemedText>
      </View>
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 16 },
  actions: { marginTop: 24, paddingHorizontal: 16, gap: 12 },
  hint: { lineHeight: 18 },
});
