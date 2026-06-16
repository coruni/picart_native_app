import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import {
  getCurrentTargetLang,
  getDetectedLang,
  translateText,
  type TranslateLang,
} from "@/lib/translate";
import { useSettingsStore } from "@/store/settingsStore";
import { useTranslation } from "react-i18next";

interface UseTranslateOptions {
  to?: TranslateLang;
  auto?: boolean;
}

interface UseTranslateResult {
  /** 当前应展示的文本 */
  displayText: string;
  /** 文本切换时的淡入淡出透明度（绑到 Animated.Text/View 的 opacity） */
  fadeAnim: Animated.Value;
  translated: string | null;
  showTranslated: boolean;
  loading: boolean;
  error: string | null;
  /** 微软检测到的源语言代码，翻译完成后才有值 */
  detectedLang: string | null;
  toggle: () => void;
  translate: () => Promise<void>;
  reset: () => void;
}

export function useTranslate(
  source: string,
  options: UseTranslateOptions = {},
): UseTranslateResult {
  const { to, auto = false } = options;
  const globalAutoTranslate = useSettingsStore((s) => s.autoTranslate);
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const [translated, setTranslated] = useState<string | null>(null);
  const [showTranslated, setShowTranslated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const translatedSourceRef = useRef<string | null>(null);
  const loadingRef = useRef(false);
  // 记录当前展示的文本，用于判断是否需要执行动画
  const displayedTextRef = useRef(source);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const displayText =
    showTranslated && translated !== null ? translated : source;

  // 文本实际发生变化时，淡出 → 换内容 → 淡入
  useEffect(() => {
    if (displayedTextRef.current === displayText) return;
    displayedTextRef.current = displayText;

    fadeAnim.setValue(1);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [displayText, fadeAnim]);

  const translate = useCallback(async () => {
    if (loadingRef.current) return;

    if (translated !== null && translatedSourceRef.current === source) {
      setShowTranslated(true);
      return;
    }

    if (!source || !source.trim()) {
      setShowTranslated(true);
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const result = await translateText(source, to ?? getCurrentTargetLang());
      setTranslated(result);
      translatedSourceRef.current = source;
      setDetectedLang(getDetectedLang(source));
      setShowTranslated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "翻译失败");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [translated, source, to]);

  const reset = useCallback(() => {
    setShowTranslated(false);
  }, []);

  const toggle = useCallback(() => {
    if (showTranslated) {
      reset();
    } else {
      void translate();
    }
  }, [showTranslated, reset, translate]);

  useEffect(() => {
    setTranslated(null);
    setShowTranslated(false);
    setDetectedLang(null);
    translatedSourceRef.current = null;
  }, [source, currentLang]);

  useEffect(() => {
    if (!auto) return;
    if (!globalAutoTranslate) {
      setShowTranslated(false);
      return;
    }
    void translate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, globalAutoTranslate, source, to, currentLang]);

  return {
    displayText,
    fadeAnim,
    translated,
    showTranslated,
    loading,
    error,
    detectedLang,
    toggle,
    translate,
    reset,
  };
}
