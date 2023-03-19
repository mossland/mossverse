import * as gql from "../gql";
import { createActions, createState, SetGet, Slice, Get, createSlicer, client, SetPick } from "@shared/util-client";
import type { RootState } from "../store";

// ? Slice는 재사용가능한 상태와 액션을 정의합니다. 외부 상태를 가져다쓰지 않는 경우에만 사용하세요.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget, suffix: string) => ({
  ...createState(gql.listingGraphQL),
  ...createActions(gql.listingGraphQL, setget, suffix),
  priceTag: null as gql.PriceTag | null,
  num: 0,
  marketAddr: "",
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, pick }: SetPick<typeof state>, suffix: string) => ({
  generateListing: async () => {
    const { listingForm, listingList } = pick("listingForm", "listingList");
    const input = gql.purifyListing(listingForm);
    if (!input) throw new Error("Invalid Input");
    const listing = await gql.generateListing(input);
    set({ listingList: [...listingList, listing], listing });
  }, // 생성
  buyItem: async (shipInfo?: gql.ShipInfo) => {
    const { listing, num, priceTag } = pick("listing", "num", "priceTag");
    const input = gql.purifyPriceTag(priceTag);
    if (!input) throw new Error("No PriceTag or Listing");
    await gql.purchaseListing(listing.id, input, num, shipInfo);
  },
  cancelListing: async () => {
    const { listing, setQueryOfListing } = pick("listing", "setQueryOfListing");
    await gql.closeListing(listing.id);
    await setQueryOfListing({});
    set({ listingModal: "" });
  },
});

export type ListingSliceState = Get<typeof state, typeof actions>;
export type ListingSlice = Slice<"listing", ListingSliceState>;
export const makeListingSlice = createSlicer("listing" as const, state, actions);
