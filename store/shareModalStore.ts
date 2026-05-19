import type { ArticleData } from "@/app/article/[id]";
import { create } from "zustand";

type ShareModalState = {
  visible: boolean;
  article?: ArticleData;
  open: (article: ArticleData) => void;
  close: () => void;
};

export const useShareModalStore = create<ShareModalState>((set) => ({
  visible: false,
  article: undefined,
  open: (article) =>
    set({
      visible: true,
      article,
    }),
  close: () =>
    set((state) => ({
      visible: false,
      article: state.article,
    })),
}));
