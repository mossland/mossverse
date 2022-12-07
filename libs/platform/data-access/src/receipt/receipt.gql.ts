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
  SliceModel,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { LightUser, User } from "../user/user.gql";
import { Listing } from "../listing/listing.gql";
import { Exchange, PriceTagInput, ShipInfo, ShipInfoInput } from "../_scalar";

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

  @Field(() => ShipInfo, { nullable: true })
  shipInfo: ShipInfo | null;
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
export class LightReceipt extends PickType(Receipt, ["name", "status"] as const) {}

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
  defaultReceipt,
} = receiptGraphQL;
export type ReceiptSlice = SliceModel<"receipt", Receipt, LightReceipt>;

// * MyReceipts Query
export type MyReceiptsQuery = { myReceipts: Receipt[] };
export const myReceiptsQuery = graphql`
  ${receiptFragment}
  query myReceipts($userId: ID!, $type: String!) {
    myReceipts(userId: $userId, type: $type) {
      ...receiptFragment
    }
  }
`;

export const myReceipts = async (userId: string, type: cnst.ReceiptType) =>
  (await query<MyReceiptsQuery>(myReceiptsQuery, { userId, type })).myReceipts;

export type PurchaseListingMutation = { purchaseListing: Receipt };
export const purchaseListingMutation = graphql`
  ${receiptFragment}
  mutation purchaseListing($listingId: ID!, $priceTag: PriceTagInput!, $num: Float!, $shipInfo: ShipInfoInput) {
    purchaseListing(listingId: $listingId, priceTag: $priceTag, num: $num, shipInfo: $shipInfo) {
      ...receiptFragment
    }
  }
`;
export const purchaseListing = async (
  listingId: string,
  priceTag: InputOf<PriceTagInput>,
  num: number,
  shipInfo?: InputOf<ShipInfoInput>
) =>
  (await mutate<PurchaseListingMutation>(purchaseListingMutation, { listingId, priceTag, num, shipInfo }))
    .purchaseListing;
