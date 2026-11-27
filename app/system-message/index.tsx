import MessageCategoryList from "@/components/message/MessageCategoryList";
import { useTranslation } from "react-i18next";

// 系统消息独立页(系统 / 广播通知,type=system)
export default function SystemMessageScreen() {
  const { t } = useTranslation();
  return (
    <MessageCategoryList
      type="system"
      category="system"
      title={t("messagePage.systemTitle")}
      emptyText={t("messagePage.emptySystem")}
    />
  );
}
