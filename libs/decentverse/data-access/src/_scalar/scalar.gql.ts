import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import { Socket } from "socket.io";
import { Vector3 } from "three";
import { BaseArrayFieldGql, createFragment, Field, Float, InputType, Int, ObjectType } from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Character } from "../character/character.gql";

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
export type InteractionType = typeof interactionTypes[number];

@InputType("CollisionInput")
export class CollisionInput {
  @Field(() => String, { nullable: true })
  message: string | null;

  @Field(() => [Float])
  center: [number, number];

  @Field(() => [Float])
  wh: [number, number];
}

@ObjectType("Collision")
export class Collision extends BaseArrayFieldGql(CollisionInput) {}
export const collisionFragment = createFragment(Collision);

export const interactions = ["collision", "webview", "callRoom", "live", "dialogue"] as const;
export type Interaction = typeof interactions[number];

@InputType("MapConfigInput")
export class MapConfigInput {
  @Field(() => Boolean)
  dayNight: boolean;
}

@ObjectType("MapConfig")
export class MapConfig extends MapConfigInput {}
export const mapConfigFragment = createFragment(MapConfig);

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
