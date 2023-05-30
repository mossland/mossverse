import { Teleport, TeleportSummary } from "./teleport.fetch";
import { Translate, baseTrans } from "@util/client";

export const teleportTrans = {
  ...baseTrans,
  map: ["Map", "맵"],
  message: ["Message", "메시지"],
  center: ["Center", "중앙"],
  wh: ["Width/Height", "너비/높이"],
  href: ["Href", "링크"],
  totalTeleport: ["TotalTeleport", "총 모델"], // 모델명 수정 필요
} satisfies Translate<Teleport & TeleportSummary>;
