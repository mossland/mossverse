import React from "react";
import styled from "styled-components";
import { BuyBox, SellBox, DeliveryBuyBox, MarketDetailHeader, MarketDesc, OnSaleBox, MarketReceipt } from ".";
import { Market } from "@platform/ui-web";

export const DetailMobileModal = () => {
  const service = Market.useMarket();

  if (service.checkIsHide()) return null;

  return (
    <DetailMobileModalContainer>
      <MarketDetailHeader title={service.title ?? ""} type={""} onClick={service.onClose} />
      <div className="body">
        <Market.ProductImage src={service.image || ""} />

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
      </div>
    </DetailMobileModalContainer>
  );
};

const DetailMobileModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  background: #ffffff;
  .body {
    padding: 23px;
    .horaizontal {
      border-top: 2px solid #000;
    }
  }
`;
