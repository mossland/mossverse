import create from "zustand";
import * as types from "../types";
import { Socket } from "socket.io-client";
import { createSelectors } from "@shared/util-client";

type State = {
  loopInterval: number;
  keyLock: boolean;
  keyboard: types.Keyboard;
  signalInterval: number;
  ping: number;
  renderTime: number;
  render: {
    cameraPos: number[];
    tiles: number[][];
  };
  tileMap: {
    tileSize: number[];
    lineTileNum: number[];
    maxTileNum: number[];
    renderLimit: number[];
    derenderLimit: number[];
  };
  pointer: [number, number] | null;
  screen: types.Screen;
  status: "none" | "loading" | "failed" | "idle";
};

export const initialKeyboard = {
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

const initialState: State = {
  loopInterval: 500,
  keyLock: false,
  keyboard: { ...initialKeyboard },
  signalInterval: 500, // signal interval between server
  ping: 0, // signal time between server
  renderTime: 0, // calculation time per frame period
  render: {
    cameraPos: [0, 0, 1000],
    tiles: [
      [0, 2],
      [0, 2],
    ],
  },
  tileMap: {
    tileSize: [2000, 2000],
    lineTileNum: [3, 3], // 꼭지점에 있을 때 렌더되는 가로타일 수
    maxTileNum: [8, 5],
    renderLimit: [0.3, 0.3], // 다음 타일을 렌더하는 리미트
    derenderLimit: [0.45, 0.45], // 이전 타일을 없애는 리미트
  },
  pointer: null,
  screen: {
    size: [1000, 1000],
    offset: [1024, 1024],
  },
  status: "none",
};
type Action = {
  setKey: (key: types.KeyType, keyState: boolean) => void;
  lockKey: (isLocked: boolean) => void;
  changeScreenSize: (screen: types.Screen) => void;
  setTiles: (tiles: number[][]) => void;
};
export const useGame = create<State & Action>((set, get) => ({
  ...initialState,
  setKey: (key: types.KeyType, keyState: boolean) =>
    set((state) => {
      const keyboard = state.keyboard;
      keyboard[key] = keyState;
      // console.log(keyboard[key]);
      return { keyboard: { ...keyboard } };
    }),
  lockKey: (isLocked: boolean) => set({ keyLock: isLocked }),
  changeScreenSize: (screen: types.Screen) => set({ screen }),
  setTiles: (tiles: number[][]) => {
    return set((state) => ({ render: { ...state.render, tiles } }));
  },
}));

export const gameStore = createSelectors(useGame);
