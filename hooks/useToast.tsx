import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastPosition = "top" | "center" | "bottom";

type ToastOptions = {
  message: string;
  duration?: number;
  position?: ToastPosition;
};

type ToastInput = string | ToastOptions;

type ToastContextValue = {
  showToast: (input: ToastInput) => void;
  hideToast: () => void;
};

const DEFAULT_DURATION = 2000;
const ToastContext = createContext<ToastContextValue | null>(null);

let toastHandler: ToastContextValue | null = null;

export const toast = {
  show(input: ToastInput) {
    toastHandler?.showToast(input);
  },
  hide() {
    toastHandler?.hideToast();
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [options, setOptions] = useState<ToastOptions | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearTimer();
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 8,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setOptions(null);
    });
  }, [clearTimer, opacity, translateY]);

  const showToast = useCallback(
    (input: ToastInput) => {
      const nextOptions =
        typeof input === "string" ? { message: input } : input;

      clearTimer();
      setOptions(nextOptions);
      opacity.stopAnimation();
      translateY.stopAnimation();
      opacity.setValue(0);
      translateY.setValue(8);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(
        hideToast,
        nextOptions.duration ?? DEFAULT_DURATION,
      );
    },
    [clearTimer, hideToast, opacity, translateY],
  );

  useEffect(() => {
    toastHandler = { showToast, hideToast };
    return () => {
      if (toastHandler?.showToast === showToast) toastHandler = null;
      clearTimer();
    };
  }, [clearTimer, hideToast, showToast]);

  const position = options?.position ?? "center";
  const positionStyle = getPositionStyle(position, insets.top, insets.bottom);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {options ? (
        <View pointerEvents="none" style={[styles.layer, positionStyle]}>
          <Animated.View
            style={[
              styles.toast,
              {
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            <Text style={styles.message}>{options.message}</Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function getPositionStyle(
  position: ToastPosition,
  topInset: number,
  bottomInset: number,
): ViewStyle {
  if (position === "top") {
    return {
      top: topInset + 56,
      justifyContent: "flex-start",
    };
  }

  // bottom
  if (position === "bottom") {
    return {
      bottom: bottomInset + 64,
      justifyContent: "flex-end",
    };
  }

  return {
    top: 0,
    bottom: 0,
    justifyContent: "center",
  };
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    maxWidth: "100%",
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
