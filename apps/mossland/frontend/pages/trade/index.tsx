import React, { useEffect } from "react";
import { MarketHeader, MenuBar } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { env } from "../../env/env";
import { Raffle, Trade } from "@platform/ui-web";
import Router from "next/router";
import { LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();

  // useEffect(() => {}, []);

  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <MenuBar />
      <LoadItems
        className="flex flex-row flex-wrap p-2"
        slice={st.slice.trade}
        init={{
          query: {
            status: "active",
            policy: { $in: "reversible" },
            ...(self.id?.length ? { user: { $ne: self.id } } : {}),
          },
        }}
        loading={<SkeletonList num={6} width={324} height={324} className="rounded-xl" />}
        renderItem={(trade: gql.platform.LightTrade, index: number) => (
          <div className="w-1/2 p-2 md:w-1/4">
            <Trade.Item.InMarket
              trade={trade}
              slice={st.slice.trade}
              onClick={() => Router.push(`/trade/${trade.id}`)}
            />
          </div>
        )}
        renderEmpty={() => (
          <div className="flex items-center justify-center w-full h-full">
            <div>No Trades</div>
          </div>
        )}
      />
    </div>
  );
}
