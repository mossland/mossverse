import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { Market, ListingItem } from "@platform/ui-web";
import { utils, gql } from "@platform/data-access";
import { store } from "../../stores";
import { MarketItem } from "./MarketItem";
import { MyItem } from "./MyItem";
export const MyItemList = () => {
  const self = store.platform.user.use.self();
  const myItems = store.platform.user.use.myItems();
  const listings = store.platform.listing.use.listingList();
  const myTokensFilter = store.platform.listing.use.myTokensFilter();
  const router = store.shared.ui.use.router();
  const filter = (router.query.filter as "All" | "OnSale") ?? "All";

  useEffect(() => {
    // if (listings === "loading" || !listings || !self || !self.filterMyItems) return;
    // console.log("use effect my item list");
    // const myItems = self.filterMyItems(self, listings);
    // store.platform.user.set({ myItems });
  }, [self, listings]);

  useEffect(() => {
    store.platform.listing.do.initListing({ query: { status: "active", user: self?.id } });
  }, [self]);

  useEffect(() => {
    router.push({ query: { filter: "All" } });
  }, []);

  if (listings === "loading") return <>loading...</>;
  if (!self) return;

  return (
    <div
      className={
        "grid px-[33px] py-[20px] h-[calc(100vh-143px)] overflow-y-scroll flex-wrap grid-cols-[1fr_1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr_1fr] items-start gap-[10px]"
      }
    >
      {/* {listings
        .filter((listing) => listing.filterMyListing(self))
        .map((listing, index) => (
          <MarketItem key={index} item={listing} onClick={() => store.platform.listing.do.openListing(item)} />
        ))} */}
      {myItems.map((item, index) => (
        <MyItem key={index} item={item} onClick={() => store.platform.user.do.openMyItem(item)} />
      ))}
    </div>
  );
};
