import React from "react";
import styled from "styled-components";
import { DeliveryBuyBox, MarketReceipt, MarketDesc, SellBox, BuyBox, OnSaleBox } from ".";
import { Modal } from "./../../";
import { Market } from "@platform/ui-web";

export const DetailModal = () => {
  const service = Market.useMarket();

  if (service.checkIsHide()) return null;

  return (
    <Modal title={service.title ?? ""} type={"close"} onClose={service.onClose}>
      <Market.DetailBody>
        <Market.ProductImage src={service.image || ""} />
        <Desc>
          {/* 일반상품, p2p */}
          {service.checkIsBuy() && <BuyBox />}
          {/* 배송상품 */}
          {service.checkIsDeliveryBuy() && <DeliveryBuyBox />}
          {/* 팔고있는 상품  */}
          {service.checkIsOnSale() && <OnSaleBox />}
          {/* 팔 수 있는 상품 */}
          {service.checkIsSell() && <SellBox />}
          {/* 영수증 */}
          {service.checkIsReceipt() && <MarketReceipt />}
          <div className="horaizontal" />
          {<MarketDesc desc={service.desc} />}
        </Desc>
      </Market.DetailBody>
    </Modal>
  );
};

const Desc = styled.div`
  z-index: 10;
  padding: 20px;
  flex: 1;
  position: relative;
  overflow: auto;
  height: 370px;
  .horaizontal {
    border-top: 2px solid #000;
  }
`;
