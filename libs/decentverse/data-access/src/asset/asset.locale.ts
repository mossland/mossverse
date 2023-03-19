import { Asset, AssetSummary } from "./asset.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const assetLocale = {
  ...baseLocale,
  name: ["Name", "이름"],
  top: ["Top", "상단"],
  bottom: ["Bottom", "하단"],
  wall: ["Wall", "벽면"],
  lighting: ["Lighting", "조명"],
  collisions: ["Collisions", "충돌"],
  webviews: ["Webviews", "웹뷰"],
  lives: ["Lives", "라이브"],
  dialogues: ["Dialogues", "대화"],
  wh: ["Width/Height", "너비/높이"],
  totalAsset: ["Total Asset", "총 에셋수"],
} as const;

export type AssetLocale = Locale<"asset", Asset & AssetSummary, typeof assetLocale>;
