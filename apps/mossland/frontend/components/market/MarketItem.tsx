import React, { useEffect } from "react";
import styled from "styled-components";
import { gql, utils, store } from "../../stores";

type MarketItemProps = {
  item: gql.platform.Listing;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};
export const MarketItem = ({ item, onClick }: MarketItemProps) => {
  const filter = store.platform.listing.use.filter();

  return (
    <MarketItemContainer onClick={onClick} style={{ opacity: item.status === "soldout" ? 0.5 : 1 }}>
      <div className="image-wrapper">
        {utils.platform.getListingImage(item) ? (
          <img src={utils.platform.getListingImage(item) ?? ""} />
        ) : (
          <div className="empty-image">no image</div>
        )}
      </div>
      <div className={`info ${filter === "myTokens" && "selling"}`}>
        {/* <MarketLabel item={item} /> */}
        <div className="title">{utils.platform.getListingName(item)}</div>
        <div className="price-box">
          <div className="price">
            <img src={item.priceTags[0].thing?.image.url as string} />
            {item.priceTags?.[0].price}
          </div>

          {/* mytokens */}
          {filter === "myTokens" && (
            <div className="price-box">
              <div className="price"></div>
              {/* <div className="my-token-button button--sell">Sell</div> */}
              {/* <div className="my-token-button button--cancel">Cancel</div> */}
            </div>
          )}
        </div>
      </div>
    </MarketItemContainer>
  );
};

const MarketItemContainer = styled.div`
  cursor: pointer;
  border-radius: 6px;
  box-shadow: 0px 0px 8px 0px #00000033;
  /* width: 20%; */
  margin-top: 5px;
  /* height: 300px; */
  .image-wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-width: 1px;
    /* background-color: red; */
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      margin-right: 2px;
      height: 100%;
      border-radius: 6px 6px 0 0;
    }
  }
  .info {
    padding: 3px;
    height: 44px;
    color: #282828;
    position: relative;
    &.selling {
      background-color: #ffd749;
    }
    .title {
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      /* margin-bottom: 2px; */
    }
    .price-box {
      display: flex;
      margin-left: 10px;
      justify-content: space-between;
      align-items: center;

      .price {
        font-size: 14px;
        font-weight: bold;

        img {
          width: 12px;
          margin-right: 6px;
        }
      }
      .my-token-button {
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
      }
    }
  }
`;
