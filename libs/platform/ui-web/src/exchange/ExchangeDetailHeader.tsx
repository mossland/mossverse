import React, { ReactNode, useEffect } from "react";
import styled from "styled-components";
import { BiRightArrowAlt, BiChevronLeft } from "react-icons/bi";
import Link from "next/link";

type ExchangeDetailHeaderProps = {
  from: ReactNode;
  to: ReactNode;
};

export const ExchangeDetailHeader = ({ from, to }: ExchangeDetailHeaderProps) => {
  return (
    <ExchangeDetailHeaderContainer>
      <Link href="/exchange" passHref>
        <a className="back-button">
          <BiChevronLeft />
        </a>
      </Link>

      <div className="title">
        {from}
        <BiRightArrowAlt />
        {to}
      </div>
    </ExchangeDetailHeaderContainer>
  );
};

const ExchangeDetailHeaderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .title {
    margin: 20px 0;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 26px;
    line-height: 26px;
    img {
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }
    svg {
      margin: 0 8px;
    }
  }
  .back-button {
    position: absolute;
    color: black;
    /* top: 24px;
    left: 22px; */
    top: 16px;
    left: 12px;
    svg {
      font-size: 34px;
    }
  }

  @media screen and (min-width: 800px) {
    height: 44px;
    border-bottom: 2px solid ${(props) => props.theme.color.black};
    .title {
      margin: auto 0;
      font-size: 22px;
      line-height: 44px;
      font-weight: 400;
    }
    .back-button {
      display: none;
    }
  }
`;
