import { AssetSummary } from "../asset/asset.fetch";
import { CallRoomSummary } from "../callRoom/callRoom.fetch";
import { CharacterSummary } from "../character/character.fetch";
import { CollisionSummary } from "../collision/collision.fetch";
import { DialogSummary } from "../dialog/dialog.fetch";
import { LiveSummary } from "../live/live.fetch";
import { MapSummary } from "../map/map.fetch";
import { PlacementSummary } from "../placement/placement.fetch";
import { RoleSummary } from "../role/role.fetch";
import { TileSummary } from "../tile/tile.fetch";
import { WebviewSummary } from "../webview/webview.fetch";

export const summaries = [
  // TeleportSummary,
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
    //TeleportSummary,
    DialogSummary,
    MapSummary,
    RoleSummary,
    CallRoomSummary,
    WebviewSummary,
    PlacementSummary,
    CollisionSummary,
    LiveSummary,
    TileSummary {}
