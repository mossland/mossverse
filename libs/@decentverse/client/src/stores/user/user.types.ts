import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
import { emojiFragment } from "../emoji/emoji.types";

export type UserInput = types.shared.BaseUserInput & {
  hotkeys: types.HotkeyInput[];
  currentPosition: number[];
  currentMap: string | null;
};

export type User = types.shared.BaseUser & {
  hotkeys: types.Hotkey[];
  currentPosition: number[];
  currentMap: string | null;
};

export const defaultUser: User = {
  ...types.shared.defaultBaseUser,
  hotkeys: [],
  currentPosition: [0, 0],
  currentMap: null,
};

export const purifyUser = (user: User): UserInput => ({
  ...types.shared.purifyBaseUser(user),
  hotkeys: user.hotkeys.map((hotkey) => purifyHotKey(hotkey)),
  nickname: user.nickname,
  currentMap: user.currentMap,
  currentPosition: user.currentPosition,
});

export type HotkeyInput = {
  key: string;
  emoji: types.ID;
};
export type Hotkey = {
  id: types.ID;
  key: string;
  emoji: types.Emoji;
};
export const purifyHotKey = (hotkey: Hotkey): HotkeyInput => ({
  key: hotkey.key,
  emoji: hotkey.emoji.id,
});

export type MyItem = {
  token?: types.shared.Token;
  thing?: types.shared.Thing;
  type: "token" | "thing";
  num: number;
};

export const hotkeyFragment = gql`
  ${emojiFragment}
  fragment hotkeyFragment on Hotkey {
    id
    key
    emoji {
      ...emojiFragment
    }
  }
`;

export const userFragment = gql`
  ${types.shared.baseUserFragment}
  ${hotkeyFragment}
  fragment userFragment on User {
    ...baseUserFragment
    hotkeys {
      ...hotkeyFragment
    }
    currentPosition
    currentMap
  }
`;
