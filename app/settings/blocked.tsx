import { api } from "@/api";
import { SettingsScreen } from "@/components/settings/SettingsPrimitives";
import { SettingsState } from "@/components/settings/SettingsState";
import { Avatar } from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { useConfirm } from "@/hooks/useConfirm";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

type BlockedUser = {
  id: string;
  nickname: string;
  avatar?: string;
};

/** 拉取屏蔽列表并为每个 id 解析昵称/头像；单个用户解析失败时降级为展示 id */
async function fetchBlockedUsers(): Promise<BlockedUser[]> {
  const response = await api.messageControllerGetBlockedUsers();
  const ids = response.data?.data?.data ?? [];

  return Promise.all(
    ids.map(async (id) => {
      const rawId = String(id);
      try {
        const detail = await api.userControllerFindOne(rawId);
        const data = detail.data?.data;
        return {
          id: rawId,
          nickname: data?.nickname || data?.username || rawId,
          avatar: data?.avatar || undefined,
        } satisfies BlockedUser;
      } catch {
        return { id: rawId, nickname: rawId } satisfies BlockedUser;
      }
    }),
  );
}

async function runFetch(
  onSuccess: (users: BlockedUser[]) => void,
  onError: () => void,
  onSettled: () => void,
) {
  try {
    onSuccess(await fetchBlockedUsers());
  } catch {
    onError();
  } finally {
    onSettled();
  }
}

export default function BlockedUsersScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { confirm } = useConfirm();
  const navigation = useNavigation();

  const [users, setUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("blockedUsersPage.title") });
  }, [navigation, t]);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    await runFetch(setUsers, () => setFailed(true), () => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      await runFetch(
        (next) => {
          if (active) setUsers(next);
        },
        () => {
          if (active) setFailed(true);
        },
        () => {
          if (active) setLoading(false);
        },
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleUnblock = useCallback(
    (user: BlockedUser) => {
      confirm({
        title: t("blockedUsersPage.unblockTitle"),
        message: t("blockedUsersPage.unblockMessage", {
          name: user.nickname,
        }),
        confirmText: t("blockedUsersPage.unblock"),
        onConfirm: async () => {
          setPendingId(user.id);
          try {
            await api.messageControllerUnblockPrivateUser(user.id);
            setUsers((prev) => prev.filter((item) => item.id !== user.id));
            toast.show(t("blockedUsersPage.unblockSuccess"));
          } catch {
            toast.show(t("blockedUsersPage.unblockFailed"));
          } finally {
            setPendingId(null);
          }
        },
      });
    },
    [confirm, t],
  );

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.card }]}>
        <SettingsState loading />
      </View>
    );
  }

  if (failed) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.card }]}>
        <SettingsState
          message={t("blockedUsersPage.loadFailed")}
          action={
            <Button
              label={t("blockedUsersPage.retry")}
              variant="outline"
              size="md"
              onPress={() => {
                void load();
              }}
            />
          }
        />
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.card }]}>
        <SettingsState message={t("blockedUsersPage.empty")} />
      </View>
    );
  }

  return (
    <SettingsScreen contentStyle={styles.content}>
      <View style={styles.hint}>
        <ThemedText size={12} color={theme.mutedForeground} lineHeight={18}>
          {t("blockedUsersPage.hint")}
        </ThemedText>
      </View>

      {users.map((user, index) => (
        <Pressable
          key={user.id}
          onPress={() => router.push(`/user/${user.id}`)}
          style={({ pressed }) => [
            styles.row,
            index !== users.length - 1 && {
              borderBottomColor: theme.border,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
            pressed && styles.rowPressed,
          ]}
        >
          <Avatar uri={user.avatar} size={40} />
          <View style={styles.rowLabel}>
            <ThemedText size={15} numberOfLines={1}>
              {user.nickname}
            </ThemedText>
          </View>
          <Pressable
            onPress={() => handleUnblock(user)}
            disabled={pendingId === user.id}
            hitSlop={8}
            style={({ pressed }) => [
              styles.action,
              { borderColor: theme.border },
              (pressed || pendingId === user.id) && styles.actionPressed,
            ]}
          >
            <ThemedText size={13} color={theme.mutedForeground}>
              {t("blockedUsersPage.unblock")}
            </ThemedText>
          </Pressable>
        </Pressable>
      ))}
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingTop: 16,
  },
  hint: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  row: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowLabel: {
    flex: 1,
  },
  action: {
    minHeight: 32,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionPressed: {
    opacity: 0.6,
  },
});
