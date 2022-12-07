import React from "react";
import styled from "styled-components";
import { Market } from "@platform/ui-web";
import { gql } from "./../../../stores";

interface BuyBoxProps {
  listingSlice: gql.platform.ListingSlice;
}
export const BuyBox = ({ listingSlice }: BuyBoxProps) => {
  // const service = Market.useMarket();
  const listing = listingSlice.use.listing();

  if (!listing || listing === "loading" || !listing.thing) return null;
  return (
    <BuyBoxContainer>
      {listing.status !== "soldout" ? (
        <>
          <div>
            <div className="label">Price</div>
            <div className="price">
              <img src={listing.priceTags?.[0].thing?.image.url ?? ""} />
              {listing.priceTags?.[0].price}
            </div>
          </div>
          <div
            // className={`buy-button ${service.checkIsBuyDisabled() && "disabled"}`}
            className={`buy-button`}
            onClick={async () => await service.onBuy()}
          >
            Buy
          </div>
        </>
      ) : (
        <div className="soldout-text">Sold out!</div>
      )}
    </BuyBoxContainer>
  );
};

const BuyBoxContainer = styled.div`
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  .label {
    font-size: 16px;
    color: #555555;
  }
  .price {
    img {
      width: 20px;
      margin-right: 6px;
    }
    font-size: 22px;
  }
  .buy-button {
    background-color: #66fef0;
    width: 50%;
    font-size: 22px;
    text-align: center;
    padding: 8px;
    border-radius: 8px;
    border: 2px solid #000;
    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
      /* background-color: gray; */
      /* border-color: #ddd; */
      border: 2px solid #555555;

      opacity: 0.5;
      color: #aaa;
    }
  }
  .soldout-text {
    font-size: 28px;
    color: #555555;
  }
`;
