import { Collision, CollisionSummary } from "./collision.fetch";
import { Translate, baseTrans } from "@util/client";

export const collisionTrans = {
  ...baseTrans,
  map: ["Map", "맵"],
  message: ["Message", "메시지"],
  center: ["Center", "중앙"],
  wh: ["Width/Height", "너비/높이"],
  totalCollision: ["Total Collision", "총 충돌"],
} satisfies Translate<Collision & CollisionSummary>;
