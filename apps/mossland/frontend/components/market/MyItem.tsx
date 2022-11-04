import React, { useEffect } from "react";
import styled from "styled-components";
import { gql, utils, store } from "../../stores";

type MyItemProps = {
  item: gql.platform.MyItem;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};
export const MyItem = ({ item, onClick }: MyItemProps) => {
  const self = store.platform.user.use.self();
  const filter = store.platform.listing.use.filter();

  const listingList = store.platform.listing.use.listingList();
  const isListed = !!listingList.find((listing) => {
    return item?.token?.id && listing?.token?.id === item?.token?.id;
  });

  if (!self) return <></>;

  return (
    <MyItemContainer onClick={onClick}>
      <div className="image-wrapper">
        {utils.platform.getMyItemImage(item) ? (
          <img src={utils.platform.getMyItemImage(item) ?? ""} />
        ) : (
          <div className="empty-image">no image</div>
        )}
      </div>
      <div className="info">
        <div className="title">{utils.platform.getMyItemName(item)}</div>
        {/* mytokens */}
        {filter === "myTokens" && (
          <div className="price-box">
            <div className="price"></div>
            <div className="my-token-button button--sell">Sell</div>
          </div>
        )}
      </div>
    </MyItemContainer>
  );
};

const MyItemContainer = styled.div`
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
    padding: 5px;
    color: #282828;
    position: relative;
    .title {
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      margin-bottom: 2px;
    }
    .price-box {
      display: flex;
      margin-left: 10px;
      justify-content: space-between;
      align-items: center;

      .price {
        font-size: 16px;
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
