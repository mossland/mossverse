import { Notification, NotificationSummary } from "./notification.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const notificationLocale = {
  ...baseLocale,
  field: ["Field", "필드"],
  totalNotification: ["Total Notification", "총 알림수"],
} as const;

export type NotificationLocale = Locale<"notification", Notification & NotificationSummary, typeof notificationLocale>;
