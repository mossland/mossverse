import React from "react";
import styled from "styled-components";
import { listingStore, receiptStore, shipInfoStore, userStore } from "@platform/data-access";
import { keyringStore, walletStore } from "@shared/data-access";
import { DeliveryForm } from "./";

// import { Field } from "@shared/ui-web";

export const DeliveryBuyBox = () => {
  const listing = listingStore.use.listing();
  const price = listing?.priceTags?.[0].price ?? 0;
  const limit = listing?.limit ?? 0;
  const num = listingStore.use.num();
  const name = shipInfoStore.use.name();
  const phone = shipInfoStore.use.phone();
  const address = shipInfoStore.use.address();
  const sign = keyringStore.use.sign();
  const buyItem = listingStore.use.buyItem();
  const purifyShipInfo = shipInfoStore.use.purify();
  const wallet = walletStore.use.wallet();
  const shipInfo = shipInfoStore.use.shipInfo();
  const initUser = userStore.use.init();
  const initListing = listingStore.use.init();
  if (!listing) return <></>;
  const onBuy = async () => {
    if (!wallet) return alert("로그인 후  다시 시도해주세요.");
    listingStore.setState({ priceTag: listing.priceTags[0], num: 1 });
    await sign(wallet.network.provider);
    const shipInfoInput = purifyShipInfo();
    if (!shipInfoInput) return;
    const receipt = await buyItem(shipInfoInput);
    await initUser();
    await initListing();
    listingStore.setState({ listing: null });
    receiptStore.setState({ receipt });
  };
  return (
    <DeliveryBuyBoxContainer>
      <div className="stage-2-box">
        <div className="price-group">
          <div className="label">Price</div>
          <div className="price">
            {listing.priceTags
              .filter((tag) => tag.thing && tag.thing.type === "root")
              .map((tag, index) => {
                if (!tag.thing) return;
                return (
                  <div key={tag.thing.id}>
                    <img src={tag.thing.image.url} />
                    {price}
                  </div>
                );
              })}
          </div>
        </div>
        <DeliveryForm.Number
          label="Amount"
          min={1}
          max={limit}
          value={num ?? 0}
          onChange={(num: number) => {
            listingStore.setState({ num });
          }}
        />
      </div>
      <DeliveryForm.Text
        label="Name"
        value={name ?? ""}
        placeholder={"받으실 분의 성함을 적어주세요."}
        onChange={(name) => shipInfoStore.setState({ name })}
      />
      <DeliveryForm.Text
        label="Address"
        value={address ?? ""}
        placeholder={"살고있는 거주지를 적어주세요"}
        onChange={(address) => shipInfoStore.setState({ address })}
      />
      <DeliveryForm.Text
        label="Phone"
        value={phone ?? ""}
        placeholder={"010-xxxx-xxxx"}
        onChange={(phone) => shipInfoStore.setState({ phone })}
      />
      <div className="stage-2-box">
        <div className="price-group">
          <div className="label">Total Price</div>
          <div className="price">
            {listing.priceTags
              .filter((tag) => tag.thing && tag.thing.type === "root")
              .map((tag, index) => {
                if (!tag.thing) return;
                return (
                  <div key={tag.thing.id}>
                    <img src={tag.thing.image.url} />
                    {price * (isNaN(num) ? 1 : num)}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="button" onClick={async () => await onBuy()}>
          Buy
        </div>
      </div>
    </DeliveryBuyBoxContainer>
  );
};

const DeliveryBuyBoxContainer = styled.div`
  padding: 24px 0;

  .stage-2-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price-group {
      width: 50%;
      margin-bottom: 13px;
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
    }
    .form-box {
      width: 50%;
      input {
        width: 80px;
      }
    }
  }

  .button {
    background-color: #66fef0;
    width: 50%;
    font-size: 22px;
    text-align: center;
    padding: 8px;
    border-radius: 8px;
    border: 2px solid #000;
    cursor: pointer;
  }
  /* 분리 */
  .form-box {
    input {
      font-size: 20px;
      border: 1px solid #9a9a9a;
      border-radius: 4px;
      width: 100%;
      padding: 1px 4px;
    }
    margin-bottom: 12px;
  }
`;
