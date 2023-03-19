import React, { useEffect } from "react";
import { BackButton, Common, MarketHeader, MenuBar, MyTokensHeader } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { Raffle, Listing } from "@platform/ui-web";
import Router from "next/router";
import { DataEditModal, LoadItems, Ownership } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();
  const ownershipInItem = st.use.ownershipInItem();
  const thingList = st.use.thingList();
  const MMOC = thingList !== "loading" ? (gql.shared.Thing.find(thingList, "MMOC") as gql.shared.Thing) : null;

  useEffect(() => {
    if (ownershipInItem === "loading") return;

    st.do.newListingInSelf({
      ...ownershipInItem,
      user: self,
      value: 0,
      priceTags: [
        {
          thing: MMOC,
          type: "thing",
          discountPrice: 0,
          price: 0,
          token: null,
        },
      ],
    } as any);
  }, [ownershipInItem]);

  return (
    <div className="overflow-hidden">
      <MyTokensHeader />
      <BackButton />
      <DataEditModal
        type="form"
        slice={st.slice.characterInSubmit}
        renderSubmit={(item, opt) => (
          <Common.MintButton className="mx-[50px]" onClick={async () => await st.do.createListingInSelf()}>
            판매 시작
          </Common.MintButton>
        )}
      >
        <Listing.Edit.InSelf slice={st.slice.listingInSelf} ownershipSlice={st.slice.ownershipInItem} />
      </DataEditModal>
    </div>
  );
}
