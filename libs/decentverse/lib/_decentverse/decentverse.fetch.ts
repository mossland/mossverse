import { Field, Float, InputType, Int, ObjectType, createFragment, makeDefault } from "@util/client";
import type { LightCharacter } from "../fetch";

@InputType("SpriteDefInput")
export class SpriteDefInput {
  @Field(() => Int)
  row: number;

  @Field(() => Int)
  column: number;

  @Field(() => Int)
  duration: number;
}
@ObjectType("SpriteDef")
export class SpriteDef extends SpriteDefInput {}
export const spriteDefFragment = createFragment(SpriteDef);

@InputType("SpriteInput")
export class SpriteInput {
  @Field(() => SpriteDef)
  idle: SpriteDef;

  @Field(() => SpriteDef)
  walk: SpriteDef;
}
@ObjectType("Sprite")
export class Sprite extends SpriteInput {}
export const spriteFragment = createFragment(Sprite);

export const interactionTypes = ["collision", "webview", "callRoom", "videoRoom"] as const;
export type InteractionType = (typeof interactionTypes)[number];

export const interactions = ["placement", "collision", "webview", "callRoom", "live", "teleport"] as const;
export type Interaction = (typeof interactions)[number];

@InputType("MapConfigInput")
export class MapConfigInput {
  @Field(() => Boolean)
  dayNight: boolean;
}

@ObjectType("MapConfig")
export class MapConfig extends MapConfigInput {}
export const mapConfigFragment = createFragment(MapConfig);

@InputType("MapPositionInput")
export class MapPositionInput {
  @Field(() => String)
  key: string;

  @Field(() => [Float], { default: [0, 0] })
  position: [number, number];
}
@ObjectType("MapPosition")
export class MapPosition extends MapPositionInput {}
export const mapPositionFragment = createFragment(MapPosition);
export const defaultMapPosition = makeDefault(MapPosition);

export const keyMap = {
  KeyW: "up",
  KeyA: "left",
  KeyS: "down",
  KeyD: "right",
  KeyF: "webview",
  Space: "webview",
  ArrowUp: "up",
  ArrowLeft: "left",
  ArrowDown: "down",
  ArrowRight: "right",
  // Digit1: "emoji1",
  // Digit2: "emoji2",
  // Digit3: "emoji3",
  // Digit4: "emoji4",
} as const;
export type Key = keyof typeof keyMap;

export const keyTypes = ["left", "right", "up", "down", "webview"] as const;
export type KeyType = (typeof keyTypes)[number];
export type Keyboard = { [key in KeyType]: boolean };
export const defaultKeyboard: Keyboard = {
  left: false,
  right: false,
  up: false,
  down: false,
  webview: false,
};

export type MapLayerView = {
  collision: boolean;
  webview: boolean;
  callRoom: boolean;
  teleport: boolean;
  live: {
    iframe: boolean;
  };
  placement: {
    top: boolean;
    wall: boolean;
    bottom: boolean;
    lighting: boolean;
  };
  tile: {
    top: boolean;
    wall: boolean;
    bottom: boolean;
    lighting: boolean;
  };
  dialogue: boolean;
};
export const mapEditorLayerView: MapLayerView = {
  collision: true,
  webview: true,
  callRoom: true,
  teleport: true,
  live: {
    iframe: true,
  },
  placement: {
    top: true,
    wall: true,
    bottom: true,
    lighting: true,
  },
  tile: {
    top: true,
    wall: true,
    bottom: true,
    lighting: true,
  },
  dialogue: true,
};
export const mapPlayerLayerView: MapLayerView = {
  collision: false,
  webview: false,
  callRoom: false,
  teleport: false,
  live: {
    iframe: true,
  },
  placement: {
    top: true,
    wall: true,
    bottom: true,
    lighting: true,
  },
  tile: {
    top: true,
    wall: true,
    bottom: true,
    lighting: true,
  },
  dialogue: false,
};

export type PlayerInit = {
  playerNickname: string;
  playerType: null | "user" | "guest";
  playerCharacter: LightCharacter;
  playerMaxSpeed: number;
  playerAcceleration: number;
  playerDeceleration: number;
};
export type PlayerRender = {
  playerVelocity: [number, number];
  playerPosition: [number, number];
  playerSpriteState: "idle" | "walk";
  playerDirection: "left" | "right" | "up" | "down";
  playerChatText: string;
  playerEmojiUrl: null | string;
  playerStatus: null | "talk";
};
