import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, makeStore, SetGet } from "@shared/util-client";
import { Listing, listingGraphQL, ListingInput } from "./listing.gql";

const state = {
  ...createState(listingGraphQL),
  priceTag: null as gql.PriceTag | null,
  num: 0,
  marketAddr: null as string | null,
  filter: "all" as gql.ListingFilter,
  myTokensFilter: "all" as gql.MyTokensFilter,
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(listingGraphQL, { get, set }),
  generateListing: async () => {
    const { listingForm, listingList } = pick("listingForm", "listingList");
    const input = gql.purifyListing(listingForm);
    if (!input) throw new Error("Invalid Input");
    const listing = await gql.generateListing(input);
    set({ listingList: [...listingList, listing], listing });
  }, // 생성
  cancel: async () => {
    const { listing } = pick();
    await gql.closeListing(listing.id);
  },
  buyItem: async (shipInfo?: gql.ShipInfo) => {
    const { listing, num, priceTag } = pick("listing", "num", "priceTag");
    const input = gql.purifyPriceTag(priceTag);
    if (!input) throw new Error("No PriceTag or Listing");
    await gql.purchaseListing(listing.id, input, num, shipInfo);
  },
  openListing: async (listingForm: gql.Listing) => set({ listingForm }),
});
export const listing = makeStore(listingGraphQL.refName, state, actions);
