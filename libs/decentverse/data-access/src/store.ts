import { TeleportState, addTeleportToStore } from "./teleport/teleport.store";
import { TileState, addTileToStore } from "./tile/tile.store";
import { LiveState, addLiveToStore } from "./live/live.store";
import { CollisionState, addCollisionToStore } from "./collision/collision.store";
import { PlacementState, addPlacementToStore } from "./placement/placement.store";
import { WebviewState, addWebviewToStore } from "./webview/webview.store";
import { CallRoomState, addCallRoomToStore } from "./callRoom/callRoom.store";
import { store as shared } from "@shared/data-access";
import { AssetState, addAssetToStore } from "./asset/asset.store";
import { CharacterState, addCharacterToStore } from "./character/character.store";
import { DialogState, addDialogToStore } from "./dialog/dialog.store";
import { MapState, addMapToStore } from "./map/map.store";
import { RoleState, addRoleToStore } from "./role/role.store";
import { SetGet } from "@shared/util-client";
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
    TileState, TeleportState {}

export interface RootState extends shared.State, State {}

export const addToStore = ({ set, get, pick }: SetGet<RootState>) => ({
...addTeleportToStore({ set, get, pick }),
  ...addTileToStore({ set, get, pick }),
  ...addLiveToStore({ set, get, pick }),
  ...addCallRoomToStore({ set, get, pick }),
  ...addCollisionToStore({ set, get, pick }),
  ...addPlacementToStore({ set, get, pick }),
  ...addWebviewToStore({ set, get, pick }),
  ...addAssetToStore({ set, get, pick }),
  ...addCharacterToStore({ set, get, pick }),
  ...addDialogToStore({ set, get, pick }),
  ...addMapToStore({ set, get, pick }),
  ...addRoleToStore({ set, get, pick }),
});
