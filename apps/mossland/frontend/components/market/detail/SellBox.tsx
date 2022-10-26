import React, { useEffect } from "react";
import styled from "styled-components";
import { DatePicker } from "antd";
import moment from "moment";
import { listingStore, types, userStore } from "@platform/data-access";

type SellBoxProps = {
  myItem?: types.MyItem | null;
  listing?: types.Listing | null;
  onClickSell?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

export const SellBox = ({ myItem, listing, onClickSell }: SellBoxProps) => {
  const isSelling = listing ? true : false;
  const self = userStore.use.self();
  const priceTag = listingStore.use.priceTag();
  const closeAt = listingStore.use.closeAt();
  const minDate = new Date().getTime();
  const maxDate = minDate + 1000 * 60 * 60 * 24 * 90;

  useEffect(() => {
    !closeAt && listingStore.setState({ closeAt: new Date(maxDate) });
  }, []);
  return (
    <SellBoxContainer>
      <div className="form-box">
        <div className="label">Price</div>
        <div className="price-input">
          {self &&
            self.items
              .filter((item) => item.thing.name === "MMOC")
              .map((item, index) => (
                <div key={item.thing.id}>
                  <img src={item.thing.image.url} />
                  <input
                    readOnly={isSelling}
                    type="text"
                    id="price"
                    value={priceTag?.price ?? ""}
                    min={1}
                    max={myItem ? myItem.num : 1}
                    onChange={(e) => {
                      listingStore.setState({
                        priceTag: {
                          thing: item.thing,
                          price: parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0,
                          type: "thing",
                        },
                      });
                      // listingStore.setState({ {priceTags: parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0} });
                    }}
                  />
                </div>
              ))}
        </div>
      </div>
      <div className="form-box">
        <div className="label">Until</div>
        <DatePicker
          disabled={isSelling}
          disabledDate={(d) => !d || d.isAfter(moment(maxDate)) || d.isSameOrBefore(moment(minDate))}
          value={moment(closeAt) ?? moment(new Date())}
          onChange={(e) => {
            console.log(e);
            listingStore.setState({ closeAt: e ? e.toDate() : null });
          }}
        />
      </div>
      {isSelling ? (
        <div className="button button--cancel">Cancel</div>
      ) : (
        <div className={`button button--sell ${(!priceTag?.price || !closeAt) && "disabled"}`} onClick={onClickSell}>
          Sell
        </div>
      )}
    </SellBoxContainer>
  );
};

const SellBoxContainer = styled.div`
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
      cursor: not-allowed;
    }
  }

  .button--cancel {
    background-color: #f4f4f4;
  }
`;
