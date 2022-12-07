import React from "react";
import styled from "styled-components";
import { DeliveryForm } from "./";
import { Market } from "@platform/ui-web";
import { gql, store } from "./../../../stores";

interface BuyBoxProps {
  listingSlice: gql.platform.ListingSlice;
}

export const DeliveryBuyBox = ({ listingSlice }: BuyBoxProps) => {
  const wallet = store.shared.wallet.use.wallet();
  const listing = listingSlice.use.listing();
  const name = store.platform.shipInfo.use.name();
  const address = store.platform.shipInfo.use.address();
  const phone = store.platform.shipInfo.use.phone();
  const num = store.platform.listing.use.num();
  if (!listing || listing === "loading" || !listing.product) return null;

  const onDeliveryBuy = async () => {
    //? 어떻게 해야하지
    // if (!wallet) return alert("로그인 후  다시 시도해주세요.");
    // if (!listing) return;
    // store.platform.listing.setState({ priceTag: (listing as any).priceTags[0], num: 1 });
    // await sign((wallet as any).network.provider);
    // const shipInfoInput = store.platform.purifyShipInfo();
    // if (!shipInfoInput) return;
    // const receipt: any = await buyItem(shipInfoInput);
    // await initUser();
    // await initListing();
    // store.listing.setState({ listing: null });
    // store.receipt.setState({ receipt });
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
                    {tag.price}
                  </div>
                );
              })}
          </div>
        </div>
        <DeliveryForm.Number label="Amount" min={1} max={limit} value={service.num ?? 0} onChange={service.updateNum} />
      </div>
      <DeliveryForm.Text
        label="Name"
        value={name ?? ""}
        placeholder={"받으실 분의 성함을 적어주세요."}
        onChange={(name) => store.platform.shipInfo.set({ name })}
      />
      <DeliveryForm.Text
        label="Address"
        value={address ?? ""}
        placeholder={"살고있는 거주지를 적어주세요"}
        onChange={(address) => store.platform.shipInfo.set({ address })}
      />
      <DeliveryForm.Text
        label="Phone"
        value={phone ?? ""}
        placeholder={"010-xxxx-xxxx"}
        onChange={(phone) => store.platform.shipInfo.set({ phone })}
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
                    {tag.price * (isNaN(num) ? 1 : num)}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="button" onClick={async () => await onDeliveryBuy()}>
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
