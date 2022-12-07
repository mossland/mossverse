import React, { useEffect } from "react";
import styled from "styled-components";
import { gql, utils, store } from "../../stores";
import { MyAddress } from "../";
import { BiChevronLeft } from "react-icons/bi";
import { CheckIcon } from "@shared/ui-web";

export const MyTokensHeader = () => {
  const router = store.shared.ui.use.router();
  const self = store.platform.user.use.self();
  const myItems = store.platform.user.use.myItems();
  const listings = store.platform.listing.use.listingList();
  const myTokensFilter = store.mocMarket.use.myTokensFilter();
  const onClickBackButton = () => router.back();

  // const getFilter = (listing: gql.platform.LightListing) => {
  //   return self ? listing.user && listing.user.id === self.id : false;
  // };

  if (listings === "loading" || !self) return null;
  const onSaleCount = listings.length;
  const allCount = listings.length;

  console.log(listings.filter((listing) => listing.filterMyListing(self)).length);
  return (
    <StyledMyTokensHeader>
      <div className="header-top">
        <div className="header header-item">
          <button className="back-button" onClick={onClickBackButton}>
            <BiChevronLeft />
          </button>
          <h2>MyTokens</h2>
        </div>
        <div className="header-item">
          <MyAddress />
        </div>
      </div>
      <div className="buttons">
        <div
          className={`button ${myTokensFilter === "all" && "active"}`}
          onClick={() => store.mocMarket.set({ myTokensFilter: "all" })}
        >
          {myTokensFilter === "all" && <CheckIcon />}
          All({allCount})
        </div>
        <div
          className={`button selling-button ${myTokensFilter === "onSale" && "active"}`}
          onClick={() => store.mocMarket.set({ myTokensFilter: "onSale" })}
        >
          {myTokensFilter === "onSale" && <CheckIcon />}
          On Sale({onSaleCount})
        </div>
      </div>
    </StyledMyTokensHeader>
  );
};

const StyledMyTokensHeader = styled.div`
  padding: 20px 33px;
  height: 107px;
  .header-top {
    display: flex;
    justify-content: center;

    .header-item {
      width: 50%;
    }
    .address br {
      display: none;
    }
  }
  .header {
    display: flex;

    .back-button {
      margin-top: 6px;
      margin-right: 10px;
      svg {
        font-size: 30px;
      }
    }
    h2 {
      font-size: 26px;
    }
  }
  .buttons {
    display: flex;
    margin-top: 10px;
    .button {
      border: 1px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 6px;
      /* width: 102px; */
      /* height: 26px; */
      padding: 5px 14px;
      border-radius: 6px;
      border-color: gray;
      color: gray;
      font-weight: 700;
      font-size: 14px;
      line-height: 14px;
      cursor: pointer;
      svg {
        margin-right: 6px;
      }
      &.active {
        border-color: black;
        color: black;
      }

      &.selling-button {
        background-color: #ffe177;
      }

      :hover {
        opacity: 0.5;
      }
    }
  }
  height: 143px;
  border-bottom: 2px solid #000;
  @media screen and (max-width: 800px) {
    padding: 10px 33px;
    height: 100px;
    .header-top {
      gap: 13px;
      .address {
        margin-top: 10px;
      }
    }
    .buttons {
      margin-top: 0px;
    }
  }
`;
