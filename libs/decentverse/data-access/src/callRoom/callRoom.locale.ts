import { CallRoom, CallRoomSummary } from "./callRoom.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const callRoomLocale = {
  ...baseLocale,
  map: ["Map", "맵"],
  message: ["Message", "메시지"],
  errorMessage: ["Error Message", "에러 메시지"],
  center: ["Center", "중심"],
  wh: ["Width & Height", "너비 & 높이"],
  maxNum: ["Max Number", "최대 인원"],
  roomType: ["Room Type", "방 타입"],
  totalCallRoom: ["Total CallRoom", "총 콜룸"],
} as const;

export type CallRoomLocale = Locale<"callRoom", CallRoom & CallRoomSummary, typeof callRoomLocale>;
