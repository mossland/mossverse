import React, { useEffect } from "react";
import {
  DetailModal,
  MarketBalance,
  MarketNav,
  DetailMobileModal,
  MyTokensHeader,
  MarketHeader,
  MarketList,
} from "../../components";

import { gql, utils, store } from "../../stores";
import { PlatformLayout } from "@platform/ui-web";
import { useInterval } from "@shared/util-client";
import { GqlProvider } from "@shared/ui-web";
import { usePageInit } from "../../hooks";
import { env } from "../../env";

export function MarketPage() {
  usePageInit();
  const filter = store.mocMarket.use.filter();
  const marketAddr = env.klaytn.marketAddr;

  useEffect(() => {
    store.platform.listing.setState({ marketAddr });
  }, []);

  return (
    <PlatformLayout>
      {filter === "myTokens" ? <MyTokensHeader /> : <MarketHeader />}
      <MarketList />
      <div className="only-pc">
        <DetailModal />
      </div>
      <div className="only-mobile">
        <DetailMobileModal />
      </div>
    </PlatformLayout>
  );
}

export default MarketPage;
