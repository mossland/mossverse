import * as fetch from "../fetch";
import { Get, SetGet, Slice, client, createActions, createSlicer, createState } from "@util/client";
import type { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.listingGraphQL),
  priceTag: null as fetch.PriceTag | null,
  num: 0,
  marketAddr: "",
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.listingGraphQL, { set, get, pick }),
  generateListing: async () => {
    const { listingForm, listingMap } = pick("listingForm", "listingMap");
    const input = fetch.purifyListing(listingForm);
    if (!input) throw new Error("Invalid Input");
    const listing = await fetch.generateListing(input);
    listingMap.set(listing.id, listing);
    set({ listingMap: new Map(listingMap), listing });
  }, // 생성
  buyItem: async (shipInfo?: fetch.ShipInfo) => {
    const { listing, num, priceTag } = pick("listing", "num", "priceTag");
    const input = fetch.purifyPriceTag(priceTag);
    if (!input) throw new Error("No PriceTag or Listing");
    await fetch.purchaseListing(listing.id, input, num, shipInfo);
  },
  cancelListing: async () => {
    const { setQueryOfListing } = get() as RootState;
    const { listing } = pick("listing");
    await fetch.closeListing(listing.id);
    await setQueryOfListing({});
    set({ listingModal: "" });
  },
  buyListing: async () => {
    const { listing, refreshListing, queryOfListing, whoAmI, initMoneyAndItems } = get() as RootState;
    if (listing === "loading") return;
    //? 어떻게 해야하는가?
    await whoAmI();
    const priceTag = await fetch.purifyPriceTag(listing.priceTags[0]);
    if (!priceTag) throw new Error("No PriceTag or Listing");
    if (!client.isSigned()) return window.alert("Wallet is not signed");
    await fetch.purchaseListing(listing.id, priceTag, 1);
    await initMoneyAndItems();
    await refreshListing({ query: queryOfListing });
    set({ listingModal: "" });
  },
  sellListing: async () => {
    const { listing, listingForm, marketAddr, createListing } = get() as RootState;
    if (!client.isSigned()) return window.alert("Wallet is not signed");
    if (listingForm.token && marketAddr)
      await (client as any).wallet.setApprovalForAll(listingForm.token.contract.address, marketAddr);
    await createListing();
  },
});

export type ListingState = Get<typeof state, typeof actions>;
export type ListingSlice = Slice<"listing", ListingState>;
export const makeListingSlice = createSlicer("listing" as const, state, actions);
