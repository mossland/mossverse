import { query, mutate } from "../apollo";
import gql from "graphql-tag";
import * as types from "../types";
import { tokenFragment } from "./token.types";
import { fileFragment } from "../file/file.types";
// * Token Query
export type TokenQuery = { token: types.Token };
export const tokenQuery = gql`
  ${tokenFragment}
  query token($tokenId: ID!) {
    token(tokenId: $tokenId) {
      ...tokenFragment
    }
  }
`;
export const token = async (tokenId: string) => (await query<TokenQuery>(tokenQuery, { tokenId })).token;

// * Tokens Query
export type TokensQuery = { tokens: types.Token[]; tokenCount: number };
export const tokensQuery = gql`
  ${tokenFragment}
  query tokens($query: JSON!, $skip: Int, $limit: Int) {
    tokens(query: $query, skip: $skip, limit: $limit) {
      ...tokenFragment
    }
    tokenCount(query: $query)
  }
`;
export const tokens = async (qry: any, skip = 0, limit = 0) =>
  (await query<TokensQuery>(tokensQuery, { query: qry, skip, limit })).tokens;

// * Create Token Mutation
export type CreateTokenMutation = { createToken: types.Token };
export const createTokenMutation = gql`
  ${types.tokenFragment}
  mutation createToken($data: TokenInput!) {
    createToken(data: $data) {
      ...tokenFragment
    }
  }
`;
export const createToken = async (data: types.TokenInput) =>
  (await mutate<CreateTokenMutation>(createTokenMutation, { data })).createToken;

// * Update Token Mutation

export type UpdateTokenMutation = { updateToken: types.Token };
export const updateTokenMutation = gql`
  ${tokenFragment}
  mutation updateToken($tokenId: ID!, $data: TokenInput!) {
    updateToken(tokenId: $tokenId, data: $data) {
      ...tokenFragment
    }
  }
`;
export const updateToken = async (tokenId: string, data: types.TokenInput) =>
  (await mutate<UpdateTokenMutation>(updateTokenMutation, { tokenId, data })).updateToken;

// * Remove Token Mutation
export type RemoveTokenMutation = { removeToken: types.Token };
export const removeTokenMutation = gql`
  ${tokenFragment}
  mutation removeToken($tokenId: ID!) {
    removeToken(tokenId: $tokenId) {
      ...tokenFragment
    }
  }
`;
export const removeToken = async (tokenId: string) =>
  (await mutate<RemoveTokenMutation>(removeTokenMutation, { tokenId })).removeToken;

// * Add TokenFiles Mutation
export type AddTokenFilesMutation = { addTokenFiles: types.File[] };
export const addTokenFilesMutation = gql`
  ${fileFragment}
  mutation addTokenFiles($files: [Upload!]!, $tokenId: String) {
    addTokenFiles(files: $files, tokenId: $tokenId) {
      ...fileFragment
    }
  }
`;
export const addTokenFiles = async (files: FileList, tokenId?: string) =>
  (await mutate<AddTokenFilesMutation>(addTokenFilesMutation, { files, tokenId })).addTokenFiles;

// * Generate Token Mutation
export type GenerateTokenMutation = { generateToken: types.Token };
export const generateTokenMutation = gql`
  ${tokenFragment}
  mutation generateToken($contractId: ID!, $tokenId: Int!) {
    generateToken(contractId: $contractId, tokenId: $tokenId) {
      ...tokenFragment
    }
  }
`;
export const generateToken = async (contractId: string, tokenId: number) =>
  (await mutate<GenerateTokenMutation>(generateTokenMutation, { contractId, tokenId })).generateToken;
