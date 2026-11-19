import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ForwardedRef,
  type RefObject,
} from "react";
import { BackHandler } from "react-native";

type SheetRef =
  | RefObject<BottomSheetModal | null>
  | ForwardedRef<BottomSheetModal>;

function resolveSheet(ref: SheetRef): BottomSheetModal | null {
  if (!ref || typeof ref === "function") return null;
  return ref.current ?? null;
}

/**
 * BottomSheetModal 展开期间接管 Android 物理返回键 / 返回手势：
 * 先收起面板，而不是让导航栈直接把当前页面弹掉。
 *
 * BackHandler 后注册先触发，所以面板的处理会优先于页面级返回逻辑；
 * 多个面板叠加时，最后打开的那个先被关闭。
 *
 * 用法：把返回的 `onAnimate` 传给 `<BottomSheetModal onAnimate={...} />`。
 * 已有 onAnimate 的组件在自己的回调里调用它即可。
 *
 * forwardRef 进来的函数式 ref 拿不到实例，此时传 `dismiss` 覆盖默认关闭逻辑。
 */
export function useSheetBackHandler(
  sheetRef: SheetRef,
  dismiss?: () => void,
) {
  const [open, setOpen] = useState(false);
  const dismissRef = useRef(dismiss);

  useEffect(() => {
    dismissRef.current = dismiss;
  }, [dismiss]);

  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (dismissRef.current) {
        dismissRef.current();
      } else {
        resolveSheet(sheetRef)?.dismiss();
      }
      return true;
    });
    return () => sub.remove();
  }, [open, sheetRef]);

  const onAnimate = useCallback((_fromIndex: number, toIndex: number) => {
    setOpen(toIndex >= 0);
  }, []);

  return { onAnimate };
}
