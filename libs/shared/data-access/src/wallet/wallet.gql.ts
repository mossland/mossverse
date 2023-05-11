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
  Int,
} from "@shared/util-client";
import { Network } from "../network/network.gql";

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

  @Field(() => String)
  status: cnst.WalletStatus;

  getShortenedAddress() {
    return this.address.slice(0, 6) + "..." + this.address.slice(-4);
  }
}

@ObjectType("LightWallet", { _id: "id", gqlRef: "Wallet" })
export class LightWallet extends PickType(Wallet, ["address", "status", "network"] as const) {}

@ObjectType("WalletSummary")
export class WalletSummary {
  @Field(() => Int)
  totalWallet: number;
}

export const walletGraphQL = createGraphQL("wallet" as const, Wallet, WalletInput, LightWallet);
export const {
  getWallet,
  listWallet,
  walletCount,
  walletExists,
  createWallet,
  updateWallet,
  removeWallet,
  walletFragment,
  purifyWallet,
  defaultWallet,
  mergeWallet,
} = walletGraphQL;
