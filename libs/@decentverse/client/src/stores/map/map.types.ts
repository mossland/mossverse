import { client } from "../gql";
import gql from "graphql-tag";
import * as types from "../types";
import { Nullable } from "@shared/util-client";
import { Dialogue, DialogueInput, dialogueFragment } from "../dialog/dialog.types";
export type MapInput = {
  name: string;
  tileSize: number;
  top: types.ID | null;
  bottom: types.ID;
  lighting: types.ID | null;
  placements: types.PlacementInput[];
  collisions: types.CollisionInput[];
  webviews: types.WebviewInput[];
  lives: types.LiveInput[];
  callRooms: types.CallRoomInput[];
  dialogues: DialogueInput[];
  config: types.MapConfigInput;
};

export const defaultMap: Nullable<Map> = {
  id: null,
  name: "",
  tileSize: 200,
  top: null,
  bottom: null,
  lighting: null,
  placements: [],
  collisions: [],
  webviews: [],
  lives: [],
  callRooms: [],
  dialogues: [],
  config: {
    dayNight: true,
  },
  tiles: [],
  wh: [0, 0],
  status: null,
  createdAt: null,
  updatedAt: null,
};

export const purifyMap = (map: Map): MapInput => ({
  name: map.name,
  tileSize: map.tileSize,
  top: map.top?.id ?? null,
  bottom: map.bottom?.id,
  lighting: map.lighting?.id ?? null,
  placements: map.placements.map((placement) => types.purifyPlacement(placement)),
  collisions: map.collisions.map((collision) => types.purifyCollision(collision)),
  webviews: map.webviews.map((webview) => types.purifyWebview(webview)),
  lives: map.lives.map((live) => types.purifyLive(live)),
  callRooms: map.callRooms.map((callRoom) => types.purifyCallRoom(callRoom)),
  dialogues: map.dialogues.map((dialogue) => types.purifyDialogue(dialogue)),
  config: types.purifyMapConfig(map.config),
});

export type Map = {
  id: string;
  name: string;
  tileSize: number;
  top: types.shared.File | null;
  bottom: types.shared.File;
  lighting: types.shared.File | null;
  placements: types.Placement[];
  collisions: types.Collision[];
  webviews: types.Webview[];
  lives: types.Live[];
  callRooms: types.CallRoom[];
  dialogues: Dialogue[];
  config: types.MapConfig;
  tiles: types.Tile[][];
  wh: [number, number];
  status: types.MapStatus;
  createdAt: Date;
  updatedAt: Date;
};

export const mapFragment = gql`
  ${types.shared.fileFragment}
  ${types.tileFragment}
  ${types.placementFragment}
  ${types.collisionFragment}
  ${types.webviewFragment}
  ${types.callRoomFragment}
  ${types.liveFragment}
  ${types.mapConfigFragment}
  ${dialogueFragment}
  fragment mapFragment on Map {
    id
    name
    tileSize
    config {
      dayNight
    }
    bottom {
      ...fileFragment
    }
    top {
      ...fileFragment
    }
    lighting {
      ...fileFragment
    }
    tiles {
      ...tileFragment
    }
    placements {
      ...placementFragment
    }
    collisions {
      ...collisionFragment
    }
    webviews {
      ...webviewFragment
    }
    callRooms {
      ...callRoomFragment
    }
    lives {
      ...liveFragment
    }
    dialogues {
      ...dialogueFragment
    }
    config {
      ...mapConfigFragment
    }
    wh
    status
    createdAt
    updatedAt
  }
`;
export const mainTools = ["assets", "interaction", "dialog"] as const;
export type MainTool = typeof mainTools[number];
export const editModes = ["select", "add", "modify", "option"] as const;
export type EditMode = typeof editModes[number];
