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
  PickType,
} from "@shared/util-client";
import { Contract, contractFragment, LightContract } from "../contract/contract.gql";
import { File, fileFragment } from "../file/file.gql";
import { OpenSeaMeta } from "../_scalar";
import dayjs, { Dayjs } from "dayjs";

@InputType("TokenInput")
export class TokenInput {
  @Field(() => Contract)
  contract: Contract | LightContract;

  @Field(() => Int)
  tokenId: number | null;

  @Field(() => String, { nullable: true })
  root: string | null;

  @Field(() => String, { nullable: true })
  rootType: string | null;
}

@ObjectType("Token", { _id: "id" })
export class Token extends BaseGql(TokenInput) {
  @Field(() => String)
  purpose: cnst.TokenPurpose;

  @Field(() => Date)
  lockUntil: Dayjs;

  @Field(() => String, { nullable: true })
  uri: string | null;

  @Field(() => OpenSeaMeta, { nullable: true })
  meta: OpenSeaMeta | null;

  @Field(() => File, { nullable: true })
  image: File | null;

  @Field(() => String)
  status: cnst.TokenStatus;

  getImageUrl() {
    return this.meta?.image ?? "";
  }

  isLocked() {
    return dayjs().isBefore(this.lockUntil);
  }
  static addOrRemoveAttributeFilterQuery(queryOfToken: any, traitType: string, value: string) {
    let queries: cnst.TokenAttributeQuery[] = [...(queryOfToken.$and ?? [])];
    const query = queries.find((query) => query["meta.attributes.trait_type"] === traitType);
    if (query?.["meta.attributes.value"].$in.includes(value))
      query["meta.attributes.value"].$in = query["meta.attributes.value"].$in.filter((v) => v !== value);
    else if (query)
      queries = queries.map((q) =>
        q === query ? { ...query, "meta.attributes.value": { $in: [...query["meta.attributes.value"].$in, value] } } : q
      );
    else queries.push({ "meta.attributes.trait_type": traitType, "meta.attributes.value": { $in: [value] } });
    const andQuery = [...queries.filter((query) => query["meta.attributes.value"].$in.length > 0)];
    return { ...queryOfToken, tokenId: undefined, $and: andQuery.length ? andQuery : undefined };
  }
  static removeAttributeFilterQueryByTraitType(queryOfToken: any, traitType: string) {
    const andQuery =
      queryOfToken.$and?.filter(
        (query: cnst.TokenAttributeQuery) => query["meta.attributes.trait_type"] !== traitType
      ) ?? [];
    return { ...queryOfToken, tokenId: undefined, $and: andQuery.length ? andQuery : undefined };
  }
  static isTraitTypeSelected(queryOfToken: any, traitType: string) {
    return queryOfToken.$and?.some(
      (query: cnst.TokenAttributeQuery) => query["meta.attributes.trait_type"] === traitType
    );
  }
  static isAttributeSelected(queryOfToken: any, traitType: string, value: string) {
    return queryOfToken.$and?.some(
      (query: cnst.TokenAttributeQuery) =>
        query["meta.attributes.trait_type"] === traitType && query["meta.attributes.value"].$in?.includes(value)
    );
  }

  static findByName(tokens: LightToken[], name: string) {
   return tokens.find((token) => token.meta?.name === name)
  }
  static pickByName(tokens: LightToken[], name: string) {
   const token  = tokens.find((token) => token.meta?.name === name)
    if (!token) throw new Error(`Token with name ${name} not found`)
    return token;
  }
}

@ObjectType("LightToken", { _id: "id", gqlRef: "Token" })
export class LightToken extends PickType(Token, [
  "contract",
  "tokenId",
  "purpose",
  "meta",
  "image",
  "purpose",
  "lockUntil",
  "status",
  "uri",
] as const) {
  @Field(() => LightContract)
  override contract: LightContract;
}

@ObjectType("TokenSummary")
export class TokenSummary {
  @Field(() => Int)
  totalToken: number;
}

export const tokenGraphQL = createGraphQL("token" as const, Token, TokenInput, LightToken);
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
  crystalizeToken,
  lightCrystalizeToken,
  defaultToken,
  mergeToken,
} = tokenGraphQL;

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
