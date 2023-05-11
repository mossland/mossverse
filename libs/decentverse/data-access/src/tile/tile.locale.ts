import { Tile, TileSummary } from "./tile.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const tileLocale = {
  ...baseLocale,
  map: ["Map", "맵"],
  top: ["Top", "상단"],
  bottom: ["Bottom", "하단"],
  wall: ["Wall", "벽면"],
  lighting: ["Lighting", "조명"],
  center: ["Center", "중심"],
  wh: ["Width & Height", "너비 & 높이"],
  totalTile: ["Total Tile", "총 타일수"],
} as const;

export type TileLocale = Locale<"tile", Tile & TileSummary, typeof tileLocale>;
