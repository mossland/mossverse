import React, { useEffect } from "react";
import { MarketNav, DetailMobileModal, MyTokensHeader, MarketHeader, MarketList } from "../../components";

import { gql, utils, store } from "../../stores";
import { PlatformLayout } from "@platform/ui-web";
import { useInterval } from "@shared/util-client";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env/env";

export function MarketPage() {
  const marketAddr = env.klaytn.marketAddr;

  useEffect(() => {
    store.platform.listing.setState({ marketAddr });
  }, []);

  return (
    <PlatformLayout>
      <MarketHeader />
      <MarketList />
      <div className="only-pc">
        {/*buyModal <DetailModal /> */}
        {/*SellModal <DetailModal /> */}
        {/*DeliveryBuyModal <DetailModal /> */}
        {/* <DetailModal /> */}
      </div>
      {/* <div className="only-mobile">
        <DetailMobileModal />
      </div> */}
    </PlatformLayout>
  );
}

export default MarketPage;
