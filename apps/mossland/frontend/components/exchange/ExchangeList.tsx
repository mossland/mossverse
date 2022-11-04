import React, { useEffect } from "react";
import styled from "styled-components";
import { ExchangeItem } from "@platform/ui-web";
import { gql, utils, store } from "../../stores";

export const ExchangeList = () => {
  const self = store.platform.user.use.self();
  const initReceipt = store.platform.receipt.use.init();
  const receipts = store.platform.receipt.use.receipts();

  useEffect(() => {
    if (!self) return;
    initReceipt(self.id);
  }, [self]);

  return (
    <ExchangeListContainer>
      {receipts.length ? (
        [...receipts].reverse().map((receipt) => <ExchangeItem key={receipt.id} receipt={receipt} />)
      ) : (
        <div className="empty">There is no exchage history</div>
      )}
    </ExchangeListContainer>
  );
};

const ExchangeListContainer = styled.div`
  /* border-top: 2px solid ${(props) => props.theme.color.black}; */
  padding: 10px 0;
  margin-right: -2px;
  border-right: 2px solid ${(props) => props.theme.color.black};
  .empty {
    height: 100%;
    width: 100%;
    font-size: 22px;

    display: flex;
    align-items: center;
    justify-content: center;

    /* text-align:center; */
  }
`;
