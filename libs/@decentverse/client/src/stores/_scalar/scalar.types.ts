import gql from "graphql-tag";
import { types as shared } from "@shared/data-access";
import { dialogFragment, Stores, types } from "../index";
import { Socket as Soc } from "socket.io-client";
import { cnst } from "@shared/util";
import { Socket } from "socket.io";
import { Vector3 } from "three";
import { Nullable } from "@shared/util-client";
export const adminMenus = ["mapEditor", "clientAdmin", "options", "contract", "emoji", "item", "asset"] as const;
export type AdminMenu = typeof adminMenus[number];
export type SpriteDefInput = {
  row: number;
  column: number;
  duration: number;
};
export type SpriteDef = {
  row: number;
  column: number;
  duration: number;
};
export const purifySpriteDef = (spriteDef: SpriteDef): SpriteDefInput => ({
  row: spriteDef.row,
  column: spriteDef.column,
  duration: spriteDef.duration,
});
export type SpriteInput = {
  idle: SpriteDefInput;
  walk: SpriteDefInput;
};
export type Sprite = {
  idle: SpriteDef;
  walk: SpriteDef;
};
export const purifySprite = (sprite: Sprite): SpriteInput => ({
  idle: purifySpriteDef(sprite.idle),
  walk: purifySpriteDef(sprite.walk),
});
export const spriteFragment = gql`
  fragment spriteFragment on Sprite {
    idle {
      row
      column
      duration
    }
    walk {
      row
      column
      duration
    }
  }
`;

export const interactionTypes = ["collision", "webview", "callRoom", "videoRoom"] as const;
export type InteractionType = typeof interactionTypes[number];

export type Collision = {
  id: types.ID;
  message: string | null;
  center: [number, number];
  wh: [number, number];
};
export type CollisionInput = {
  message: string | null;
  center: [number, number];
  wh: [number, number];
};
export const defaultCollision: Nullable<Collision> = {
  id: null,
  message: null,
  center: null,
  wh: null,
};
export const purifyCollision = (collision: Collision): CollisionInput => ({
  message: collision.message,
  center: collision.center,
  wh: collision.wh,
});
export const collisionFragment = gql`
  fragment collisionFragment on Collision {
    id
    message
    center
    wh
  }
`;

export const webviewPurposes = ["default", "youtube", "image", "twitter"] as const;
export type WebviewPurpose = typeof webviewPurposes[number];
export type Webview = {
  id: types.ID;
  message: string | null;
  errorMessage: string | null;
  center: [number, number];
  wh: [number, number];
  url: string;
  size: number[];
  purpose: WebviewPurpose;
  isEmbed: boolean;
};
export type WebviewInput = {
  message: string | null;
  errorMessage: string | null;
  center: [number, number];
  wh: [number, number];
  url: string;
  size: number[];
  purpose: WebviewPurpose;
  isEmbed: boolean;
};
export const defaultWebview: Nullable<Webview> = {
  id: null,
  message: null,
  errorMessage: null,
  center: null,
  wh: null,
  url: "https://",
  size: [500, 500],
  purpose: "default",
  isEmbed: true,
};
export const purifyWebview = (webview: Webview): WebviewInput => ({
  message: webview.message,
  errorMessage: webview.errorMessage,
  center: webview.center,
  wh: webview.wh,
  url: webview.url,
  size: webview.size,
  purpose: webview.purpose,
  isEmbed: webview.isEmbed,
});
export const webviewFragment = gql`
  fragment webviewFragment on Webview {
    id
    message
    errorMessage
    center
    wh
    url
    size
    purpose
    isEmbed
  }
`;

export type CallRoom = {
  id: types.ID;
  message: string | null;
  errorMessage: string | null;
  center: [number, number];
  wh: [number, number];
  maxNum: number;
  roomType: cnst.RoomType | null;
};
export type CallRoomInput = {
  message: string | null;
  errorMessage: string | null;
  center: [number, number];
  wh: [number, number];
  maxNum: number;
  roomType: cnst.RoomType | null;
};
export const defaultCallRoom: Nullable<CallRoom> = {
  id: null,
  message: "message",
  errorMessage: "error",
  center: null,
  wh: null,
  maxNum: 8,
  roomType: "call",
};
export const purifyCallRoom = (callRoom: CallRoom): CallRoomInput => ({
  message: callRoom.message,
  errorMessage: callRoom.errorMessage,
  center: callRoom.center,
  wh: callRoom.wh,
  maxNum: callRoom.maxNum,
  roomType: callRoom.roomType,
});
export const callRoomFragment = gql`
  fragment callRoomFragment on CallRoom {
    id
    message
    errorMessage
    center
    wh
    maxNum
    roomType
  }
`;

export type Live = {
  id: types.ID;
  message: string | null;
  errorMessage: string | null;
  center: [number, number];
  wh: [number, number];
  src: string;
};

export type LiveInput = {
  message: string | null;
  errorMessage: string | null;
  center: [number, number];
  wh: [number, number];
  src: string;
};
export const defaultLive: Nullable<Live> = {
  id: "",
  message: "message",
  errorMessage: "error",
  center: null,
  wh: null,
  src: null,
};
export const purifyLive = (live: Live): LiveInput => ({
  message: live.message,
  errorMessage: live.errorMessage,
  center: live.center,
  wh: live.wh,
  src: live.src,
});

export const liveFragment = gql`
  fragment liveFragment on Live {
    id
    message
    errorMessage
    center
    wh
    src
  }
`;

export const interactions = ["collision", "webview", "callRoom", "live", "dialogue"] as const;
export type Interaction = typeof interactions[number];

export type Tile = {
  id: types.ID;
  top: shared.File | null;
  bottom: shared.File;
  lighting: shared.File | null;
};

export type TileInput = {
  top: types.ID | null;
  bottom?: types.ID;
  lighting: types.ID | null;
};
export const purifyTile = (tile: Tile): TileInput => ({
  top: tile.top?.id ?? null,
  bottom: tile.bottom.id,
  lighting: tile.lighting?.id ?? null,
});

export const tileFragment = gql`
  ${shared.fileFragment}
  fragment tileFragment on Tile {
    id
    top {
      ...fileFragment
    }
    bottom {
      ...fileFragment
    }
    lighting {
      ...fileFragment
    }
  }
`;

export type MapConfig = {
  dayNight: boolean;
};

export type MapConfigInput = {
  dayNight: boolean;
};
export const purifyMapConfig = (config: MapConfig): MapConfigInput => ({
  dayNight: config.dayNight,
});

export const mapConfigFragment = gql`
  fragment mapConfigFragment on MapConfig {
    dayNight
  }
`;

export const keyMap = {
  KeyW: "up",
  KeyA: "left",
  KeyS: "down",
  KeyD: "right",
  KeyF: "interaction",
  Space: "interaction",
  ArrowUp: "up",
  ArrowLeft: "left",
  ArrowDown: "down",
  ArrowRight: "right",
  Digit1: "emoji1",
  Digit2: "emoji2",
  Digit3: "emoji3",
  Digit4: "emoji4",
} as const;
export type Key = keyof typeof keyMap;

export const keyTypes = ["left", "right", "up", "down", "interaction", "emoji1", "emoji2", "emoji3", "emoji4"] as const;
export type KeyType = typeof keyTypes[number];
export const keyboard = {
  left: false,
  right: false,
  up: false,
  down: false,
  interaction: false,
  emoji1: false,
  emoji2: false,
  emoji3: false,
  emoji4: false,
};
export type Keyboard = { [key in KeyType]: boolean };
export const mouse = new Vector3(0, 0, 0);
export type Mouse = Vector3;

// export const flowStyles = ["speak"] as const;
export const flowStyles = ["speak", "question"] as const;
export type FlowStyle = typeof flowStyles[number];

export const avatarPositions = ["left", "right", "center"] as const;
export type AvatarPosition = typeof avatarPositions[number];

export type Flow = {
  style: FlowStyle;
  subject: string;
  character: types.ID | null;
  image: shared.File | null;
  background: shared.File | null;
  avatarPosition: AvatarPosition;
  name: string | null;
  texts: string[];
  position: number[];
  next: string[] | null;
};

export type FlowInput = {
  style: FlowStyle;
  subject: string;
  character: types.ID | null;
  image: types.ID | null;
  background: types.ID | null;
  avatarPosition: AvatarPosition;
  name: string | null;
  texts: string[];
  position: number[];
  next: string[] | null;
};
export const defaultFlow: Nullable<Flow> = {
  style: null,
  subject: null,
  character: null,
  image: null,
  background: null,
  avatarPosition: "right",
  name: null,
  texts: [],
  position: [0, 0],
  next: null,
};

export const purifyFlow = (flow: Flow): FlowInput => ({
  style: flow.style,
  subject: flow.subject,
  character: flow.character,
  image: flow.image?.id ?? null,
  background: flow.background?.id ?? null,
  avatarPosition: flow.avatarPosition,
  name: flow.name,
  texts: flow.texts,
  position: flow.position,
  next: flow.next,
});

export const flowFragment = gql`
  ${shared.fileFragment}
  fragment flowFragment on Flow {
    style
    subject
    character
    image {
      ...fileFragment
    }
    background {
      ...fileFragment
    }
    avatarPosition
    name
    texts
    position
    next
  }
`;

export type Area = {
  id: types.ID;
  map: types.ID;
  center: [number, number];
  wh: [number, number];
};
export type AreaInput = {
  map: types.ID;
  center: [number, number];
  wh: [number, number];
};
export const purifyArea = (area: Area): AreaInput => ({
  map: area.map,
  center: area.center,
  wh: area.wh,
});
export const areaFragment = gql`
  fragment areaFragment on Area {
    id
    map
    center
    wh
  }
`;
export type EventCallback = (store: Stores, socket: Socket, itemId: string, option?: object) => Promise<void>;
export type EventCallbackParameters = {
  type: string;
  userIds: string[];
};

export type ItemCallback = {
  label: string;
  // callback: (store: types.Stores, data: any) => Promise<void>;
  adminRight?: boolean;
};

// export type EmojiInput = {
//   token: types.ID;
//   file: types.ID;
// };

// export type Emoji = {
//   id: types.ID;
//   token: types.shared.Token;
//   file: types.File;
//   status: cnst.DefaultStatus;
// };

export const mapViews = [
  "collision",
  "webview",
  "callRoom",
  "live",
  "live.iframe",
  "asset.top",
  "asset.bottom",
  "asset.lighting",
  "dialogue",
] as const;
export type MapView = typeof mapViews[number];
export const defaultEditorMapView: MapView[] = [
  "collision",
  "webview",
  "callRoom",
  "live",
  "asset.top",
  "asset.bottom",
  "asset.lighting",
  "dialogue",
];
export const defaultGameMapView: MapView[] = ["live.iframe", "asset.top", "asset.bottom", "asset.lighting"];
export const interactionViews: MapView[] = ["collision", "webview", "callRoom", "live", "dialogue"];
export const assetViews: MapView[] = ["asset.top", "asset.bottom", "asset.lighting"];
