import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => void;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const optionsRef = useRef<ConfirmOptions | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    optionsRef.current = options;
    setVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setVisible(false);
    optionsRef.current?.onCancel?.();
  }, []);

  const handleConfirm = useCallback(async () => {
    setVisible(false);
    await optionsRef.current?.onConfirm();
  }, []);

  const opts = optionsRef.current;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        hardwareAccelerated
        onRequestClose={handleCancel}
      >
        <Pressable style={styles.overlay} onPress={handleCancel}>
          <Pressable style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.header}>
              <ThemedText fontWeight="600" size={16}>
                {opts?.title}
              </ThemedText>
            </View>
            <ThemedText size={14} color={theme.secondary} style={styles.body}>
              {opts?.message}
            </ThemedText>
            <View style={styles.actions}>
              <Pressable
                style={[
                  styles.btn,
                  {
                    borderColor: "transparent",
                    backgroundColor: theme.primary + "26",
                  },
                ]}
                onPress={handleCancel}
              >
                <ThemedText size={15} color={theme.primary} numberOfLines={1}>
                  {t("cancel")}
                </ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.btn,
                  {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={handleConfirm}
              >
                <ThemedText
                  size={15}
                  color="white"
                  fontWeight="600"
                  numberOfLines={1}
                >
                  {opts?.confirmText}
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  card: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  body: {
    paddingHorizontal: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  btn: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
