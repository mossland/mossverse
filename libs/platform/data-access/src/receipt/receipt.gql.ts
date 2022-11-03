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
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { User } from "../user/user.gql";
import { Listing } from "../listing/listing.gql";
import { Exchange, PriceTagInput, ShipInfo, ShipInfoInput } from "../_scalar";

@InputType("ReceiptInput")
export class ReceiptInput {
  @Field(() => User, { nullable: true })
  from: User | null;

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
  @Field(() => String)
  status: cnst.ReceiptStatus;
}

export const receiptGraphQL = createGraphQL<"receipt", Receipt, ReceiptInput>(Receipt, ReceiptInput);
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
