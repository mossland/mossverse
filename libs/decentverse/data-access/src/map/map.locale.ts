import { Map, MapSummary } from "./map.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const mapLocale = {
  ...baseLocale,
  name: ["Name", "이름"],
  splash: ["Splash", "스플래시"],
  logo: ["Logo", "로고"],
  miniView: ["Mini View", "미니뷰"],
  startPosition: ["Start Position", "시작 위치"],
  spawnPositions: ["Spawn Position", "소환 위치"],
  config: ["Config", "설정"],
  wh: ["Width/Height", "너비/높이"],
  totalMap: ["Total Map", "총 맵수"],
} as const;

export type MapLocale = Locale<"map", Map & MapSummary, typeof mapLocale>;
