import {
  BaseGql,
  Field,
  InputOf,
  InputType,
  Int,
  ObjectType,
  PickType,
  cnst,
  createGraphQL,
  graphql,
  mutate,
} from "@util/client";
import { Dayjs } from "dayjs";
import { PriceTag } from "../_platform/platform.fetch";
import { User } from "../user/user.fetch";
import { fetch as shared } from "@shared/client";
InputType("ListingInput");
export class ListingInput {
  @Field(() => User)
  user: User;

  @Field(() => String, { nullable: false })
  type: cnst.ListingType;

  @Field(() => shared.Wallet, { nullable: true })
  wallet: shared.Wallet | shared.LightWallet | null;

  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | shared.LightToken | null;

  @Field(() => shared.Thing, { nullable: true })
  thing: shared.Thing | shared.LightThing | null;

  @Field(() => shared.Product, { nullable: true })
  product: shared.Product | shared.LightProduct | null;

  @Field(() => String, { nullable: false })
  sellingType: cnst.SellingType;

  @Field(() => Int)
  value: number;

  @Field(() => Date, { nullable: true })
  closeAt: Dayjs | null;

  @Field(() => [String])
  tags: string[];

  @Field(() => [PriceTag])
  priceTags: PriceTag[];
}

@ObjectType("Listing", { _id: "id" })
export class Listing extends BaseGql(ListingInput) {
  @Field(() => String)
  status: cnst.ListingStatus;

  //매출량
  @Field(() => Int)
  sale: number;
  getName() {
    if (this.token?.meta?.name) return this.token.meta.name;
    if (this.thing?.name) return this.thing.name;
    if (this.product?.name) return this.product.name;
    else return `Unknown ${this.token ? `#${this.token.tokenId}` : ""}`;
  }
  getImage() {
    if (this.token?.image) return this.token.image;
    if (this.thing?.image) return this.thing.image;
    if (this.product?.image) return this.product.image;
    else return "";
  }
  getImageUrl() {
    if (this.token?.image?.url) return this.token.image.url;
    if (this.thing?.image?.url) return this.thing.image.url;
    if (this.product?.image?.url) return this.product.image.url;
    else return "";
  }
  getDescription() {
    if (this.token?.meta?.description) return this.token.meta.description;
    if (this.thing?.description) return this.thing.description;
    if (this.product?.description) return this.product.description;
    else return "";
  }

  getRemain() {
    return this.value - this.sale;
  }
  totalValue() {
    return this.value + this.sale;
  }

  filterMyListing(self: User) {
    return this.user.id === self.id;
  }
}

@ObjectType("LightListing", { _id: "id", gqlRef: "Listing" })
export class LightListing extends PickType(Listing, [
  "status",
  "priceTags",
  "token",
  "thing",
  "user",
  "tags",
  "sellingType",
  "product",
  "type",
  "value",
  "sale",
] as const) {
  // @Field(() => shared.LightToken)
  // override token: shared.LightToken | null;
}

@ObjectType("ListingSummary")
export class ListingSummary {
  @Field(() => Int)
  totalListing: number;
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
  crystalizeListing,
  lightCrystalizeListing,
  defaultListing,
  mergeListing,
  initListing,
  viewListing,
  editListing,
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
export const generateListing = async (data: InputOf<ListingInput>) =>
  (await mutate<GenerateListingMutation>(generateListingMutation, { data })).generateListing;
