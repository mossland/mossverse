import React from "react";
import styled from "styled-components";
import { ExchangeCancelButton, CopyAddressButton } from "@platform/ui-web";
import { gql, utils, store } from "../../../stores";

export const MocToMmocFooter = () => {
  const copyAddressCallback = store.platform.exchange.use.copyAddressCallback();
  return (
    <McoToMmocFooterContainer>
      <ExchangeCancelButton />
      <CopyAddressButton address={""} onClick={copyAddressCallback} type="defaultButton" />
    </McoToMmocFooterContainer>
  );
};

const McoToMmocFooterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 22px;
  gap: 10px;
`;
