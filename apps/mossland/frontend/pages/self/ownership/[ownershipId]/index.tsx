import React, { useEffect } from "react";
import { BackButton, MarketHeader, MenuBar, MyTokensHeader } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { Raffle, Listing } from "@platform/ui-web";
import Router from "next/router";
import { LoadItems, Ownership } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();
  const ownershipInItem = st.use.ownershipInItem();

  useEffect(() => {
    st.do.viewOwnershipInItem(Router.query.ownershipId as string);

    //! filter가 없으면 All로 초기화
  }, []);

  return (
    <div className="overflow-hidden">
      <MyTokensHeader />
      <BackButton />
      {ownershipInItem === "loading" ? (
        <SkeletonList num={6} height={378} className="rounded-xl" />
      ) : (
        <Ownership.View.InSelf
          self={self}
          ownership={ownershipInItem}
          actions={
            <button
              className={`w-full mt-[20px] mb-[24px] p-[8px] text-center text-[22px] rounded-md border-[2px] border-solid border-[#000] bg-main-yellow  `}
              onClick={async () => {
                await st.do.cancelListingInSelf();
                Router.push("/self/listing");
              }}
            >
              Cancel Listing
            </button>
          }
        />
      )}
    </div>
  );
}
