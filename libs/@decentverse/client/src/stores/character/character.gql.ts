import { query, mutate } from "../gql";
import gql from "graphql-tag";
import * as types from "../types";

// * Character Query
export type CharacterQuery = { character: types.Character };
export const characterQuery = gql`
  ${types.characterFragment}
  query character($characterId: ID!) {
    character(characterId: $characterId) {
      ...characterFragment
    }
  }
`;
export const character = async (characterId: string) =>
  (await query<CharacterQuery>(characterQuery, { characterId })).character;

// * Characters Query
export type CharactersQuery = { characters: types.Character[] };
export const charactersQuery = gql`
  ${types.characterFragment}
  query characters($query: JSON!, $skip: Int, $limit: Int) {
    characters(query: $query, skip: $skip, limit: $limit) {
      ...characterFragment
    }
  }
`;
export const characters = async (qry: any, skip = 0, limit = 0) =>
  (await query<CharactersQuery>(charactersQuery, { query: qry, skip, limit })).characters;

// * Create Character Mutation
export type CreateCharacterMutation = { createCharacter: types.Character };
export const createCharacterMutation = gql`
  ${types.characterFragment}
  mutation createCharacter($data: CharacterInput!) {
    createCharacter(data: $data) {
      ...characterFragment
    }
  }
`;
export const createCharacter = async (data: types.CharacterInput) =>
  (await mutate<CreateCharacterMutation>(createCharacterMutation, { data })).createCharacter;

// * Update Character Mutation
export type UpdateCharacterMutation = { updateCharacter: types.Character };
export const updateCharacterMutation = gql`
  ${types.characterFragment}
  mutation updateCharacter($characterId: ID!, $data: CharacterInput!) {
    updateCharacter(characterId: $characterId, data: $data) {
      ...characterFragment
    }
  }
`;
export const updateCharacter = async (characterId: string, data: types.CharacterInput) =>
  (await mutate<UpdateCharacterMutation>(updateCharacterMutation, { characterId, data })).updateCharacter;

// * Remove Admin Mutation
export type RemoveCharacterMutation = { removeCharacter: types.Character };
export const removeCharacterMutation = gql`
  ${types.characterFragment}
  mutation removeCharacter($characterId: ID!) {
    removeCharacter(characterId: $characterId) {
      ...characterFragment
    }
  }
`;
export const removeCharacter = async (characterId: string) =>
  (await mutate<RemoveCharacterMutation>(removeCharacterMutation, { characterId })).removeCharacter;

// * Add CharacterFiles Mutation
export type AddCharacterFilesMutation = { addCharacterFiles: types.shared.File[] };
export const addCharacterFilesMutation = gql`
  ${types.shared.fileFragment}
  mutation addCharacterFiles($files: [Upload!]!, $characterId: String) {
    addCharacterFiles(files: $files, characterId: $characterId) {
      ...fileFragment
    }
  }
`;
export const addCharacterFiles = async (files: FileList, characterId?: string | null) =>
  (await mutate<AddCharacterFilesMutation>(addCharacterFilesMutation, { files, characterId })).addCharacterFiles;
