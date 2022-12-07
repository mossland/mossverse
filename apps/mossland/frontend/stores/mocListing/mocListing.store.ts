import { StateCreator } from "zustand";
import * as gql from "../gql";
import {
  createActions,
  createState,
  DefaultActions,
  DefaultOf,
  DefaultState,
  InputOf,
  makeStore,
  SetGet,
} from "@shared/util-client";
import { cnst } from "@shared/util";

const state = {
  ...createState(gql.platform.listingGraphQL),
  priceTag: null as gql.platform.PriceTag | null,
  num: 0,
  marketAddr: null as string | null,
  filter: "all" as gql.ListingFilter,
  myTokensFilter: "all" as gql.MyTokensFilter,
};

const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(gql.platform.listingGraphQL, { get, set }),
  generateListing: async () => {
    const { listingForm, listingList } = pick("listingForm", "listingList");
    const input = gql.platform.purifyListing(listingForm);
    if (!input) throw new Error("Invalid Input");
    const listing = await gql.platform.generateListing(input);
    set({ listingList: [...listingList, listing], listing });
  }, // 생성
  cancel: async () => {
    const { listing } = pick();
    await gql.platform.closeListing(listing.id);
  },
  buyItem: async (shipInfo?: gql.platform.ShipInfo) => {
    const { listing, num, priceTag } = pick("listing", "num", "priceTag");
    const input = gql.platform.purifyPriceTag(priceTag);
    if (!input) throw new Error("No PriceTag or Listing");
    await gql.platform.purchaseListing(listing.id, input, num, shipInfo);
  },
  openListing: async (listingForm: gql.platform.Listing) => set({ listingForm }),
});

export const mocMarket = makeStore(gql.platform.listingGraphQL.refName, state, actions);
