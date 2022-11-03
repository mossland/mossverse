import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore, InputOf } from "@shared/util-client";
import { Listing, listingGraphQL, ListingInput } from "./listing.gql";

type State = DefaultState<"listing", gql.Listing> & {
  priceTag: gql.PriceTag | null;
  num: number;
  filter: gql.ListingFilter;
  myTokensFilter: gql.MyTokensFilter;
  marketAddr: string | null;
};
const initialState: State = {
  ...createState<"listing", gql.Listing, gql.ListingInput>(listingGraphQL),
  priceTag: null,
  num: 0,
  marketAddr: null,
  filter: "all",
  myTokensFilter: "all",
};
type Actions = DefaultActions<"listing", gql.Listing, gql.ListingInput> & {
  generateListing: () => Promise<gql.Listing>;
  purifyPriceTag: () => InputOf<gql.PriceTagInput> | null; // 유효성검사 및 Map => MapInput 변환
  cancel: () => Promise<void>; // 제거
  buyItem: (shipInfo?: gql.ShipInfo) => Promise<gql.Receipt | undefined>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"listing", gql.Listing, gql.ListingInput>(listingGraphQL, { get, set }),
  purifyPriceTag: () => {
    const { priceTag } = get();
    if (!priceTag) return null;
    try {
      const priceTagInput = gql.purifyPriceTag(priceTag);
      return priceTagInput;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  generateListing: async () => {
    const { purifyListing, listings, id } = get();
    const input = purifyListing();
    if (!input) throw new Error("Invalid Input");
    const listing = await gql.generateListing(input);
    set({ listings: [...listings, listing], listing });
    return listing;
  }, // 생성
  cancel: async () => {
    const { listing } = get();
    if (!listing) return;
    await gql.closeListing(listing.id);
  },
  buyItem: async (shipInfo?: gql.ShipInfo) => {
    const { purifyPriceTag, listing, num } = get();
    const priceTag = purifyPriceTag();
    if (!priceTag || !listing) throw new Error("No PriceTag or Listing");
    return await gql.purchaseListing(listing.id, priceTag, num, shipInfo);
  },
}));
export const listing = generateStore(store);
