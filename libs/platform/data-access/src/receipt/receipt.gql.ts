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
  InputOf,
  PickType,
  Int,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { LightUser, User } from "../user/user.gql";
import { Listing } from "../listing/listing.gql";
import { Raffle } from "../raffle/raffle.gql";
import { Exchange, PriceTagInput } from "../_scalar/scalar.gql";

@InputType("ReceiptInput")
export class ReceiptInput {
  @Field(() => String)
  name: string;

  @Field(() => User, { nullable: true })
  from: User | LightUser | null;

  @Field(() => shared.Wallet, { nullable: true })
  fromWallet: shared.Wallet | null;

  @Field(() => User, { nullable: true })
  to: User | null;

  @Field(() => shared.Wallet, { nullable: true })
  toWallet: shared.Wallet | null;

  @Field(() => Listing, { nullable: true })
  listing: Listing | null;

  @Field(() => [Exchange])
  inputs: Exchange[];

  @Field(() => [Exchange])
  outputs: Exchange[];

  // @Field(() => ShipInfo, { nullable: true })
  // shipInfo: ShipInfo | null;
}

@ObjectType("Receipt", { _id: "id" })
export class Receipt extends BaseGql(ReceiptInput) {
  @Field(() => [String])
  tags: string[];

  @Field(() => String, { nullable: true })
  err?: string;

  @Field(() => String)
  status: cnst.ReceiptStatus;
}

@ObjectType("LightReceipt", { _id: "id", gqlRef: "Receipt" })
export class LightReceipt extends PickType(Receipt, ["name", "status", "inputs", "outputs"] as const) {}

@ObjectType("ReceiptSummary")
export class ReceiptSummary {
  @Field(() => Int)
  totalReceipt: number;
}

export const receiptGraphQL = createGraphQL("receipt" as const, Receipt, ReceiptInput, LightReceipt);
export const {
  getReceipt,
  listReceipt,
  receiptCount,
  receiptExists,
  createReceipt,
  updateReceipt,
  removeReceipt,
  receiptFragment,
  purifyReceipt,
  crystalizeReceipt,
  lightCrystalizeReceipt,
  defaultReceipt,
  mergeReceipt,
} = receiptGraphQL;

export type PurchaseListingMutation = { purchaseListing: Receipt };
export const purchaseListingMutation = graphql`
  ${receiptFragment}
  mutation purchaseListing($listingId: ID!, $priceTag: PriceTagInput!, $value: Float!, $shipInfo: ShipInfoInput) {
    purchaseListing(listingId: $listingId, priceTag: $priceTag, value: $value, shipInfo: $shipInfo) {
      ...receiptFragment
    }
  }
`;
export const purchaseListing = async (
  listingId: string,
  priceTag: InputOf<PriceTagInput>,
  value: number,
  shipInfo?: any
) =>
  (await mutate<PurchaseListingMutation>(purchaseListingMutation, { listingId, priceTag, value, shipInfo }))
    .purchaseListing;

export type RaffleMutation = { raffle: Raffle };
export const raffleMutation = graphql`
  ${receiptFragment}
  mutation raffle($raffleId: ID!, $priceTag: PriceTagInput!) {
    raffle(raffleId: $raffleId, priceTag: $priceTag) {
      ...receiptFragment
    }
  }
`;

export const raffle = async (raffleId: string, priceTag: InputOf<PriceTagInput>) =>
  (await mutate<RaffleMutation>(raffleMutation, { raffleId, priceTag })).raffle;
