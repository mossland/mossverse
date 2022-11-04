import React from "react";
import styled from "styled-components";
import { DeliveryForm } from "./";
import { Market } from "@platform/ui-web";

export const DeliveryBuyBox = () => {
  const service = Market.useMarket();
  const price = service?.listing?.priceTags?.[0].price ?? 0;
  const limit = service?.listing?.limit ?? 0;

  if (!service.listing) return null;

  return (
    <DeliveryBuyBoxContainer>
      <div className="stage-2-box">
        <div className="price-group">
          <div className="label">Price</div>
          <div className="price">
            {service.listing.priceTags
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
        <DeliveryForm.Number label="Amount" min={1} max={limit} value={service.num ?? 0} onChange={service.updateNum} />
      </div>
      <DeliveryForm.Text
        label="Name"
        value={service.name ?? ""}
        placeholder={"받으실 분의 성함을 적어주세요."}
        onChange={service.updateName}
      />
      <DeliveryForm.Text
        label="Address"
        value={service.address ?? ""}
        placeholder={"살고있는 거주지를 적어주세요"}
        onChange={service.updateAddress}
      />
      <DeliveryForm.Text
        label="Phone"
        value={service.phone ?? ""}
        placeholder={"010-xxxx-xxxx"}
        onChange={service.updatePhone}
      />
      <div className="stage-2-box">
        <div className="price-group">
          <div className="label">Total Price</div>
          <div className="price">
            {service.listing.priceTags
              .filter((tag) => tag.thing && tag.thing.type === "root")
              .map((tag, index) => {
                if (!tag.thing) return;
                return (
                  <div key={tag.thing.id}>
                    <img src={tag.thing.image.url} />
                    {price * (isNaN(service.num) ? 1 : service.num)}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="button" onClick={async () => await service.onDeliveryBuy()}>
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
