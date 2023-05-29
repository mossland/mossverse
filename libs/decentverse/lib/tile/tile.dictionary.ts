import { Tile, TileSummary } from "./tile.fetch";
import { Translate, baseTrans } from "@util/client";

export const tileTrans = {
  ...baseTrans,
  map: ["Map", "맵"],
  top: ["Top", "상단"],
  bottom: ["Bottom", "하단"],
  wall: ["Wall", "벽면"],
  lighting: ["Lighting", "조명"],
  center: ["Center", "중심"],
  wh: ["Width & Height", "너비 & 높이"],
  totalTile: ["Total Tile", "총 타일수"],
} satisfies Translate<Tile & TileSummary>;
