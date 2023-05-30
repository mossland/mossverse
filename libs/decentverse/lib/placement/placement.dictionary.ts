import { Placement, PlacementSummary } from "./placement.fetch";
import { Translate, baseTrans } from "@util/client";

export const placementTrans = {
  ...baseTrans,
  map: ["Map", "맵"],
  asset: ["Asset", "에셋"],
  center: ["Center", "중앙"],
  wh: ["Width/Height", "너비/높이"],
  totalPlacement: ["Total Placement", "총 배치"],
} satisfies Translate<Placement & PlacementSummary>;
