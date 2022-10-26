/* eslint-disable @typescript-eslint/no-var-requires */
import axios from "axios";
import create, { SetState, GetState } from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { createSelectors } from "@shared/util-client";

type State = {
  scope: types.WorldScope;
  render: types.WorldRender;
  me: types.Player;
  renderMe: types.RenderCharacter;
  otherPlayer: types.OtherPlayer | null;
  otherPlayerIds: string[];
  otherPlayers: Map<string, types.OtherPlayer>;
  configuration: types.Configuration;
  status: "none" | "loading" | "failed" | "idle";
};

const initialState: State = {
  me: {
    id: "",
    nickname: "",
    type: "guest",
    character: types.defaultCharacter,
    maxSpeed: 3,
    acceleration: 1,
    deceleration: 1,
    wallets: [],
  },
  renderMe: {
    position: [900, 665],
    velocity: [0, 0],
    state: "idle" as "idle" | "walk",
    direction: "right",
    chatText: "",
    id: "",
    isTalk: false,
  },
  otherPlayer: null,
  otherPlayerIds: [],
  otherPlayers: new Map(),
  scope: {
    min: [0, 0],
    max: [2048, 2048],
  },
  render: {
    tiles: [],
    players: {},
  },
  status: "none",
  configuration: types.defaultConfiguration,
};

export type Action = {
  initWorld: (user: types.User) => Promise<void>;
  selectCharacter: (character: types.Character) => void;
  addOtherPlayers: (players: types.OtherPlayer[]) => void;
  setupConfiguration: (configuration: types.Configuration) => void;
};
export const useWorld = create<State & Action>((set, get) => ({
  ...initialState,
  selectCharacter: (character: types.Character) => set((state) => ({ me: { ...state.me, character } })),
  initWorld: async (user: types.User) => {
    const { renderMe } = get();
    const newRenderMe = {
      position: renderMe.position ?? [0, 0],
      velocity: [0, 0],
      state: "idle",
      direction: "right",
    } as any;
    return set((state) => ({
      renderMe: newRenderMe,
      status: "idle",
      me: {
        ...state.me,
        id: user.id,
        nickname: user.nickname,
        character: state.me.character ?? types.defaultCharacter,
      },
    }));
  },
  addOtherPlayers: (players: types.OtherPlayer[]) =>
    set((state) => {
      const otherPlayers = new Map(state.otherPlayers);
      players.map((player) => {
        if (!otherPlayers.get(player.id)) otherPlayers.set(player.id, player);
      });
      return { otherPlayers };
    }),

  setupConfiguration: (configuration: types.Configuration) => set((state) => ({ configuration })),
}));

export const worldStore = createSelectors(useWorld);
