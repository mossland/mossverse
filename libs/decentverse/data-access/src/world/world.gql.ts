import * as gql from "../gql";

//! 전체 리팩토링 필요, useRef 전용 데이터관리 아키텍처 도입필요
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
  chatText: string | null;
  isTalk: boolean | null;
  emoji: string | null;
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
};

export type Player = {
  id: string;
  nickname: string;
  address?: string;
  character: gql.Character;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  type: "guest" | "user" | "admin";
  wallets: gql.shared.Wallet[];
};
export type WorldRender = {
  tiles: gql.Tile[][];
  players: { [key: string]: Player };
};

export type OtherPlayerInfomation = {
  clientPosition: number[];
  player: OtherPlayer;
};
export type OtherPlayer = {
  id: string;
  user: gql.User;
  character: gql.Character;
  updatedAt: number;
};

export type LoadManager = {
  loaded: number;
  totalLoad: number;
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
  klaytn?: TContract;
  ethereum?: TContract;
  luniverse?: TContract;
  network: "mainnet" | "testnet";
};

export const defaultCharacter: gql.Character = {
  id: "",
  token: null,
  thing: null,
  name: "default nickname",
  status: "active",
  file: {
    id: "",
    url: "https://asset.ayias.io/decentverse/character/00/dcnt-1660132657788-char2.png",
    imageSize: [0, 0],
    createdAt: new Date(),
    updatedAt: new Date(),
    // url: "https://asset.ayias.io/decentverse/character/chinchin.png",
  },
  tileSize: [240, 330],
  totalSize: [388, 581],
  size: [120, 165],
  right: {
    idle: {
      row: 4,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 5,
      column: 4,
      duration: 500,
    },
  },
  left: {
    idle: {
      row: 6,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 7,
      column: 4,
      duration: 500,
    },
  },
  up: {
    idle: {
      row: 2,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 3,
      column: 4,
      duration: 500,
    },
  },
  down: {
    idle: {
      row: 0,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 1,
      column: 4,
      duration: 500,
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
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
  character: defaultCharacter,
  updatedAt: new Date().getTime(),
};

export const defaultConfiguration: Configuration = {
  network: "testnet",
};
