import React from "react";
import styled from "styled-components";
import { BiChevronLeft } from "react-icons/bi";
import Link from "next/link";

type MarketDetailHeaderProps = {
  title: string;
  type: string;
  onClick: () => void;
};

export const MarketDetailHeader = ({ title, type, onClick }: MarketDetailHeaderProps) => {
  return (
    <MarketDetailHeaderContainer>
      <div className="back-button" onClick={onClick}>
        <BiChevronLeft />
      </div>
      <div className="header-title">
        {type === "p2p" && <div className="tag tag-p2p">P2P</div>}
        {type === "delivery" && <div className="tag tag-delivery">Delivery</div>}
        <h1>{title}</h1>
      </div>
    </MarketDetailHeaderContainer>
  );
};

const MarketDetailHeaderContainer = styled.div`
  position: relative;
  padding: 14px;

  .back-button {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translate(0, -50%);
    color: black !important;
    svg {
      font-size: 34px;
    }
  }

  .header-title {
    text-align: center;
    .tag {
      display: inline-block;
      color: white;
      border-radius: 4px;
      padding: 3px 13px;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 4px;
      &.tag-p2p {
        background-color: #cd70e3;
      }
      &.tag-delivery {
        background-color: #1cc8ff;
      }
    }
    h1 {
      font-size: 24px;
      margin: 0;
    }
  }
`;
