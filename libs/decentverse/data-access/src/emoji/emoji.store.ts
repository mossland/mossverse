import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { emojiGraphQL, Emoji, EmojiInput } from "./emoji.gql";

type State = DefaultState<"emoji", gql.Emoji> & {
  isEmojiModalOpen: boolean;
  emojiTimeout: NodeJS.Timeout | null;
  isShowEmojiSelecter: boolean;
  isEmojiEdit: boolean;
};
const initialState: State = {
  ...createState<"emoji", gql.Emoji, gql.EmojiInput>(emojiGraphQL),
  isEmojiModalOpen: false,
  emojiTimeout: null,
  isShowEmojiSelecter: false,
  isEmojiEdit: false,
};
type Actions = DefaultActions<"emoji", gql.Emoji, gql.EmojiInput> & {
  runEmoji: (emoji: gql.Emoji) => void;
  addEmojiFiles: (fileList: FileList) => Promise<void>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"emoji", gql.Emoji, gql.EmojiInput>(emojiGraphQL, { get, set }),
  runEmoji: (emoji: gql.Emoji) => {
    const { emojiTimeout } = get();
    if (emojiTimeout) clearInterval(emojiTimeout);
    const timeout = setTimeout(() => set({ emoji: null }), 3000);
    set({ emojiTimeout: timeout, emoji, isShowEmojiSelecter: false });
  },
  addEmojiFiles: async (fileList) => {
    const [file] = await gql.addEmojiFiles(fileList, get().id);
    set({ file });
  },
}));
export const emoji = generateStore(store);
