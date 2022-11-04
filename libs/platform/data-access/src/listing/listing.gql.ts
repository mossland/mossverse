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
  Int,
  InputOf,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { User } from "../user/user.gql";
import { PriceTag, PriceTagInput, ShipInfoInput } from "../_scalar";

@InputType("ListingInput")
export class ListingInput {
  @Field(() => User)
  user: User;

  @Field(() => shared.Wallet, { nullable: true })
  wallet: shared.Wallet | null;

  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | null;

  @Field(() => shared.Thing, { nullable: true })
  thing: shared.Thing | null;

  @Field(() => shared.Product, { nullable: true })
  product: shared.Product | null;

  @Field(() => Int)
  limit: number;

  @Field(() => Date)
  closeAt: Date;

  @Field(() => [PriceTag])
  priceTags: PriceTag[];
}

@ObjectType("Listing", { _id: "id" })
export class Listing extends BaseGql(ListingInput) {
  @Field(() => String)
  status: cnst.ListingStatus;
}

export const listingGraphQL = createGraphQL<"listing", Listing, ListingInput>(Listing, ListingInput);
export const {
  getListing,
  listListing,
  listingCount,
  listingExists,
  createListing,
  updateListing,
  removeListing,
  listingFragment,
  purifyListing,
  defaultListing,
} = listingGraphQL;

// * Close Listing Mutation
export type CloseListingMutation = { closeListing: Listing };
export const closeListingMutation = graphql`
  ${listingFragment}
  mutation closeListing($listingId: ID!) {
    closeListing(listingId: $listingId) {
      ...listingFragment
    }
  }
`;
export const closeListing = async (listingId: string) =>
  (await mutate<CloseListingMutation>(closeListingMutation, { listingId })).closeListing;

// * Open Listing Mutation
export type OpenListingMutation = { openListing: Listing };
export const openListingMutation = graphql`
  ${listingFragment}
  mutation openListing($listingId: ID!, $data: ListingInput!) {
    openListing(listingId: $listingId, data: $data) {
      ...listingFragment
    }
  }
`;

export type GenerateListingMutation = { generateListing: Listing };
export const generateListingMutation = graphql`
  ${listingFragment}
  mutation generateListing($data: ListingInput!) {
    generateListing(data: $data) {
      ...listingFragment
    }
  }
`;
export const generateListing = async (data: ListingInput) =>
  (await mutate<GenerateListingMutation>(generateListingMutation, { data })).generateListing;
