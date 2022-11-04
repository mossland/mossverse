import create from "zustand";
import { Socket as Soc } from "socket.io-client";
import { generateStore } from "@shared/util-client";
import * as gql from "../gql";

type State = {
  chats: gql.Chat[];
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
  receiveChat: (roomId: string, chat: gql.Chat) => void;
};

const store = create<State & Action>((set, get) => ({
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
  receiveChat: (roomId: string, chat: gql.Chat) =>
    set((state) => ({ chats: [...state.chats, { ...chat, at: new Date(chat.at) }] })),
}));

export const gossip = generateStore(store);
