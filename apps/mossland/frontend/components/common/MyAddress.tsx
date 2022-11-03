import React from "react";
import styled from "styled-components";
import { gql, utils, store } from "../../stores";

export const MyAddress = () => {
  const wallet = store.shared.wallet.use.wallet();
  if (!wallet?.address) return null;
  return (
    <StyledMyAddress>
      <div className="address">
        <span>Address:</span>
        <br />
        {wallet?.address}
      </div>
    </StyledMyAddress>
  );
};

const StyledMyAddress = styled.div`
  .address {
    background-color: #e8e8e8;
    padding: 9px 16px;
    border-radius: 4px;
    overflow: hidden; // 을 사용해 영역을 감출 것
    text-overflow: ellipsis; // 로 ... 을 만들기
    white-space: nowrap; // 아래줄로 내려가는 것을 막기위해
    @media screen and (max-width: 800px) {
      padding: 3px 10px;
      min-height: 24px;
      font-size: 14px;
    }
  }
`;
