import { BaseGql, Field, InputType, Int, ObjectType, PickType, cnst, createGraphQL } from "@util/client";
import { Network } from "../network/network.fetch";

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

export const walletQueryMap = {
  totalWallet: { status: { $ne: "inactive" } },
};

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
