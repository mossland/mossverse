import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
import { userFragment, priceTagFragment } from "../types";
import { productFragment, thingFragment, tokenFragment, walletFragment } from "libs/shared/data-access/src/types";

export type ListingInput = {
  user: types.ID;
  wallet?: types.ID;
  token?: types.ID;
  thing?: types.ID;
  product?: types.ID;
  limit: number;
  closeAt: Date;
  priceTags: types.PriceTagInput[];
};

export type Listing = {
  id: types.ID;
  user: types.User;
  wallet: types.shared.Wallet;
  token?: types.shared.Token;
  thing?: types.shared.Thing;
  product?: types.shared.Product;
  limit: number;
  priceTags: types.PriceTag[];
  status: cnst.ListingStatus;
  createdAt: Date;
  updatedAt: Date;
  closeAt: Date;
};
export const purifyListing = (listing: Listing, priceTag?: types.PriceTag): ListingInput => ({
  user: listing.user?.id,
  wallet: listing.wallet?.id,
  token: listing.token?.id,
  thing: listing.thing?.id,
  product: listing.product?.id,
  limit: listing.limit,
  closeAt: listing.closeAt,
  priceTags: [
    ...(listing.priceTags ? listing.priceTags.map((priceTag) => purifyPriceTag(priceTag)) : []),
    ...(priceTag ? [purifyPriceTag(priceTag)] : []),
  ],
});
export const purifyPriceTag = (listing: types.PriceTag): types.PriceTagInput => ({
  thing: listing.thing && listing.thing.id,
  token: listing.token && listing.token.id,
  price: listing.price,
  type: listing.type,
});

export const listingFragment = gql`
  ${userFragment}
  ${walletFragment}
  ${productFragment}
  ${thingFragment}
  ${tokenFragment}
  ${priceTagFragment}
  fragment listingFragment on Listing {
    id
    user {
      ...userFragment
    }
    wallet {
      ...walletFragment
    }
    token {
      ...tokenFragment
    }
    thing {
      ...thingFragment
    }
    product {
      ...productFragment
    }
    limit
    priceTags {
      ...priceTagFragment
    }
    status
    createdAt
    updatedAt
    closeAt
  }
`;

export const defaultListing: Nullable<Listing> = {
  id: null,
  user: null,
  wallet: null,
  token: null,
  thing: null,
  product: null,
  limit: null,
  priceTags: null,
  status: null,
  createdAt: null,
  updatedAt: null,
  closeAt: null,
};
export const defaultPriceTag: Nullable<types.PriceTag> = {
  price: null,
  thing: null,
  token: null,
  type: null,
};

export type ListingFilter = "all" | "mossMarket" | "p2p" | "myTokens";
export type ListingType = "default" | "delivery" | "p2p" | "myTokens";
export type MyTokensFilter = "all" | "onSale";
