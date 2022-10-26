import React from "react";
import styled from "styled-components";
import { BiRightArrowAlt } from "react-icons/bi";
import Link from "next/link";
import { DefaultButton } from "@platform/ui-web";
import { mocWalletStore } from "../../store/stores";
import { userStore } from "@platform/data-access";

export const ExchangeButtons = () => {
  const self = userStore.use.self();
  const deposit = mocWalletStore.use.deposit();

  const onDeposit = async () => {
    if (!self) return;
    await deposit(self.id);
  };
  return (
    <ButtonGroup>
      <Link href="/exchange/moc-to-mmoc" passHref>
        <DefaultButton className="gradient1" onClick={onDeposit} block type="primary" id="moc-to-mmoc-button">
          MOC
          <BiRightArrowAlt />
          <img src="/images/mm_coin.png" />
          MMOC
        </DefaultButton>
      </Link>

      <Link href="/exchange/mmoc-to-moc" passHref>
        <DefaultButton className="gradient2" onClick={() => null} block type="primary" id="mmoc-to-moc-button">
          MMOC
          <BiRightArrowAlt />
          <img src="/images/m_coin.png" />
          MOC
        </DefaultButton>
      </Link>
    </ButtonGroup>
  );
};

const ButtonGroup = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  .gradient1 button {
    background: linear-gradient(269.82deg, #f5b5ff 23.52%, rgba(245, 181, 255, 0.3) 99.86%);
  }
  .gradient2 button {
    background: linear-gradient(270deg, #23fae6 27.6%, rgba(102, 254, 240, 0.3) 100%);
  }
  button {
    svg {
      display: inline-block;
    }
    img {
      width: 18px;
      height: 18px;
      vertical-align: baseline;
      display: inline-block;
      margin-bottom: -2px;
      margin-right: 4px;
    }
  }
`;
