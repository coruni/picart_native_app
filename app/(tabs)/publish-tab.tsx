import { router, useFocusEffect, type Href } from "expo-router";
import { useCallback } from "react";

// TabBar 中间的发布按钮占位路由。
export default function PublishTabScreen() {
  useFocusEffect(
    useCallback(() => {
      router.replace("/publish" as unknown as Href);
    }, []),
  );

  return null;
}
