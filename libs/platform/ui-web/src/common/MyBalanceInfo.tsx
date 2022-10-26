import React from "react";
import { Utils } from "@shared/util";
import styled from "styled-components";

type MyBalanceInfoProps = {
  address: string;
  balanceInMOC: number;
  balanceInMMOC: number;
  isHideMoc?: boolean;
  isHideMmoc?: boolean;
};

export const MyBalanceInfo = ({ address, balanceInMOC, balanceInMMOC, isHideMoc, isHideMmoc }: MyBalanceInfoProps) => {
  return (
    <MyBalanceInfoContainer>
      <div className="address">
        <div className="label">ADDRESS:</div>
        {address}
      </div>

      <div className="balance">
        {!isHideMmoc && (
          <div className="item">
            <div className="label">
              <img src="/images/mm_coin.png" />
              <span>MMOC</span>
            </div>
            <div className="value">
              {Utils.numberWithCommas(balanceInMMOC)}
              <span className="unit">MMOC</span>
            </div>
          </div>
        )}

        {!isHideMoc && (
          <div className="item">
            <div className="label">
              <img src="/images/m_coin.png" />
              <span>MOC</span>
            </div>
            <div className="value">
              {Utils.numberWithCommas(balanceInMOC)}
              <span className="unit">MOC</span>
            </div>
          </div>
        )}
      </div>
    </MyBalanceInfoContainer>
  );
};

const MyBalanceInfoContainer = styled.div`
  .address {
    background-color: ${(props) => props.theme.color.gray};
    color: ${(props) => props.theme.color.grayDD};
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    padding: 14px 8px;
    border-radius: 10px;
    word-wrap: break-word;
    margin-bottom: 20px;
    .label {
      margin-bottom: 4px;
    }
  }

  .item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    .label {
      color: ${(props) => props.theme.color.grayDD};
      font-weight: 700;
      font-size: 22px;
      line-height: 22px;
      display: flex;
      align-items: center;

      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    }
    .value {
      font-weight: 400;
      font-size: 22px;
      line-height: 22px;
      color: ${(props) => props.theme.color.black};

      .unit {
        margin-left: 6px;
        font-weight: 700;
      }
    }
  }
  /* PC */
  @media screen and (min-width: 800px) {
    display: flex;
    flex-direction: row-reverse;
    gap: 30px;
    .address {
      flex: 1;
    }
    .balance {
      flex: 1;
    }
  }
`;
