import api from "@/api/client";
import { UpdateUserDtoGenderEnum } from "@/api/generated/api";
import { Avatar } from "@/components/ui/Avatar";
import ImageCropperSheet, {
  type ImageCropperSheetRef,
} from "@/components/ui/ImageCropperSheet";
import ThemedText from "@/components/ui/ThemedText";
import { useForm } from "@/hooks/useForm";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { uploadSingleImage } from "@/lib/uploadImage";
import { useAuthStore } from "@/store/authStore";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import { ChevronRight, X } from "lucide-react-native";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const NICKNAME_MAX = 20;
const BIO_MAX = 200;
const INPUT_H = 54;

type GenderValue = "male" | "female" | "other";

const GENDER_OPTIONS: { label_key: string; value: GenderValue }[] = [
  { label_key: "editProfile.genderMale", value: "male" },
  { label_key: "editProfile.genderFemale", value: "female" },
  { label_key: "editProfile.genderOther", value: "other" },
];

export default function EditProfileScreen() {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);

  const genderSheetRef = useRef<BottomSheetModal>(null);
  const avatarCropperRef = useRef<ImageCropperSheetRef>(null);
  const [localAvatar, setLocalAvatar] = useState<string | undefined>(undefined);
  const [nicknameFocused, setNicknameFocused] = useState(false);
  const [bioFocused, setBioFocused] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    isSubmitting,
  } = useForm({
    initialValues: {
      nickname: profile?.nickname ?? "",
      bio: profile?.description ?? "",
      gender: (profile?.gender ?? "other") as string,
    },
    validationRules: {
      nickname: {
        maxLength: {
          value: NICKNAME_MAX,
          message: t("editProfile.nicknameMaxLength", { max: NICKNAME_MAX }),
        },
      },
      bio: {
        maxLength: {
          value: BIO_MAX,
          message: t("editProfile.bioMaxLength", { max: BIO_MAX }),
        },
      },
    },
    onSubmit: async (vals) => {
      if (!profile?.id) return;
      let avatarUrl: string | undefined;
      if (localAvatar) {
        avatarUrl = await uploadSingleImage(localAvatar);
      }
      await api.userControllerUpdate(String(profile.id), {
        nickname: vals.nickname.trim() || undefined,
        description: vals.bio.trim() || undefined,
        gender: vals.gender as UpdateUserDtoGenderEnum,
        avatar: avatarUrl,
      });
      const { data } = await api.userControllerGetProfile();
      await setProfile(data.data);
      toast.show(t("editProfile.saveSuccess"));
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("editProfile.title") });
  }, [navigation, t]);

  const genderLabel = GENDER_OPTIONS.find((o) => o.value === values.gender);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    [],
  );

  function SheetHandle() {
    return (
      <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
    );
  }

  const nicknameBorderColor = errors.nickname
    ? "#ef4444"
    : nicknameFocused
      ? colors.primary
      : theme.border;

  const bioBorderColor = errors.bio
    ? "#ef4444"
    : bioFocused
      ? colors.primary
      : theme.border;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.card }]}
      edges={["bottom"]}
    >
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bottomOffset={120}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 头像区域 */}
        <View style={[styles.avatarSection, { backgroundColor: theme.card }]}>
          <Avatar
            uri={localAvatar ?? profile?.avatar}
            size={80}
            border
            rounded
          />
          <View style={styles.avatarBtns}>
            <Pressable
              style={[
                styles.avatarBtn,
                { backgroundColor: theme.secondaryBackground },
              ]}
              onPress={() => avatarCropperRef.current?.present()}
            >
              <ThemedText size={13} color={theme.secondary}>
                {t("editProfile.changeAvatar")}
              </ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.avatarBtn,
                { backgroundColor: theme.secondaryBackground },
              ]}
            >
              <ThemedText size={13} color={theme.secondary}>
                {t("editProfile.changeFrame")}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* 表单区域 */}
        <View style={[styles.formSection, { backgroundColor: theme.card }]}>
          {/* 昵称 */}
          <View style={styles.fieldWrap}>
            <ThemedText
              size={13}
              color={theme.secondary}
              style={styles.fieldLabel}
            >
              {t("editProfile.nickname")}
            </ThemedText>
            <View
              style={[styles.inputBox, { borderColor: nicknameBorderColor }]}
            >
              <TextInput
                style={[styles.input, { color: theme.foreground }]}
                value={values.nickname}
                onChangeText={(v) => handleChange("nickname", v)}
                onFocus={() => setNicknameFocused(true)}
                onBlur={() => {
                  setNicknameFocused(false);
                  handleBlur("nickname");
                }}
                maxLength={NICKNAME_MAX}
                cursorColor={colors.primary}
                selectionColor={colors.primary}
              />
            </View>
            {errors.nickname ? (
              <ThemedText size={12} color="#ef4444" style={styles.fieldHint}>
                {errors.nickname}
              </ThemedText>
            ) : null}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* 性别 */}
          <View style={styles.fieldWrap}>
            <ThemedText
              size={13}
              color={theme.secondary}
              style={styles.fieldLabel}
            >
              {t("editProfile.gender")}
            </ThemedText>
            <Pressable
              style={[styles.inputBox, { borderColor: theme.border }]}
              onPress={() => genderSheetRef.current?.present()}
            >
              <ThemedText
                size={15}
                color={theme.foreground}
                style={styles.selectValue}
              >
                {genderLabel ? t(genderLabel.label_key) : ""}
              </ThemedText>
              <ChevronRight size={18} color={theme.secondary} />
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* 个性签名 */}
          <View style={styles.fieldWrap}>
            <ThemedText
              size={13}
              color={theme.secondary}
              style={styles.fieldLabel}
            >
              {t("editProfile.bio")}
            </ThemedText>
            <TextInput
              style={[
                styles.bioInput,
                { color: theme.foreground, borderColor: bioBorderColor },
              ]}
              value={values.bio}
              onChangeText={(v) => handleChange("bio", v)}
              onFocus={() => setBioFocused(true)}
              onBlur={() => {
                setBioFocused(false);
                handleBlur("bio");
              }}
              multiline
              maxLength={BIO_MAX}
              placeholder={t("editProfile.bio")}
              placeholderTextColor={theme.secondary}
              cursorColor={colors.primary}
              selectionColor={colors.primary}
              textAlignVertical="top"
            />
            {errors.bio ? (
              <ThemedText size={12} color="#ef4444" style={styles.fieldHint}>
                {errors.bio}
              </ThemedText>
            ) : (
              <ThemedText
                size={12}
                color={theme.secondary}
                style={styles.bioCount}
              >
                {values.bio.length}/{BIO_MAX}
              </ThemedText>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* 底部固定保存按钮 */}
      <View
        style={[
          styles.footer,
          { borderTopColor: theme.border, backgroundColor: theme.card },
        ]}
      >
        <Pressable
          style={[
            styles.saveBtn,
            { backgroundColor: colors.primary },
            isSubmitting && styles.saveBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText fontWeight="700" size={16} color="#fff">
              {t("editProfile.save")}
            </ThemedText>
          )}
        </Pressable>
      </View>

      {/* 性别选择 BottomSheet */}
      <BottomSheetModal
        ref={genderSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        handleComponent={SheetHandle}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
      >
        <BottomSheetView style={styles.sheetContent}>
          <ThemedText fontWeight="600" size={15} style={styles.sheetTitle}>
            {t("editProfile.selectGender")}
          </ThemedText>
          {GENDER_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[
                styles.sheetOption,
                { borderBottomColor: theme.border },
                opt.value === values.gender && {
                  backgroundColor: theme.secondaryBackground,
                },
              ]}
              onPress={() => {
                setValue("gender", opt.value);
                genderSheetRef.current?.dismiss();
              }}
            >
              <ThemedText
                size={14}
                color={
                  opt.value === values.gender
                    ? colors.primary
                    : theme.foreground
                }
              >
                {t(opt.label_key)}
              </ThemedText>
            </Pressable>
          ))}
          <Pressable
            style={[styles.sheetCancel, { borderTopColor: theme.border }]}
            onPress={() => genderSheetRef.current?.dismiss()}
          >
            <X size={18} color={theme.secondary} style={styles.cancelIcon} />

            <ThemedText size={15} color={theme.secondary}>
              {t("cancel")}
            </ThemedText>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>

      {/* 头像裁剪器 */}
      <ImageCropperSheet
        ref={avatarCropperRef}
        mode="avatar"
        avatarSize={400}
        onCrop={(uri) => setLocalAvatar(uri)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { gap: 12 },

  avatarSection: {
    alignItems: "center",
    paddingVertical: 28,
    gap: 14,
  },
  avatarBtns: { flexDirection: "row", gap: 10 },
  avatarBtn: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },

  formSection: { paddingHorizontal: 16 },
  fieldWrap: { paddingVertical: 12 },
  fieldLabel: { marginBottom: 8 },
  fieldMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  fieldTip: { flex: 1, marginRight: 8 },
  fieldHint: { marginTop: 4, marginLeft: 4 },

  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: -16 },

  inputBox: {
    height: INPUT_H,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: INPUT_H,
    fontSize: 15,
  },
  selectValue: { flex: 1 },

  bioInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    height: 120,
  },
  bioCount: { textAlign: "right", marginTop: 6, paddingHorizontal: 4 },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveBtn: {
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnDisabled: { opacity: 0.6 },

  sheetBg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  sheetContent: { paddingBottom: 16, overflow: "hidden" },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
  },
  sheetTitle: { textAlign: "left", paddingVertical: 14, paddingHorizontal: 16 },
  sheetOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sheetCancel: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,

    justifyContent: "center",
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cancelIcon: { marginTop: 1 },
});
