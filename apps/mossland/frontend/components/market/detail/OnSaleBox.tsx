import React, { useEffect } from "react";
import styled from "styled-components";
import { DatePicker } from "antd";
import moment from "moment";
import { gql, utils, store } from "../../../stores";
import { Market } from "@platform/ui-web";
interface OnSaleProps {
  listingSlice: gql.platform.ListingSlice;
}
export const OnSaleBox = ({ listingSlice }: OnSaleProps) => {
  // const service = Market.useMarket();
  const self = store.platform.user.use.self();
  const listing = listingSlice.use.listing();

  if (!listing || listing === "loading" || listing.user !== self) return null;
  return (
    <OnSaleBoxContainer>
      <div className="form-box">
        <div className="label">Price</div>
        <div className="price-input">
          {/* <img src="/images/mm_coin.png" /> */}
          {listing.priceTags
            .filter((tag) => tag.thing && tag.thing.type === "root")
            .map((tag, index) => {
              if (!tag.thing) return;
              return (
                <div key={tag.thing.id}>
                  <img src={tag.thing.image.url} />
                  <input readOnly type="text" id="price" value={tag.price} />
                </div>
              );
            })}
        </div>
      </div>
      <div className="form-box">
        <div className="label">Until</div>
        <DatePicker disabled value={moment(listing.closeAt)} />
      </div>
      <div onClick={() => listingSlice.do.resetListing()} className="button button--cancel">
        Cancel
      </div>
    </OnSaleBoxContainer>
  );
};

const OnSaleBoxContainer = styled.div`
  .form-box {
    margin-bottom: 12px;
    input {
      font-size: 20px;
      border: 1px solid #9a9a9a;
      border-radius: 4px;
      width: 100%;
      padding: 1px 4px;

      &:read-only {
        border: 0px;
        pointer-events: none;
      }
    }
    .ant-picker {
      width: 100%;
      border: 1px solid #9a9a9a;
      border-radius: 4px;
      padding: 2px 6px 2px;
      input {
        border: 1px solid white;
      }
    }
    .ant-picker-disabled {
      border-width: 0;
      background-color: white;

      .ant-picker-suffix {
        display: none;
      }
      input[disabled] {
        color: #000;
      }
    }
  }
  .price-input {
    position: relative;
    img {
      position: absolute;
      top: 50%;
      left: 6px;
      transform: translate(0, -50%);
      width: 20px;
    }
    input {
      padding-left: 34px;
    }
  }
  .button {
    margin-top: 20px;
    margin-bottom: 24px;
    padding: 8px;
    text-align: center;
    font-size: 22px;
    border-radius: 8px;
    border: 2px solid #000;
    cursor: pointer;
  }
  .button--sell {
    background-color: #ffd749;

    &.disabled {
      opacity: 0.5;
    }
  }

  .button--cancel {
    background-color: #f4f4f4;
  }
`;
