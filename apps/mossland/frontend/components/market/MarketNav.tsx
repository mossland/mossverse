import { listingStore } from "@platform/data-access";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Market } from "@platform/ui-web";

export const MarketNav = () => {
  const filter = listingStore.use.filter();
  const onClickButton = (filter) => {
    listingStore.setState({ filter });
  };

  const checkIsActive = (id) => id === filter;

  const marketMenus = [
    { id: "all", label: "All" },
    { id: "mossMarket", label: "MossMarket" },
    { id: "p2p", label: "P2P" },
    // { id: "myTokens", label: "MyTokens" },
  ];

  return (
    <Market.NavContainer>
      {marketMenus.map((menu) => (
        <Market.NavItem key={menu.id} menu={menu} onClick={onClickButton} checkIsActive={checkIsActive} />
      ))}
    </Market.NavContainer>
  );
};
