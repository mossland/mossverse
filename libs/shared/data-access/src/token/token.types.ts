import gql from "graphql-tag";
import * as types from "../types";
import { cnst } from "@shared/util";
import { openSeaMetaFragment } from "../_scalar";
import { fileFragment } from "../file/file.types";
import { contractFragment } from "../contract/contract.types";
import { Nullable } from "@shared/util-client";

export type TokenInput = {
  contract: types.ID;
  tokenId: number | null;
};

export type Token = {
  id: string;
  contract: types.Contract;
  tokenId: number | null;
  type: cnst.TokenType;
  uri: string | null;
  meta: types.OpenSeaMeta | null;
  image: types.File | null;
  status: cnst.TokenStatus;
  createdAt: Date;
  updatedAt: Date;
};
export const defaultToken: Nullable<Token> = {
  id: null,
  contract: null,
  tokenId: null,
  type: "general",
  uri: null,
  meta: null,
  image: null,
  status: null,
  createdAt: null,
  updatedAt: null,
};
export const purifyToken = (token: Token): TokenInput => ({
  contract: token.contract.id,
  tokenId: token.tokenId,
});

export const tokenFragment = gql`
  ${openSeaMetaFragment}
  ${contractFragment}
  ${fileFragment}
  fragment tokenFragment on Token {
    id
    contract {
      ...contractFragment
    }
    tokenId
    type
    uri
    meta {
      ...openSeaMetaFragment
    }
    image {
      ...fileFragment
    }
    status
    createdAt
    updatedAt
  }
`;

export type TokenItemInput = {
  token: types.ID;
  num: number;
};
export type TokenItem = {
  contract: types.ID;
  token: types.Token;
  type: string;
  num: number;
  bn: string;
};
export const purifyTokenItem = (tokenItem: TokenItem): TokenItemInput => ({
  token: tokenItem.token.id,
  num: tokenItem.num,
});
export const tokenItemFragment = gql`
  ${tokenFragment}
  fragment tokenItemFragment on TokenItem {
    contract
    token {
      ...tokenFragment
    }
    num
    bn
  }
`;
