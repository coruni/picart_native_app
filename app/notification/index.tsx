import { MessageControllerSearchTypeEnum } from "@/api/generated";
import MessageCategoryList from "@/components/message/MessageCategoryList";
import { useTranslation } from "react-i18next";

// 互动通知独立页(评论 / 回复 / 点赞 / 关注等,type=notification)
export default function NotificationScreen() {
  const { t } = useTranslation();
  return (
    <MessageCategoryList
      type={MessageControllerSearchTypeEnum.Notification}
      category="notification"
      title={t("messagePage.notificationTitle")}
      emptyText={t("messagePage.emptyNotifications")}
    />
  );
}
