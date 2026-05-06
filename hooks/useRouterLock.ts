import { useCallback, useState } from "react";

export function useRouterLock() {
  const [locked, setLocked] = useState(false);

  const lockNavigate = useCallback(
    (cb: () => void, delay = 500) => {
      if (locked) return;
      setLocked(true);
      cb();
      setTimeout(() => setLocked(false), delay);
    },
    [locked],
  );

  return lockNavigate;
}
