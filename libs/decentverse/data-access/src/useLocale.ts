import { mainLocale, MainLocale } from "./main.locale";
import { assetLocale, AssetLocale } from "./asset/asset.locale";
import { callRoomLocale, CallRoomLocale } from "./callRoom/callRoom.locale";
import { characterLocale, CharacterLocale } from "./character/character.locale";
import { collisionLocale, CollisionLocale } from "./collision/collision.locale";
import { dialogLocale, DialogLocale } from "./dialog/dialog.locale";
import { liveLocale, LiveLocale } from "./live/live.locale";
import { mapLocale, MapLocale } from "./map/map.locale";
import { placementLocale, PlacementLocale } from "./placement/placement.locale";
import { roleLocale, RoleLocale } from "./role/role.locale";
import { summaryLocale, SummaryLocale } from "./summary/summary.locale";
import { tileLocale, TileLocale } from "./tile/tile.locale";
import { userLocale, UserLocale } from "./user/user.locale";
import { webviewLocale, WebviewLocale } from "./webview/webview.locale";
import { makeLocale } from "@shared/util-client";
import { useTranslation } from "react-i18next";

export const locale = {
  main: mainLocale,
  asset: assetLocale,
  callRoom: callRoomLocale,
  character: characterLocale,
  collision: collisionLocale,
  dialog: dialogLocale,
  live: liveLocale,
  map: mapLocale,
  placement: placementLocale,
  role: roleLocale,
  summary: summaryLocale,
  tile: tileLocale,
  user: userLocale,
  webview: webviewLocale,
} as const;

export type Locale =
  | MainLocale
  | AssetLocale
  | CallRoomLocale
  | CharacterLocale
  | CollisionLocale
  | DialogLocale
  | LiveLocale
  | MapLocale
  | PlacementLocale
  | RoleLocale
  | SummaryLocale
  | TileLocale
  | UserLocale
  | WebviewLocale;

export const useLocale = () => {
  const { t, i18n } = useTranslation();
  const { l, lang, setLang } = makeLocale<Locale>(t);
  return { l, lang, setLang };
};
