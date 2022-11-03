/* eslint-disable @typescript-eslint/no-var-requires */
import create, { SetState, GetState } from "zustand";
import * as gql from "../gql";
import { generateStore } from "@shared/util-client";

type State = {
  scope: gql.WorldScope;
  render: gql.WorldRender;
  me: gql.Player;
  renderMe: gql.RenderCharacter;
  otherPlayer: gql.OtherPlayer | null;
  otherPlayerIds: string[];
  otherPlayers: Map<string, gql.OtherPlayer>;
  configuration: gql.Configuration;
  isPending: boolean;
  isKicked: boolean;
  status: "none" | "loading" | "failed" | "idle";
};

const initialState: State = {
  me: {
    id: "",
    nickname: "",
    type: "guest",
    character: gql.defaultCharacter,
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
    emoji: "",
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
  isPending: false,
  isKicked: false,
  status: "none",
  configuration: gql.defaultConfiguration,
};

type Action = {
  initWorld: (user: gql.User) => Promise<void>;
  selectCharacter: (character: gql.Character) => void;
  addOtherPlayers: (players: gql.OtherPlayer[]) => void;
  setupConfiguration: (configuration: gql.Configuration) => void;
};
const store = create<State & Action>((set, get) => ({
  ...initialState,
  selectCharacter: (character: gql.Character) => set((state) => ({ me: { ...state.me, character } })),
  initWorld: async (user: gql.User) => {
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
        character: state.me.character ?? gql.defaultCharacter,
      },
    }));
  },
  addOtherPlayers: (players: gql.OtherPlayer[]) =>
    set((state) => {
      const otherPlayers = new Map(state.otherPlayers);
      players.map((player) => {
        if (!otherPlayers.get(player.id)) otherPlayers.set(player.id, player);
      });
      return { otherPlayers };
    }),

  setupConfiguration: (configuration: gql.Configuration) => set((state) => ({ configuration })),
}));

export const world = generateStore(store);
