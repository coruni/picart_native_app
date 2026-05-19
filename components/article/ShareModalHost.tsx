import ShareModal from "@/components/article/ShareModal";
import { useShareModalStore } from "@/store/shareModalStore";
import { useTranslation } from "react-i18next";

export default function ShareModalHost() {
  const { t } = useTranslation();
  const visible = useShareModalStore((state) => state.visible);
  const article = useShareModalStore((state) => state.article);
  const close = useShareModalStore((state) => state.close);

  return (
    <ShareModal
      visible={visible}
      data={article}
      title={t("article.moreActions")}
      onClose={close}
    />
  );
}
