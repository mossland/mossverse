import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  createFragment,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  Int,
  BaseGql,
  BaseArrayFieldGql,
} from "@shared/util-client";
import { Contract, contractFragment } from "../contract/contract.gql";
import { File, fileFragment } from "../file/file.gql";
import { OpenSeaMeta } from "../_scalar";

@InputType("TokenInput")
export class TokenInput {
  @Field(() => Contract)
  contract: Contract;

  @Field(() => Int)
  tokenId: number | null;
}

@ObjectType("Token", { _id: "id" })
export class Token extends BaseGql(TokenInput) {
  @Field(() => String)
  type: cnst.TokenType;

  @Field(() => String, { nullable: true })
  uri: string | null;

  @Field(() => OpenSeaMeta, { nullable: true })
  meta: OpenSeaMeta | null;

  @Field(() => File, { nullable: true })
  image: File | null;

  @Field(() => String)
  status: cnst.TokenStatus;
}

export const tokenGraphQL = createGraphQL<"token", Token, TokenInput>(Token, TokenInput);
export const {
  getToken,
  listToken,
  tokenCount,
  tokenExists,
  createToken,
  updateToken,
  removeToken,
  tokenFragment,
  purifyToken,
  defaultToken,
} = tokenGraphQL;

@InputType("TokenItemInput")
export class TokenItemInput {
  @Field(() => Token)
  token: Token;

  @Field(() => Int)
  num: number;
}

@ObjectType("TokenItem")
export class TokenItem extends BaseArrayFieldGql(TokenItemInput) {
  @Field(() => String)
  contract: string;

  @Field(() => Int)
  bn: number;
}
export const tokenItemFragment = createFragment(TokenItem);

// * Add TokenFiles Mutation
export type AddTokenFilesMutation = { addTokenFiles: File[] };
export const addTokenFilesMutation = graphql`
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
export type GenerateTokenMutation = { generateToken: Token };
export const generateTokenMutation = graphql`
  ${tokenFragment}
  mutation generateToken($contractId: ID!, $tokenId: Int!) {
    generateToken(contractId: $contractId, tokenId: $tokenId) {
      ...tokenFragment
    }
  }
`;
export const generateToken = async (contractId: string, tokenId: number) =>
  (await mutate<GenerateTokenMutation>(generateTokenMutation, { contractId, tokenId })).generateToken;
