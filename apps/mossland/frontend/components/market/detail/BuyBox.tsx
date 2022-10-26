import React from "react";
import styled from "styled-components";
import { listingStore, receiptStore, userStore, utils } from "@platform/data-access";
import { keyringStore, walletStore } from "@shared/data-access";
import { toast } from "react-toastify";

export const BuyBox = () => {
  const self = userStore.use.self();
  const item = listingStore.use.listing();
  if (!item) return <></>;
  const wallet = walletStore.use.wallet();
  const buyItem = listingStore.use.buyItem();
  const sign = keyringStore.use.sign();
  const initUser = userStore.use.init();
  const initListing = listingStore.use.init();
  const buyable = utils.isBuyable(item, self);
  const onBuy = async () => {
    if (!self || !item || !wallet! || !buyable) return;

    listingStore.setState({ priceTag: item.priceTags[0], num: 1 });
    await sign(wallet.network.provider);
    const receipt = await buyItem();
    await initUser();
    await initListing();
    listingStore.setState({ listing: null });
    receiptStore.setState({ receipt });
  };
  return (
    <BuyBoxContainer>
      {item.status !== "soldout" ? (
        <>
          <div>
            <div className="label">Price</div>
            <div className="price">
              <img src={item.priceTags?.[0].thing?.image.url ?? ""} />
              {item.priceTags?.[0].price}
            </div>
          </div>
          <div
            className={`buy-button ${(!self || !item || !wallet || !buyable) && "disabled"}`}
            onClick={async () => await onBuy()}
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
