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
  BaseGql,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { Network } from "../network/network.gql";
import { TokenItem } from "../token/token.gql";

@InputType("WalletInput")
export class WalletInput {
  @Field(() => Network)
  network: Network;

  @Field(() => String)
  address: string;
}

@ObjectType("Wallet", { _id: "id" })
export class Wallet extends BaseGql(WalletInput) {
  @Field(() => String)
  type: cnst.WalletType;

  @Field(() => [TokenItem])
  items: TokenItem[];

  @Field(() => String)
  status: cnst.WalletStatus;
}

@ObjectType("LightWallet", { _id: "id", gqlRef: "Wallet" })
export class LightWallet extends PickType(Wallet, ["address", "status"] as const) {}

export const walletGraphQL = createGraphQL("wallet" as const, Wallet, WalletInput, LightWallet);
export const {
  getWallet,
  listWallet,
  walletCount,
  walletExists,
  createWallet,
  updateWallet,
  // removeWallet,
  walletFragment,
  purifyWallet,
  defaultWallet,
} = walletGraphQL;
export type WalletSlice = SliceModel<"wallet", Wallet, LightWallet>;
