import { query, mutate } from "../gql";
import * as types from "../types";
import gql from "graphql-tag";

// * emoji Query
export type EmojiQuery = { emoji: types.Emoji };
export const emojiQuery = gql`
  ${types.emojiFragment}
  query emoji($emojiId: ID!) {
    emoji(emojiId: $emojiId) {
      ...emojiFragment
    }
  }
`;
export const emoji = async (emojiId: string) => (await query<EmojiQuery>(emojiQuery, { emojiId })).emoji;

// * emojis Query
export type EmojisQuery = { emojis: types.Emoji[] };
export const emojisQuery = gql`
  ${types.emojiFragment}
  query emojis($query: JSON!, $skip: Int, $limit: Int) {
    emojis(query: $query, skip: $skip, limit: $limit) {
      ...emojiFragment
    }
  }
`;
export const emojis = async (qry: any, skip = 0, limit = 0) =>
  (await query<EmojisQuery>(emojisQuery, { query: qry, skip, limit })).emojis;

// * Create Emoji Mutation
export type CreateEmojiMutation = { createEmoji: types.Emoji };
export const createEmojiMutation = gql`
  ${types.emojiFragment}
  mutation createEmoji($data: EmojiInput!) {
    createEmoji(data: $data) {
      ...emojiFragment
    }
  }
`;
export const createEmoji = async (data: types.EmojiInput) =>
  (await mutate<CreateEmojiMutation>(createEmojiMutation, { data })).createEmoji;

// * Update Emoji Mutation
export type UpdateEmojiMutation = { updateEmoji: types.Emoji };
export const updateEmojiMutation = gql`
  ${types.emojiFragment}
  mutation updateEmoji($data: EmojiInput!, $emojiId: ID!) {
    updateEmoji(data: $data, emojiId: $emojiId) {
      ...emojiFragment
    }
  }
`;
export const updateEmoji = async (emojiId: string, data: types.EmojiInput) =>
  (await mutate<UpdateEmojiMutation>(updateEmojiMutation, { data, emojiId })).updateEmoji;

// * Remove Emoji Mutation
export type RemoveEmojiMutation = { removeEmoji: types.Emoji };
export const removeEmojiMutation = gql`
  ${types.emojiFragment}
  mutation removeEmoji($emojiId: ID!) {
    removeEmoji(emojiId: $emojiId) {
      ...emojiFragment
    }
  }
`;
export const removeEmoji = async (emojiId: string) =>
  (await mutate<RemoveEmojiMutation>(removeEmojiMutation, { emojiId })).removeEmoji;

// * Add EmojiFiles Mutation
export type AddEmojiFilesMutation = { addEmojiFiles: types.shared.File[] };
export const addEmojiFilesMutation = gql`
  ${types.shared.fileFragment}
  mutation addEmojiFiles($files: [Upload!]!, $emojiId: String) {
    addEmojiFiles(files: $files, emojiId: $emojiId) {
      ...fileFragment
    }
  }
`;
export const addEmojiFiles = async (files: FileList, emojiId?: string | null) =>
  (await mutate<AddEmojiFilesMutation>(addEmojiFilesMutation, { files, emojiId })).addEmojiFiles;
