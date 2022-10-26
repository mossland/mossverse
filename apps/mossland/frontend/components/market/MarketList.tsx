import { listingStore, types, userStore } from "@platform/data-access";
import { walletStore } from "@shared/data-access";
import React, { useEffect } from "react";
import styled from "styled-components";
import { MarketItem, MyItem } from "./";

export const MarketList = () => {
  const self = userStore.use.self();
  const myItems = userStore.use.myItems();
  const filterMyItems = userStore.use.filterMyItems();
  const initListing = listingStore.use.init();
  const filter = listingStore.use.filter();
  const myTokensFilter = listingStore.use.myTokensFilter();
  const listings = listingStore.use.listings();
  const operation = listingStore.use.operation();
  const onClickItem = (listing: types.Listing) => {
    listingStore.setState({ listing });
  };
  const onClickMyItem = (myItem: types.MyItem) => {
    userStore.setState({ myItem });
  };

  //! 개선 필요
  useEffect(() => {
    if (!listings) return;
    filterMyItems(listings);
  }, [listings]);

  useEffect(() => {
    initListing();
  }, []);

  const getFilter = (listing: types.Listing) => {
    if (filter === "all") return self ? listing.user.id !== self.id : true;
    if (filter === "mossMarket") return self ? listing.user.id !== self.id && !listing.token : !listing.token;
    if (filter === "p2p")
      return self ? listing.user.id !== self.id && !listing.thing && !listing.product : !listing.product;
    if (filter === "myTokens") return self ? listing.user && listing.user.id === self.id : false;
    return false;
  };

  const isSelling = filter !== "myTokens" || (filter === "myTokens" && myTokensFilter === "onSale");
  const sellingCount = (isSelling && listings.filter((listing) => getFilter(listing)).length) || 0;

  if (operation !== "idle") return null;

  if (!(sellingCount + myItems.length)) {
    return (
      <EmptyContainer>
        {filter === "myTokens" ? <>You don&apos;t own any NFTs yet.</> : <>There are no tradable Products.</>}
      </EmptyContainer>
    );
  }

  return (
    <MarketListContainer>
      {listings
        .filter((listing) => getFilter(listing))
        .map((cur, index) => (
          <MarketItem key={index} item={cur} onClick={() => onClickItem(cur)} />
        ))}
      {filter === "myTokens" &&
        myTokensFilter === "all" &&
        myItems.map((cur, index) => <MyItem key={index} item={cur} onClick={() => onClickMyItem(cur)} />)}
    </MarketListContainer>
  );
};

const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 143px);
  font-size: 22px;
`;

const MarketListContainer = styled.div`
  padding: 20px 33px;
  display: grid;
  height: calc(100vh - 143px);
  overflow-y: scroll;
  flex-wrap: wrap;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    height: calc(100vh - 100px);
  }
  align-items: flex-start;
  grid-gap: 10px;
`;
