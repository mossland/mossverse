import React, { useEffect } from "react";
import styled from "styled-components";
import { Market } from "@platform/ui-web";
import { gql, utils, store } from "../../stores";
import { Navigator } from "@shared/ui-web";

export const MarketNav = () => {
  const router = store.shared.ui.use.router();
  // const filter = store.mocMarket.use.filter();
  const self = store.platform.user.use.self();
  const filter = router.query.filter as "All" | "MossMarket" | "P2P" | "MyTokens";

  const onClickButton = (filter) => {
    if (!self) return;
    router.replace({ query: { filter } });

    // store.mocMarket.set({ filter });
    // if (filter === "All") {
    //   store.platform.listing.do.setQueryOfListing({ status: "active" });
    //   router.replace({ query: { filter: "All" } });
    // }
    // if (filter === "MossMarket") {
    //   store.platform.listing.do.setQueryOfListing({
    //     status: "active",
    //     user: { $ne: self.id },
    //     token: { $exists: true },
    //   });
    //   router.replace({ query: { filter: "MossMarket" } });
    // }
    // if (filter === "P2P") {
    //   store.platform.listing.do.setQueryOfListing({
    //     status: "active",
    //     user: { $ne: self.id },
    //     thing: { $exists: true },
    //   });
    //   router.replace({ query: { filter: "P2P" } });
    // }
  };

  useEffect(() => {
    if (!self) return;

    if (filter === "All") store.platform.listing.do.setQueryOfListing({ status: "active" });
    if (filter === "MossMarket")
      store.platform.listing.do.setQueryOfListing({
        status: "active",
        user: { $ne: self.id },
        token: { $exists: true },
      });

    if (filter === "P2P")
      store.platform.listing.do.setQueryOfListing({
        status: "active",
        user: { $ne: self.id },
        thing: { $exists: true },
      });
  }, [filter]);

  const marketMenus = [
    { id: "All", label: "All" },
    { id: "MossMarket", label: "MossMarket" },
    { id: "P2P", label: "P2P" },
  ];

  return (
    <Navigator>
      {marketMenus.map((menu) => (
        <Navigator.Item
          key={menu.id}
          className={`${menu.id === filter && "text-[#000]"}`}
          onClick={() => onClickButton(menu.id)}
        >
          {menu.label}
        </Navigator.Item>
      ))}
    </Navigator>
  );
};
