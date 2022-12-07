import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, Get, makeStore, SetGet } from "@shared/util-client";
import { emojiGraphQL, Emoji, EmojiInput } from "./emoji.gql";

const state = {
  ...createState(emojiGraphQL),
  isEmojiModalOpen: false,
  emojiTimeout: null as NodeJS.Timeout | null,
  isShowEmojiSelecter: false,
  isEmojiEdit: false,
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(emojiGraphQL, { get, set }),
  runEmoji: (emoji: gql.Emoji) => {
    const { emojiTimeout } = get();
    if (emojiTimeout) clearInterval(emojiTimeout);
    const timeout = setTimeout(() => set({ emoji: null }), 3000);
    set({ emojiTimeout: timeout, emoji, isShowEmojiSelecter: false });
  },
  addEmojiFiles: async (fileList) => {
    const { emojiForm, setFileOnEmoji } = get() as Get<typeof state, typeof actions>;
    const [file] = await gql.addEmojiFiles(fileList, emojiForm.id);
    setFileOnEmoji(file);
  },
});
export const emoji = makeStore(emojiGraphQL.refName, state, actions);
