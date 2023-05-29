import { assetTrans } from "./asset/asset.dictionary";
import { callRoomTrans } from "./callRoom/callRoom.dictionary";
import { characterTrans } from "./character/character.dictionary";
import { collisionTrans } from "./collision/collision.dictionary";
import { decentverseTrans } from "./_decentverse/decentverse.dictionary";
import { dialogTrans } from "./dialog/dialog.dictionary";
import { liveTrans } from "./live/live.dictionary";
import { makePageProto } from "@util/client";
import { mapTrans } from "./map/map.dictionary";
import { placementTrans } from "./placement/placement.dictionary";
import { roleTrans } from "./role/role.dictionary";
import { summaryTrans } from "./summary/summary.dictionary";
import { tileTrans } from "./tile/tile.dictionary";
import { userTrans } from "./user/user.dictionary";
import { webviewTrans } from "./webview/webview.dictionary";

export const dictionary = {
  decentverse: decentverseTrans,
  asset: assetTrans,
  callRoom: callRoomTrans,
  character: characterTrans,
  collision: collisionTrans,
  dialog: dialogTrans,
  live: liveTrans,
  map: mapTrans,
  placement: placementTrans,
  role: roleTrans,
  summary: summaryTrans,
  tile: tileTrans,
  user: userTrans,
  webview: webviewTrans,
} as const;
export const usePage = makePageProto([dictionary]);
