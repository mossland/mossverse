import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { Market } from "@platform/ui-web";

import { utils, gql } from "@platform/data-access";

export const MarketList = () => {
  const service = Market.useMarket();
  const getOpacity = (listing: gql.Listing) => (listing.status === "soldout" ? 0.5 : 1);

  //! 개선 필요
  useEffect(() => {
    if (!service.listings) return;
    service.filterMyItems(service.listings);
  }, [service.listings]);

  useEffect(() => {
    service.initListing({ status: "active" });
  }, []);

  if (service.operation !== "idle") return null;

  if (!(service.sellingCount + service.myItems.length)) {
    return (
      <Market.EmptyList>
        {service.filter === "myTokens" ? <>You don&apos;t own any NFTs yet.</> : <>There are no tradable Products.</>}
      </Market.EmptyList>
    );
  }

  return (
    <Market.List>
      {service.listings
        .filter((listing) => service.getFilter(listing))
        .map((listing, index) => {
          return (
            <Market.ItemContainer
              key={index}
              onClick={() => service.onClickItem(listing)}
              opacity={getOpacity(listing)}
            >
              <Market.ItemImage src={utils.getListingImage(listing) || ""} />
              <Market.ItemInfo className={service.filter === "myTokens" ? "selling" : ""}>
                <Market.ItemInfoTitle>{utils.getListingName(listing)}</Market.ItemInfoTitle>
                <Market.ItemInfoDesc>
                  <Market.ItemInfoPrice>
                    {listing.priceTags?.[0]?.thing && (
                      <>
                        <img src={listing.priceTags?.[0].thing?.image.url} />
                        {listing.priceTags?.[0].price}
                      </>
                    )}
                    {listing.priceTags?.[0]?.token && (
                      <>
                        <img src={listing.priceTags?.[0].token?.image?.url} />
                        {listing.priceTags?.[0].price}
                      </>
                    )}
                  </Market.ItemInfoPrice>
                </Market.ItemInfoDesc>
              </Market.ItemInfo>
            </Market.ItemContainer>
          );
        })}
      {service.filter === "myTokens" &&
        service.myTokensFilter === "all" &&
        service.myItems.map((item, index) => (
          <Market.ItemContainer key={index} onClick={() => service.onClickMyItem(item)}>
            <Market.ItemImage src={utils.getMyItemImage(item) || ""} />

            <Market.ItemInfo>
              <Market.ItemInfoTitle>{utils.getMyItemName(item)}</Market.ItemInfoTitle>
              <Market.ItemInfoDesc>
                <div />
                <StyledMyTokenButton className="my-token-button button--sell">Sell</StyledMyTokenButton>
              </Market.ItemInfoDesc>
            </Market.ItemInfo>
          </Market.ItemContainer>
        ))}
    </Market.List>
  );
};

const StyledMyTokenButton = styled.div`
  font-size: 10px;
  padding: 3px 13px;
  border-radius: 4px;
  &.button--sell {
    background-color: #ffd749;
    margin-right: 5px;
  }
  &.button--cancel {
    background-color: #f4f4f4;
    border: 1px solid #555555;
  }
`;

const StyledItemInfoPrice = css`
  background-color: #ffd749;
`;
