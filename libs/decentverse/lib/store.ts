"use client";
import { AssetState, makeAssetSlice } from "./asset/asset.store";
import { CallRoomState, makeCallRoomSlice } from "./callRoom/callRoom.store";
import { CharacterState, makeCharacterSlice } from "./character/character.store";
import { CollisionState, makeCollisionSlice } from "./collision/collision.store";
import { DialogState, makeDialogSlice } from "./dialog/dialog.store";
import { LiveState, makeLiveSlice } from "./live/live.store";
import { MapState, makeMapSlice } from "./map/map.store";
import { PlacementState, makePlacementSlice } from "./placement/placement.store";
import { RoleState, makeRoleSlice } from "./role/role.store";
import { SetGet } from "@util/client";
import { TeleportState, makeTeleportSlice } from "./teleport/teleport.store";
import { TileState, makeTileSlice } from "./tile/tile.store";
import { WebviewState, makeWebviewSlice } from "./webview/webview.store";
import { store as shared } from "@shared/client";
export interface State
  extends AssetState,
    CharacterState,
    DialogState,
    MapState,
    RoleState,
    CallRoomState,
    WebviewState,
    PlacementState,
    CollisionState,
    LiveState,
    TileState,
    TeleportState {}

export interface RootState extends shared.State, State {}

export const addToStore = ({ set, get, pick }: SetGet<RootState>) => ({
  ...makeTeleportSlice({ set, get, pick }),
  ...makeTileSlice({ set, get, pick }),
  ...makeLiveSlice({ set, get, pick }),
  ...makeCallRoomSlice({ set, get, pick }),
  ...makeCollisionSlice({ set, get, pick }),
  ...makePlacementSlice({ set, get, pick }),
  ...makeWebviewSlice({ set, get, pick }),
  ...makeAssetSlice({ set, get, pick }),
  ...makeCharacterSlice({ set, get, pick }),
  ...makeDialogSlice({ set, get, pick }),
  ...makeMapSlice({ set, get, pick }),
  ...makeRoleSlice({ set, get, pick }),
});
