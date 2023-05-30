import { Notification, NotificationSummary } from "./notification.fetch";
import { Translate, baseTrans } from "@util/client";

export const notificationTrans = {
  ...baseTrans,
  field: ["Field", "필드"],
  totalNotification: ["Total Notification", "총 알림수"],
} satisfies Translate<Notification & NotificationSummary>;
