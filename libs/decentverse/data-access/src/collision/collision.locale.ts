import { Collision, CollisionSummary } from "./collision.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const collisionLocale = {
  ...baseLocale,
  map: ["Map", "맵"],
  message: ["Message", "메시지"],
  center: ["Center", "중앙"],
  wh: ["Width/Height", "너비/높이"],
  totalCollision: ["Total Collision", "총 충돌"],
} as const;

export type CollisionLocale = Locale<"collision", Collision & CollisionSummary, typeof collisionLocale>;
