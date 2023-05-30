import { CallRoom, CallRoomSummary } from "./callRoom.fetch";
import { Translate, baseTrans } from "@util/client";

export const callRoomTrans = {
  ...baseTrans,
  map: ["Map", "맵"],
  message: ["Message", "메시지"],
  errorMessage: ["Error Message", "에러 메시지"],
  center: ["Center", "중심"],
  wh: ["Width & Height", "너비 & 높이"],
  maxNum: ["Max Number", "최대 인원"],
  roomType: ["Room Type", "방 타입"],
  totalCallRoom: ["Total CallRoom", "총 콜룸"],
} satisfies Translate<CallRoom & CallRoomSummary>;
