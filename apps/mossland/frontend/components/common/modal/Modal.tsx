import {
  listingStore,
  userStore,
  receiptStore,
  shipInfoStore,
  types,
  utils,
  createListing,
} from "@platform/data-access";
import { keyringStore, walletStore } from "@shared/data-access";
import { WindowHeader } from "@shared/ui-web";
import { kaikas, metamask } from "@shared/util-client";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { DeliveryBuyBox, MarketDesc, SellBox, BuyBox, OnSaleBox, MarketReceipt } from "../..";

export type ModalType = {
  title: string;
  onClose: () => void;
  type: "reduce" | "close";
  children: ReactNode;
};

export const Modal = ({ title, type = "close", onClose, children }: ModalType) => {
  return (
    <>
      <ModalBackground />
      <MarketDeliveryContainer>
        <WindowHeader title={title} close={onClose} type={type} />
        {children}
      </MarketDeliveryContainer>
    </>
  );
};

const ModalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  z-index: 0.9;
`;
const MarketDeliveryContainer = styled.div`
  /* padding: 23px; */
  position: absolute;
  width: 714px;
  height: 412px;
  /* background-color: red; */
  top: 50%;
  left: 50%;
  background: #ffffff;
  border: 3px solid #000000;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  overflow: hidden;
`;
