import React, { useEffect } from "react";
import { Common, MarketHeader, MenuBar, BackButton } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { Raffle } from "@platform/ui-web";
import Router from "next/router";
import { DataViewModal, LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();
  const raffle = st.use.raffle();
  useEffect(() => {
    // st.do.newRaffle({});
  }, []);

  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <BackButton />
      <div>
        {raffle === "loading" ? (
          <SkeletonList num={6} height={378} className="rounded-xl" />
        ) : (
          <Raffle.View.InSelf self={self} slice={st.slice.raffle} raffle={raffle} />
        )}
      </div>
    </div>
  );
}
