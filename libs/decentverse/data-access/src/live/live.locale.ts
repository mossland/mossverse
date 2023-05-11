import { Live, LiveSummary } from "./live.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const liveLocale = {
  ...baseLocale,
  map: ["Map", "맵"],
  message: ["Message", "메시지"],
  errorMessage: ["Error Message", "에러 메시지"],
  center: ["Center", "중심"],
  wh: ["Width & Height", "너비 & 높이"],
  src: ["Source", "소스"],
  totalLive: ["Total Live", "총 라이브"],
} as const;

export type LiveLocale = Locale<"live", Live & LiveSummary, typeof liveLocale>;
