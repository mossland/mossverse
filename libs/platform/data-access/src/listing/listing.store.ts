import { client, SetGet, State } from "@shared/util-client";
import type { RootState } from "../store";
import * as gql from "../gql";
import * as slice from "../slice";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = ({ set, get, pick }: SetGet<slice.ListingSliceState>) => ({
  ...slice.makeListingSlice({ set, get, pick }),
  ...slice.makeListingSlice({ set, get, pick }, "InSelf" as const),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  buyListing: async () => {
    const { listing, refreshListing, queryOfListing, whoAmI, refreshOwnershipInItem, refreshOwnershipInMoney } =
      get() as RootState;
    if (listing === "loading") return;
    //? 어떻게 해야하는가?
    await whoAmI();
    const priceTag = await gql.purifyPriceTag(listing.priceTags[0]);
    if (!priceTag) throw new Error("No PriceTag or Listing");
    await client.setWallet("kaikas");
    await gql.purchaseListing(listing.id, priceTag, 1);
    // await st.do.initAuth();
    await refreshOwnershipInItem({ invalidate: true });
    await refreshOwnershipInMoney({ invalidate: true });
    await refreshListing({ query: queryOfListing });
    set({ listingModal: "" });
  },
  sellListing: async () => {
    const { listing, listingForm, marketAddr, createListing } = get() as RootState;
    await client.setWallet("kaikas");
    if (listingForm.token && marketAddr)
      await (client.wallet as any).setApprovalForAll(listingForm.token.contract.address, marketAddr);
    await createListing();
  },
});

export type ListingState = State<typeof state, typeof actions>;
// * 3. ChildSlice를 추가하세요. Suffix 규칙은 일반적으로 "InModel" as const 로 작성합니다.
export const addListingToStore = ({ set, get, pick }: SetGet<ListingState>) => ({
  ...state({ set, get, pick }),
  ...actions({ set, get, pick }),
});
