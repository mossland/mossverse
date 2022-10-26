import create from "zustand";
import * as types from "./gossip.types";
import { Socket as Soc } from "socket.io-client";
import { createSelectors } from "@shared/util-client";

type State = {
  chats: types.Chat[];
  chatText: string;
  chatInput: string;
  operation: "sleep" | "idle" | "loading";

  // status: "none" | "sleep" | "loading" | "failed" | "idle";
};

const initialState: State = {
  chats: [],
  chatText: "",
  chatInput: "",
  operation: "sleep",
};

type Action = {
  sendChat: (roomId: string, text: string) => void;
  receiveChat: (roomId: string, chat: types.Chat) => void;
};

export const useGossip = create<State & Action>((set, get) => ({
  ...initialState,
  sendChat: (roomId: string, text: string) =>
    set((state) => ({
      chats: [
        ...state.chats,
        {
          from: "1242",
          fromName: "aaa",
          text,
          at: new Date(),
        },
      ],
      chatText: "",
    })),
  receiveChat: (roomId: string, chat: types.Chat) =>
    set((state) => ({ chats: [...state.chats, { ...chat, at: new Date(chat.at) }] })),
}));

export const gossipStore = createSelectors(useGossip);
