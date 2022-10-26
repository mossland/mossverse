import { MyBalance, ExchangeButtons } from "../../components";
import { userStore, useUser } from "@platform/data-access";
import styled from "styled-components";
import { walletStore } from "@shared/data-access";
import { Connect, MyAddress } from "../";

export const ExchangeHeader = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();

  return (
    <StyledExchangeHeader>
      <div className="header-menu">
        <div className="header-item">
          <h2 className="only-pc">Exchange</h2>
          <MyBalance />
        </div>
        <div className="header-item">{wallet ? <MyAddress /> : <Connect />}</div>
      </div>
      <div className="only-mobile">
        <ExchangeButtons />
      </div>
    </StyledExchangeHeader>
  );
};

const StyledExchangeHeader = styled.div`
  padding: 12px 22px;
  padding-bottom: 0px;
  h2 {
    font-weight: bold;
    font-size: 26px;
    margin-bottom: 0px;
    line-height: 1em;
  }
  @media screen and (min-width: 800px) {
    height: 102px;

    /* height: 154px; */
  }

  .header-menu {
    display: flex;
    gap: 53px;
    @media screen and (max-width: 800px) {
      gap: 0px;
      flex-direction: column-reverse;
    }
    .header-item {
      flex: 1;
      /* padding: 20px 0px; */
      @media screen and (max-width: 800px) {
        padding: 10px 0px;
      }
    }
  }
`;
