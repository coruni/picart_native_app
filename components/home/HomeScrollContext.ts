import { createContext, useContext, useEffect, useRef } from "react";

export type HomeScrollContextType = {
  register: (key: string, fn: () => void) => void;
  unregister: (key: string) => void;
};

export const HomeScrollContext = createContext<HomeScrollContextType | null>(
  null,
);

/**
 * 让首页各 tab 的列表注册自己的「滚动到顶部」函数。
 * 点击已选中的 tab 时由父级触发，实现回到顶部。
 */
export function useRegisterScrollToTop(key: string, fn: () => void) {
  const ctx = useContext(HomeScrollContext);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!ctx) return;
    const stable = () => fnRef.current();
    ctx.register(key, stable);
    return () => ctx.unregister(key);
  }, [ctx, key]);
}
