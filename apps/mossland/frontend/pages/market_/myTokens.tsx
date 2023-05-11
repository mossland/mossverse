import React, { useEffect } from "react";
import {
  DetailModal,
  MarketNav,
  DetailMobileModal,
  MyTokensHeader,
  MarketHeader,
  MarketList,
  MyItemList,
} from "../../components";

import { gql, utils, store } from "../../stores";
import { PlatformLayout } from "@platform/ui-web";
import { useInterval } from "@shared/util-client";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env";

export function MarketPage() {
  const filter = store.mocMarket.use.filter();
  const marketAddr = env.klaytn.marketAddr;

  useEffect(() => {
    store.platform.listing.setState({ marketAddr });
  }, []);

  return (
    <PlatformLayout>
      <MyTokensHeader />
      <MyItemList />
      <div className="only-pc">
        <DetailModal />
      </div>
      {/* <div className="only-mobile">
        <DetailMobileModal />
      </div> */}
    </PlatformLayout>
  );
}

export default MarketPage;
