import { Placement, PlacementSummary } from "./placement.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const placementLocale = {
  ...baseLocale,
  map: ["Map", "맵"],
  asset: ["Asset", "에셋"],
  center: ["Center", "중앙"],
  wh: ["Width/Height", "너비/높이"],
  totalPlacement: ["Total Placement", "총 배치"],
} as const;

export type PlacementLocale = Locale<"placement", Placement & PlacementSummary, typeof placementLocale>;
