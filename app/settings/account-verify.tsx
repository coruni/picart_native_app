import { api } from "@/api";
import type {
  ApplyCertificationDtoTypeEnum,
  UserCertificationControllerGetMyCertificationStatus200ResponseData,
} from "@/api/generated";
import {
  SettingsRow,
  SettingsSection,
  SettingsScreen,
} from "@/components/settings/SettingsPrimitives";
import { uploadCommentImages } from "@/components/comment/CommentComposerModal/imageUpload";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type VerifyType = "official" | "creator";
type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";
type LoadState = "loading" | "ready" | "error";

type Application = UserCertificationControllerGetMyCertificationStatus200ResponseData;

const SLOGAN_MAX = 80;
const DESCRIPTION_MAX = 500;
const MATERIALS_MAX = 3;

function resolveApplyType(
  verifyType: VerifyType,
): ApplyCertificationDtoTypeEnum {
  return verifyType === "creator" ? "CREATOR" : "OFFICIAL";
}

function normalizeStatus(status: string | undefined): ApplicationStatus {
  if (status === "APPROVED" || status === "REJECTED" || status === "REVOKED") {
    return status;
  }
  return "PENDING";
}

/**
 * 只有「审核中」和「已通过」会锁住入口：
 * 前者防重复提交，后者说明已有有效认证。被驳回与被撤销都允许重新申请。
 */
function isLockedStatus(status: ApplicationStatus): boolean {
  return status === "PENDING" || status === "APPROVED";
}

function formatDate(value: string | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function AccountVerifyScreen() {
  const { t } = useTranslation();
  const { theme, colors } = useTheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("accountSettingPage.verifyEntry") });
  }, [navigation, t]);

  const [verifyType, setVerifyType] = useState<VerifyType>("official");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [application, setApplication] = useState<Application | null>(null);

  const [organizationName, setOrganizationName] = useState("");
  const [realName, setRealName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const response =
        await api.userCertificationControllerGetMyCertificationStatus();
      const data = response.data.data;
      setApplication(data && data.id ? data : null);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadStatus();
    }, [loadStatus]),
  );

  const handleRetry = useCallback(() => {
    setLoadState("loading");
    void loadStatus();
  }, [loadStatus]);

  const handlePickMaterial = useCallback(async () => {
    if (materials.length >= MATERIALS_MAX || uploading) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.show(t("accountSettingPage.certify.permissionDenied"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });
    const asset = result.assets?.[0];
    if (result.canceled || !asset?.uri) return;

    setUploading(true);
    setError("");
    try {
      const [url] = await uploadCommentImages([asset]);
      if (!url) throw new Error("empty upload result");
      setMaterials((current) => [...current, url]);
    } catch {
      setError(t("accountSettingPage.certify.uploadFailed"));
    } finally {
      setUploading(false);
    }
  }, [materials.length, uploading, t]);

  const handleRemoveMaterial = useCallback((url: string) => {
    setMaterials((current) => current.filter((item) => item !== url));
  }, []);

  const handleSubmit = useCallback(async () => {
    setError("");
    const trimmedOrg = organizationName.trim();
    const trimmedRealName = realName.trim();
    const trimmedSlogan = slogan.trim();
    const trimmedDescription = description.trim();

    if (verifyType === "official" && !trimmedOrg) {
      setError(t("accountSettingPage.certify.organizationRequired"));
      return;
    }
    if (!trimmedDescription) {
      setError(t("accountSettingPage.certify.descriptionRequired"));
      return;
    }
    if (materials.length === 0) {
      setError(t("accountSettingPage.certify.materialsRequired"));
      return;
    }

    setSubmitting(true);
    try {
      await api.userCertificationControllerApply({
        type: resolveApplyType(verifyType),
        organizationName: trimmedOrg || undefined,
        realName: trimmedRealName || undefined,
        slogan: trimmedSlogan || undefined,
        description: trimmedDescription,
        materials,
      });
      toast.show(t("accountSettingPage.certify.submitSuccess"));
      setOrganizationName("");
      setRealName("");
      setSlogan("");
      setDescription("");
      setMaterials([]);
      setLoadState("loading");
      await loadStatus();
    } catch (submitError) {
      const response = (
        submitError as {
          response?: {
            status?: number;
            data?: { message?: string | string[] };
          };
        }
      )?.response;

      if (response?.status === 409) {
        setError(t("accountSettingPage.certify.alreadyApplied"));
        // 服务端判定已有申请时立即回读，避免界面停留在可提交状态
        await loadStatus();
      } else {
        const message = response?.data?.message;
        const resolved = Array.isArray(message) ? message[0] : message;
        setError(
          resolved?.trim()
            ? resolved
            : t("accountSettingPage.certify.submitFailed"),
        );
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    organizationName,
    realName,
    slogan,
    description,
    materials,
    verifyType,
    loadStatus,
    t,
  ]);

  if (loadState === "loading") {
    return (
      <SettingsScreen contentStyle={styles.loadingContent}>
        <ActivityIndicator color={theme.mutedForeground} />
      </SettingsScreen>
    );
  }

  if (loadState === "error") {
    return (
      <SettingsScreen contentStyle={{ paddingTop: 16 }}>
        <View style={styles.centerBlock}>
          <ThemedText size={14} color={theme.mutedForeground}>
            {t("accountSettingPage.certify.loadFailed")}
          </ThemedText>
          <Button
            label={t("accountSettingPage.certify.retry")}
            variant="outline"
            tone="primary"
            size="md"
            onPress={handleRetry}
          />
        </View>
      </SettingsScreen>
    );
  }

  if (application && isLockedStatus(normalizeStatus(application.status))) {
    const status = normalizeStatus(application.status);
    const appliedType =
      application.type === "CREATOR"
        ? t("accountSettingPage.verifyCreator")
        : t("accountSettingPage.verifyOfficial");
    const tone = status === "APPROVED" ? "primary" : "neutral";

    return (
      <SettingsScreen contentStyle={{ paddingTop: 16 }}>
        <SettingsSection title={t("accountSettingPage.certify.statusSection")}>
          <SettingsRow
            label={t("accountSettingPage.verifyStatus")}
            right={
              <Badge
                variant="label"
                tone={tone}
                label={t(`accountSettingPage.certify.status.${status}`)}
                outlined
              />
            }
            showBorder
          />
          <SettingsRow
            label={t("accountSettingPage.certify.appliedType")}
            value={appliedType}
            showBorder
          />
          {application.organizationName ? (
            <SettingsRow
              label={t("accountSettingPage.certify.organizationLabel")}
              value={application.organizationName}
              showBorder
            />
          ) : null}
          {application.slogan ? (
            <SettingsRow
              label={t("accountSettingPage.certify.sloganLabel")}
              value={application.slogan}
              showBorder
            />
          ) : null}
          <SettingsRow
            label={t("accountSettingPage.certify.submittedAt")}
            value={formatDate(application.createdAt)}
          />
        </SettingsSection>

        <ThemedText
          size={13}
          color={theme.mutedForeground}
          style={styles.notice}
        >
          {t(`accountSettingPage.certify.statusHint.${status}`)}
        </ThemedText>
      </SettingsScreen>
    );
  }

  const previousStatus = application
    ? normalizeStatus(application.status)
    : null;
  const materialsFull = materials.length >= MATERIALS_MAX;
  const descriptionBorder = descriptionFocused
    ? colors.primary
    : theme.border;

  const typeOptions: { key: VerifyType; label: string }[] = [
    {
      key: "official",
      label: t("accountSettingPage.verifyOfficial"),
    },
    {
      key: "creator",
      label: t("accountSettingPage.verifyCreator"),
    },
  ];

  return (
    <SettingsScreen contentStyle={{ paddingTop: 16 }}>
      {previousStatus ? (
        <SettingsSection title={t("accountSettingPage.certify.statusSection")}>
          <SettingsRow
            label={t("accountSettingPage.verifyStatus")}
            right={
              <Badge
                variant="label"
                tone="danger"
                label={t(`accountSettingPage.certify.status.${previousStatus}`)}
                outlined
              />
            }
            showBorder
          />
          <SettingsRow
            label={t("accountSettingPage.certify.submittedAt")}
            value={formatDate(application?.createdAt)}
            showBorder={Boolean(
              previousStatus === "REJECTED" && application?.reviewReason,
            )}
          />
          {previousStatus === "REJECTED" && application?.reviewReason ? (
            <View style={styles.reasonBox}>
              <ThemedText size={13} color={theme.danger} lineHeight={20}>
                {application.reviewReason}
              </ThemedText>
            </View>
          ) : null}
        </SettingsSection>
      ) : null}

      {previousStatus ? (
        <ThemedText
          size={13}
          color={theme.mutedForeground}
          style={styles.reapplyHint}
        >
          {t("accountSettingPage.certify.reapplyHint")}
        </ThemedText>
      ) : null}

      <SettingsSection
        title={
          previousStatus
            ? t("accountSettingPage.certify.reapplySection")
            : t("accountSettingPage.certify.formSection")
        }
        footer={t(`accountSettingPage.${verifyType}Footer`)}
      >
        <View style={styles.typeSwitchWrap}>
          <View
            style={[
              styles.typeSwitch,
              { backgroundColor: theme.secondaryBackground },
            ]}
          >
            {typeOptions.map((option) => {
              const active = verifyType === option.key;
              return (
                <Pressable
                  key={option.key}
                  onPress={() => {
                    setVerifyType(option.key);
                    setError("");
                  }}
                  disabled={submitting}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={option.label}
                  style={[
                    styles.typeSegment,
                    active && { backgroundColor: theme.card },
                  ]}
                >
                  <ThemedText
                    size={14}
                    fontWeight={active ? "600" : "400"}
                    color={active ? theme.foreground : theme.mutedForeground}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.form}>
          {verifyType === "official" ? (
            <FloatInput
              label={t("accountSettingPage.certify.organizationLabel")}
              placeholder={t(
                "accountSettingPage.certify.organizationPlaceholder",
              )}
              value={organizationName}
              onChangeText={(v) => {
                setOrganizationName(v);
                setError("");
              }}
              maxLength={60}
              editable={!submitting}
            />
          ) : null}
          <FloatInput
            label={t("accountSettingPage.certify.realNameLabel")}
            placeholder={t("accountSettingPage.certify.realNamePlaceholder")}
            value={realName}
            onChangeText={(v) => {
              setRealName(v);
              setError("");
            }}
            maxLength={40}
            editable={!submitting}
          />
          <FloatInput
            label={t("accountSettingPage.certify.sloganLabel")}
            placeholder={t("accountSettingPage.certify.sloganPlaceholder")}
            value={slogan}
            onChangeText={(v) => {
              setSlogan(v);
              setError("");
            }}
            maxLength={SLOGAN_MAX}
            editable={!submitting}
          />
          <View>
            <ThemedText
              size={13}
              color={theme.mutedForeground}
              style={styles.textareaLabel}
            >
              {t("accountSettingPage.certify.descriptionLabel")}
            </ThemedText>
            <View
              style={[
                styles.textarea,
                { borderColor: descriptionBorder, backgroundColor: theme.card },
              ]}
            >
              <TextInput
                value={description}
                onChangeText={(v) => {
                  setDescription(v);
                  setError("");
                }}
                onFocus={() => setDescriptionFocused(true)}
                onBlur={() => setDescriptionFocused(false)}
                placeholder={t(
                  "accountSettingPage.certify.descriptionPlaceholder",
                )}
                placeholderTextColor={theme.secondary}
                multiline
                textAlignVertical="top"
                maxLength={DESCRIPTION_MAX}
                editable={!submitting}
                style={[styles.textareaInput, { color: theme.foreground }]}
              />
            </View>
            <ThemedText
              size={12}
              color={theme.mutedForeground}
              style={styles.counter}
            >
              {description.length}/{DESCRIPTION_MAX}
            </ThemedText>
          </View>
        </View>
      </SettingsSection>

      <SettingsSection
        title={t("accountSettingPage.certify.materialsSection")}
        footer={t("accountSettingPage.certify.materialsFooter", {
          max: MATERIALS_MAX,
        })}
      >
        {materials.map((url, index) => (
          <Pressable
            key={url}
            onPress={() => handleRemoveMaterial(url)}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel={t("accountSettingPage.certify.materialRemove")}
            style={({ pressed }) => [
              styles.materialRow,
              { borderBottomColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Image source={{ uri: url }} style={styles.thumb} />
            <ThemedText size={14} style={styles.materialLabel}>
              {t("accountSettingPage.certify.materialItem", {
                index: index + 1,
              })}
            </ThemedText>
            <ThemedText size={13} color={theme.danger}>
              {t("accountSettingPage.certify.materialRemove")}
            </ThemedText>
          </Pressable>
        ))}

        {materialsFull ? null : (
          <Pressable
            onPress={() => {
              void handlePickMaterial();
            }}
            disabled={uploading || submitting}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.uploadRow,
              { borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            {uploading ? (
              <ActivityIndicator color={theme.mutedForeground} />
            ) : (
              <ThemedText size={14} color={theme.primary}>
                {t("accountSettingPage.certify.materialsAdd")}
              </ThemedText>
            )}
          </Pressable>
        )}
      </SettingsSection>

      {error ? (
        <ThemedText size={12} color={theme.danger} style={styles.errorText}>
          {error}
        </ThemedText>
      ) : null}

      <View style={styles.submitWrap}>
        <Button
          label={
            previousStatus
              ? t("accountSettingPage.certify.resubmit")
              : t("accountSettingPage.certify.submit")
          }
          size="lg"
          fullWidth
          loading={submitting}
          disabled={uploading}
          onPress={() => {
            void handleSubmit();
          }}
        />
      </View>

      <ThemedText size={12} color={theme.mutedForeground} style={styles.notice}>
        {t(`accountSettingPage.${verifyType}Notice`)}
      </ThemedText>
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  loadingContent: {
    paddingTop: 80,
    alignItems: "center",
  },
  centerBlock: {
    paddingHorizontal: 16,
    paddingTop: 40,
    alignItems: "center",
    gap: 16,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 20,
    gap: 16,
  },
  typeSwitchWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  typeSwitch: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  typeSegment: {
    flex: 1,
    minHeight: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textarea: {
    minHeight: 128,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textareaLabel: {
    marginBottom: 8,
    marginLeft: 2,
  },
  textareaInput: {
    minHeight: 100,
    fontSize: 15,
    lineHeight: 21,
  },
  counter: {
    marginTop: 6,
    marginRight: 4,
    textAlign: "right",
  },
  materialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  materialLabel: {
    flex: 1,
  },
  uploadRow: {
    marginHorizontal: 16,
    marginVertical: 12,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
  errorText: {
    marginHorizontal: 16,
    marginTop: 8,
    lineHeight: 18,
  },
  reasonBox: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  reapplyHint: {
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 24,
    lineHeight: 20,
  },
  submitWrap: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  notice: {
    marginHorizontal: 16,
    marginTop: 16,
    lineHeight: 20,
  },
});
