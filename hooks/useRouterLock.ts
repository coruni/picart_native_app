import { useCallback, useRef } from "react";

export function useRouterLock() {
  const lockedRef = useRef(false);

  const lockNavigate = useCallback((cb: () => void, delay = 500) => {
    if (lockedRef.current) return; // 使用 ref 避免闭包捕获
    lockedRef.current = true;
    cb();
    setTimeout(() => {
      lockedRef.current = false;
    }, delay);
  }, []);

  return lockNavigate;
}
