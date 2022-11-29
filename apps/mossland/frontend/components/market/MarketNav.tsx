import React, { useEffect } from "react";
import styled from "styled-components";
import { Market } from "@platform/ui-web";
import { gql, utils, store } from "../../stores";
import { Navigator } from "@shared/ui-web";

export const MarketNav = () => {
  const filter = store.mocMarket.use.filter();
  const self = store.platform.user.use.self();

  const onClickButton = (filter) => {
    if (!self) return;
    store.mocMarket.set({ filter });
    if (filter === "all") store.mocMarket.do.initListing({ query: { status: "active" } });
    if (filter === "mossMarket")
      store.mocMarket.do.initListing({
        query: { status: "active", user: { $ne: self.id }, token: { $exists: true } },
      });
    if (filter === "p2p")
      store.mocMarket.do.initListing({
        query: { status: "active", user: { $ne: self.id }, thing: { $exists: true } },
      });
  };

  const marketMenus = [
    { id: "all", label: "All" },
    { id: "mossMarket", label: "MossMarket" },
    { id: "p2p", label: "P2P" },
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
