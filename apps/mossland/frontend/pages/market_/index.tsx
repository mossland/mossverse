import React, { useEffect } from "react";
import { MarketNav, DetailMobileModal, MyTokensHeader, MarketHeader, MarketList } from "../../components";

import { gql, utils, store } from "../../stores";
import { PlatformLayout } from "@platform/ui-web";
import { useInterval } from "@shared/util-client";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env/env";

export function MarketPage_() {
  const marketAddr = env.klaytn.marketAddr;

  useEffect(() => {
    store.platform.listing.setState({ marketAddr });
  }, []);

  return (
    <PlatformLayout>
      <div className="header">
        <div className="Menu">
          <div className="Item">
            <div className="myBalance" />
          </div>
          <div>
            {self ? (
              <>
                <div className="MyAddress" />
                <div className="MyTokens" />
              </>
            ) : (
              <div className="Connect" />
            )}
          </div>
        </div>
      </div>
      <div className="list"></div>
    </PlatformLayout>
  );
}

export default MarketPage_;
