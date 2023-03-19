import { Teleport, TeleportSummary } from "./teleport.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const teleportLocale = {
  ...baseLocale,
  map: ["Map", "맵"],
  message: ["Message", "메시지"],
  center: ["Center", "중앙"],
  wh: ["Width/Height", "너비/높이"],
  href: ["Href", "링크"],
  totalTeleport: ["TotalTeleport", "총 모델"], // 모델명 수정 필요
} as const;

export type TeleportLocale = Locale<"teleport", Teleport & TeleportSummary, typeof teleportLocale>;
