import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { DefaultButton } from "../common";
import styled from "styled-components";
import { Utils } from "@shared/util";

type BalanceItemProps = {
  image: string;
  label: string;
  count: number;
};

export const BalanceItem = ({ image, label, count }: BalanceItemProps) => {
  return (
    <BalanceItemContainer>
      <div className="label">
        {/* <img src="/images/m_coin.png" /> */}
        <img src={image} />
        {label ?? "MMOC"}
      </div>
      <div className="balance">{count ? Utils.numberWithCommas(count) : 0}</div>
    </BalanceItemContainer>
  );
};

const BalanceItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .label {
    font-weight: bold;
    font-size: 18px;
    color: #555555;
    img {
      width: 13px;
      margin-right: 2px;
    }
  }
  .balance {
    font-size: 18px;
  }
`;
