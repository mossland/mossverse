import { TeleportSummary } from "../teleport/teleport.gql";
import { TileSummary } from "../tile/tile.gql";
import { LiveSummary } from "../live/live.gql";
import { CollisionSummary } from "../collision/collision.gql";
import { PlacementSummary } from "../placement/placement.gql";
import { WebviewSummary } from "../webview/webview.gql";
import { AssetSummary } from "../asset/asset.gql";
import { CharacterSummary } from "../character/character.gql";
import { DialogSummary } from "../dialog/dialog.gql";
import { MapSummary } from "../map/map.gql";
import { RoleSummary } from "../role/role.gql";
import { CallRoomSummary } from "../callRoom/callRoom.gql";

export const summaries = [TeleportSummary, 
  TileSummary,
  LiveSummary,
  CollisionSummary,
  PlacementSummary,
  WebviewSummary,
  CallRoomSummary,
  AssetSummary,
  CharacterSummary,
  DialogSummary,
  MapSummary,
  RoleSummary,
] as const;
export interface Summary
  extends AssetSummary,
    CharacterSummary,
    //
    DialogSummary,
    MapSummary,
    RoleSummary,
    CallRoomSummary,
    WebviewSummary,
    PlacementSummary,
    CollisionSummary,
    LiveSummary,
    TileSummary, TeleportSummary {}
