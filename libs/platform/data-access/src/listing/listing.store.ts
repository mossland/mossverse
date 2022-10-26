import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { createSelectors, Nullable } from "@shared/util-client";
import { update } from "libs/shared/util/src/utils";
import { cnst } from "@shared/util";

type State = Nullable<types.Listing> & {
  listing: types.Listing | null;
  priceTag: types.PriceTag | null;
  listings: types.Listing[];
  num: number;
  filter: types.ListingFilter;
  myTokensFilter: types.MyTokensFilter;
  marketAddr: string | null;
  operation: cnst.StoreOperation;
};

const initialState: State = {
  ...types.defaultListing,
  // ...types.defaultPriceTag,
  priceTag: null,
  listing: null,
  listings: [],
  num: 0,
  marketAddr: null,
  filter: "all",
  myTokensFilter: "all",
  operation: "sleep",
};

type Action = {
  init: () => Promise<void>; // 초기화
  purify: () => types.ListingInput | null; // 유효성검사 및 Map => MapInput 변환
  purifyPriceTag: () => types.PriceTagInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  cancel: () => Promise<void>; // 제거
  reset: (listing?: types.Listing) => void; // 수정필드 리셋
  buyItem: (shipInfo?: types.ShipInfo) => Promise<types.Receipt | undefined>;
};

export const useListing = create<State & Action>()(
  devtools((set, get) => ({
    ...initialState,
    init: async () => {
      const listings = await gql.listings({ status: "active" });
      const sortListing = [...listings].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      set({ listings: sortListing, operation: "idle" });
    },
    purify: () => {
      const state = get();
      try {
        if (!state.priceTag) return null;
        const listing = types.purifyListing(state as types.Listing, state.priceTag);
        return listing;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    purifyPriceTag: () => {
      const { priceTag } = get();
      if (!priceTag) return null;
      try {
        const priceTagInput = types.purifyPriceTag(priceTag);
        return priceTagInput;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    create: async () => {
      const { purify, listings, id } = get();
      const input = purify();
      if (!input) return;
      const listing = await gql.generateListing(input);

      if (!listing) return;
      return set({ listings: [...listings, listing], listing });
    }, // 생성
    update: async () => {
      const { purify, listings, id } = get();
      const input = purify();
      if (!input || !id) return;
      const sirvey = input && (await gql.updateListing(id, input));
      return set({ listings: [sirvey, ...listings.filter((a) => a.id !== sirvey.id)] });
    }, // 수정
    remove: async () => {
      const { id, listings } = get();
      const listing = id && (await gql.removeListing(id));
      return set({ listings: [...listings.filter((a) => a.id !== id)] });
    }, // 제거
    reset: (listing?: types.Listing) => set({ ...types.defaultListing, listing }),
    cancel: async () => {
      const { listing } = get();
      if (!listing) return;
      await gql.closeListing(listing.id);
    },
    buyItem: async (shipInfo?: types.ShipInfo) => {
      const { purifyPriceTag, listing, num } = get();
      const priceTag = purifyPriceTag();
      if (!priceTag || !listing) throw new Error("No PriceTag or Listing");
      return await gql.purchaseListing(listing.id, priceTag, num, shipInfo);
    },
  }))
);

export const listingStore = createSelectors(useListing);
