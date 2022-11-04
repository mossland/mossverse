import { Character } from "../character/character.types";
import * as types from "../types";
import { cnst } from "@shared/util";
export type WorldScope = {
  min: number[];
  max: number[];
};

export type Screen = {
  size: number[];
  offset: number[];
};

export const playerStates = ["idle", "walk"] as const;
export type PlayerState = typeof playerStates[number];

export const directions = ["left", "right", "up", "down"] as const;
export type Direction = typeof directions[number];
export type RenderCharacter = {
  id: string;
  position: [number, number];
  velocity: number[];
  state: PlayerState;
  direction: Direction;
  chatText?: string;
  isTalk?: boolean;
  emoji?: string;
  effect?: types.EffectType;
};
export type RenderOtherPlayer = {
  id: string;
  nickname: string;
  position: number[];
  velocity: number[];
  state: PlayerState;
  direction: Direction;
  chatText: string;
  isTalk: boolean;
  emoji: string;
  effect: types.EffectType;
};
export type Player = {
  id: string;
  nickname: string;
  address?: string;
  character: Character;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  type: "guest" | "user" | "admin";
  wallets: types.shared.Wallet[];
};
export type WorldRender = {
  tiles: types.Tile[][];
  players: { [key: string]: Player };
};

export type OtherPlayer = {
  id: string;
  user: types.User;
  character: Character;
  updatedAt: number;
};

export type LoadManager = {
  loaded: number;
  totalLoad: number;
};
export type InteractionState = {
  collision: types.Collision | null;
  webview: types.Webview | null;
  callRoom: types.CallRoom | null;
  dialogue: types.Dialogue | null;
};

export type TContract = {
  address?: string;
  chainId: string;
};

export type Login = {
  logoImage?: string;
  backgroundImage?: string;
};

export type Configuration = {
  login?: Login;
  network: cnst.NetworkType;
};

export const defaultRenderCharacter = {
  id: "",
  position: [0, 0],
  velocity: [0, 0],
  state: "idle" as PlayerState,
  direction: "right" as Direction,
};
export const defaultOtherPlayer = {
  id: "default",
  character: types.defaultCharacter,
  updatedAt: new Date().getTime(),
};
export const defaultInteractionState: InteractionState = {
  collision: null,
  webview: null,
  callRoom: null,
  dialogue: null,
};
export const defaultConfiguration: Configuration = {
  network: "testnet",
};
