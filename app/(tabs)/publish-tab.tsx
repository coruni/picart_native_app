import { router, useFocusEffect, type Href } from "expo-router";
import { useCallback } from "react";

/**
 * TabBar 中间的发布按钮占位路由。
 * 实际点击由 `(tabs)/_layout.tsx` 的 `tabPress` 拦截并跳转到 `/publish` 栈页面；
 * 这里只在被直接聚焦（深链）时兜底跳转，平时不渲染任何内容。
 */
export default function PublishTabScreen() {
  useFocusEffect(
    useCallback(() => {
      router.replace("/publish" as unknown as Href);
    }, []),
  );

  return null;
}
