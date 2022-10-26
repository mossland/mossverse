import React from "react";
import { useUser } from "@platform/data-access";
import styled from "styled-components";
import { ExchangeCancelButton, CopyAddressButton } from "@platform/ui-web";
import { useExchangeUi } from "@platform/data-access";

export const McoToMmocFooter = () => {
  // const address = useUser((state) => state.address);
  const copyAddressCallback = useExchangeUi((state) => state.copyAddressCallback);

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
