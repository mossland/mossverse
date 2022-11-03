import { Nullable } from "@shared/util-client";
import gql from "graphql-tag";
import * as types from "./../types";

export type EmojiInputKey = "keyNum" | "flie" | "item";

export type EmojiInput = {
  name: string;
  token: types.ID | null;
  file: types.ID;
};
export type Emoji = {
  id: types.ID;
  name: string;
  token: types.shared.Token | null;
  file: types.shared.File;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export const purifyEmoji = (emoji: Emoji): EmojiInput => ({
  name: emoji.name,
  token: emoji.token?.id ?? null,
  file: emoji.file.id,
});

export const defaultEmoji: Nullable<Emoji> = {
  id: null,
  name: null,
  token: null,
  file: null,
  status: null,
  createdAt: null,
  updatedAt: null,
};

export const emojiFragment = gql`
  ${types.shared.fileFragment}
  ${types.shared.tokenFragment}
  fragment emojiFragment on Emoji {
    id
    name
    token {
      ...tokenFragment
    }
    file {
      ...fileFragment
    }
    status
    createdAt
    updatedAt
  }
`;
