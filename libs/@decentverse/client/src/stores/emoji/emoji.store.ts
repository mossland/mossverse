import { createSelectors, Nullable } from "@shared/util-client";
import { Utils } from "discord.js";
import create from "zustand";
import * as gql from "../gql";
import * as types from "../types";

type State = Nullable<types.Emoji> & {
  modalOpen: boolean;
  emoji: types.Emoji | null;
  emojis: types.Emoji[];
  items: types.Item[];
  isEmojiModalOpen: boolean;
  emojiTimeout: NodeJS.Timeout | null;
  isShowEmojiSelecter: boolean;
  isEmojiEdit: boolean;
  operation: "sleep" | "idle" | "loading";
};

const initialState: State = {
  ...types.defaultEmoji,
  modalOpen: false,
  emoji: null,
  emojis: [],
  items: [],
  isEmojiModalOpen: false,
  emojiTimeout: null,
  isShowEmojiSelecter: false,
  isEmojiEdit: false,
  operation: "sleep",
};
type Action = {
  init: () => Promise<void>; // 초기화
  purify: () => types.EmojiInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (emoji?: types.Emoji) => void; // 수정필드 리셋
  runEmoji: (emoji: types.Emoji) => void;
  addEmojiFiles: (fileList: FileList, emojiId?: types.ID | null) => Promise<void>;
};

export const useEmoji = create<State & Action>((set, get) => ({
  ...initialState,
  init: async () => {
    const emojis = await gql.emojis({});
    set({ emojis, operation: "idle" });
  },
  purify: () => {
    const state = get();
    try {
      const user = types.purifyEmoji(state as types.Emoji);
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  create: async () => {
    const { purify, reset, emojis } = get();
    const emojiInput = purify();
    if (!emojiInput) return;
    const emoji = await gql.createEmoji(emojiInput);
    set({ emojis: [emoji, ...emojis] });
    reset(emoji);
  },
  update: async () => {
    const { purify, emojis, id, reset } = get();
    const input = purify();
    if (!input || !id) return;
    const emoji = input && (await gql.updateEmoji(id, input));
    set({ emojis: [emoji, ...emojis.filter((a) => a.id !== emoji.id)] });
    reset(emoji);
  },
  remove: async (id: string) => {
    const { emojis } = get();
    await gql.removeEmoji(id);
    set({ emojis: [...emojis.filter((a) => a.id !== id)] });
  },
  reset: (emoji?: types.Emoji) => set({ ...types.defaultEmoji, emoji, modalOpen: false }),
  runEmoji: (emoji: types.Emoji) => {
    const { emojiTimeout } = get();
    if (emojiTimeout) clearInterval(emojiTimeout);
    const timeout = setTimeout(() => set({ emoji: null }), 3000);
    set({ emojiTimeout: timeout, emoji, isShowEmojiSelecter: false });
  },
  addEmojiFiles: async (fileList, emojiId) => {
    const [file] = await gql.addEmojiFiles(fileList, emojiId);
    set({ file });
  },
}));

export const emojiStore = createSelectors(useEmoji);
