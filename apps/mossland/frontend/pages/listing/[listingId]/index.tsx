import React, { useEffect } from "react";
import { BackButton, MarketHeader, MenuBar } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { Raffle, Listing } from "@platform/ui-web";
import Router from "next/router";
import { LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();
  const listing = st.use.listing();
  const ownershipListInMoney = st.use.ownershipListInMoney();
  const mmoc = ownershipListInMoney !== "loading" ? gql.shared.Ownership.get(ownershipListInMoney, "MMOC") : null;
  useEffect(() => {
    st.do.viewListing(Router.query.listingId as string);
  }, []);
  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <BackButton />
      {listing === "loading" ? (
        <SkeletonList num={6} height={378} className="rounded-xl" />
      ) : (
        <Listing.View.InMarket
          listing={listing}
          slice={st.slice.listing}
          actions={
            <button
              className={`w-full mt-[20px] mb-[24px] p-[8px] text-center text-[22px] rounded-md border-[2px] border-solid border-[#000] bg-color-main "disabled:opacity-50 disabled:hover:opacity-0 disabled:cursor-default disabled:bg-[#ddd] disabled:opacity-50`}
              disabled={!mmoc || mmoc?.has(listing.priceTags[0].price) === false}
              onClick={async () => {
                await st.do.buyListing();
              }}
            >
              Buy
            </button>
          }
        />
      )}
    </div>
  );
}
