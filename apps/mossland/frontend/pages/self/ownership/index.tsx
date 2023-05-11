import React, { useEffect } from "react";
import { MarketHeader, MenuBar, MyTokensHeader } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { Raffle, Listing } from "@platform/ui-web";
import Router from "next/router";
import { LoadItems, Ownership } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();

  return (
    <div className="overflow-hidden">
      <MyTokensHeader />
      <LoadItems
        className="flex flex-wrap overflow-visible items-center px-[10px] py-[5px] md:px-[33px] md:py-[20px] overflow-y-hidden flex-wrapitems-start gap-[10px]"
        slice={st.slice.ownershipInItem}
        init={{
          query: { user: self.id, type: "item", status: "active" },
          invalidate: true,
        }}
        loading={<SkeletonList num={6} width={324} height={324} className="rounded-xl" />}
        renderItem={(ownership: gql.shared.LightOwnership, index: number) => (
          <Ownership.Item.InSelf
            onClick={async () => {
              await st.do.viewOwnershipInItem(ownership.id);
              Router.push(`ownership/${ownership.id}/newListing`);
            }}
            self={self}
            slice={st.slice.ownershipInItem}
            ownership={ownership}
          />
        )}
        renderEmpty={() => (
          <div className="flex items-center justify-center w-full h-full">
            <div>No Your Ownerships.</div>
          </div>
        )}
      />
    </div>
  );
}
