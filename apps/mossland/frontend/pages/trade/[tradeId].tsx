import React, { useEffect } from "react";
import { MarketHeader, MenuBar, BackButton } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { env } from "../../env/env";
import { Raffle, Trade } from "@platform/ui-web";
import Router from "next/router";
import { LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";
import { MintButton } from "@mossland/frontend/components/common";

export default function Page() {
  const self = st.use.self();
  const trade = st.use.trade();

  useEffect(() => {
    st.do.viewTrade(Router.query.tradeId as string);
  }, []);

  useEffect(() => {
    st.do.viewTrade(Router.query.tradeId as string);
  }, []);

  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <MenuBar />
      <BackButton />
      {trade === "loading" ? (
        <SkeletonList num={6} height={378} className="rounded-xl" />
      ) : (
        <Trade.View.InMarket
          slice={st.slice.trade}
          trade={trade}
          actions={
            <div className="flex">
              <MintButton
                className="mx-[100px]"
                onClick={async () => {
                  await st.do.buySkin();
                  Router.push("/trade");
                }}
              >
                구매하기
              </MintButton>
            </div>
          }
        />
      )}
    </div>
  );
}
