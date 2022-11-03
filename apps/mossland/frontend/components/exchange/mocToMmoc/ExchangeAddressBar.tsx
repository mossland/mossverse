import React from "react";
import styled from "styled-components";

import { CopyAddressButton } from "@platform/ui-web";
import { gql, utils, store } from "../../../stores";
import { QRCodeSVG } from "qrcode.react";

type ExchangeAddressBarType = {
  address: string;
};

export const ExchangeAddressBar = ({ address }: ExchangeAddressBarType) => {
  const copyAddressCallback = store.platform.exchange.use.copyAddressCallback();
  return (
    <ExchangeAddressBarContainer>
      <h4>Deposit Address</h4>
      <p>Send only MOC to this deposit address.</p>
      <div className="qr-wrapper">
        <QRCodeSVG value={address} />
      </div>
      <div className="copy-box">
        <div className="address">
          <div>Address:</div>
          {address}
        </div>
        <CopyAddressButton address={address} onClick={copyAddressCallback} type="icon" />
      </div>
    </ExchangeAddressBarContainer>
  );
};

const ExchangeAddressBarContainer = styled.div`
  padding: 32px;
  border-bottom: 2px solid ${(props) => props.theme.color.black};
  @media screen and (max-width: 800px) {
    border-bottom-width: 0px;
  }

  h4 {
    font-size: 18px;
    color: ${(props) => props.theme.color.black};
    margin-bottom: 5px;
    line-height: 1em;
    @media screen and (max-width: 800px) {
      display: none;
    }
  }
  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    color: ${(props) => props.theme.color.grayDD};
    margin-bottom: 8px;
    @media screen and (max-width: 800px) {
      text-align: center;
    }
  }
  .qr-wrapper {
    svg {
      margin: 42px auto;
    }
  }
  .copy-box {
    border: 2px solid ${(props) => props.theme.color.black};
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    .address {
      padding: 10px 14px;
      flex-grow: 1;
      border-right: 2px solid ${(props) => props.theme.color.black};
    }
  }
`;
