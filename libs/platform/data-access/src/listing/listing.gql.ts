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
  PickType,
  SliceModel,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { User } from "../user/user.gql";
import { PriceTag, PriceTagInput, ShipInfoInput } from "../_scalar";
import { gql } from "@platform/data-access";
InputType("ListingInput");
export class ListingInput {
  @Field(() => User)
  user: User;

  @Field(() => shared.Wallet, { nullable: true })
  wallet: shared.Wallet | shared.LightWallet | null;

  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | shared.LightToken | null;

  @Field(() => shared.Thing, { nullable: true })
  thing: shared.Thing | shared.LightThing | null;

  @Field(() => shared.Product, { nullable: true })
  product: shared.Product | shared.LightProduct | null;

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

  getListingName() {
    if (this.token?.meta?.name) return this.token.meta.name;
    if (this.thing?.name) return this.thing.name;
    if (this.product?.name) return this.product.name;
    return "";
  }

  getListingImage() {
    if (this.token?.image?.url) return this.token.image.url;
    if (this.thing?.image?.url) return this.thing.image.url;
    if (this.product?.image?.url) return this.product.image.url;
    return "";
  }

  filterMyListing(self: gql.User) {
    console.log(this);
    return this.user.id === self.id;
  }
}

@ObjectType("LightListing", { _id: "id", gqlRef: "Listing" })
export class LightListing extends PickType(Listing, ["status", "priceTags", "token", "thing", "user"] as const) {
  // @Field(() => shared.LightToken)
  // override token: shared.LightToken | null;
}

export const listingGraphQL = createGraphQL("listing" as const, Listing, ListingInput, LightListing);
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
export type ListingSlice = SliceModel<"listing", Listing, LightListing>;

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
export const generateListing = async (data: InputOf<ListingInput>) =>
  (await mutate<GenerateListingMutation>(generateListingMutation, { data })).generateListing;
