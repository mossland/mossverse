import { MyBalance, ExchangeButtons } from "../../components";
import { userStore, listingStore } from "@platform/data-access";
import styled from "styled-components";
import { walletStore } from "@shared/data-access";
import { Connect, MyAddress, MarketNav } from "../";
import { BiChevronRight } from "react-icons/bi";
import { darken } from "polished";

export const MarketHeader = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();
  const onClickMyTokensButton = () => listingStore.setState({ filter: "myTokens" });

  return (
    <StyledMarketHeader isLogin={!!wallet}>
      <div className="header-menu">
        <div className="header-item">
          <MyBalance />
        </div>
        <div className="header-item">
          {wallet ? (
            <>
              <MyAddress />
              <div className="my-tokens-button" onClick={onClickMyTokensButton}>
                MyTokens
                <div className="arrow">
                  <BiChevronRight />
                </div>
              </div>
            </>
          ) : (
            <Connect />
          )}
        </div>
      </div>
      <MarketNav />
    </StyledMarketHeader>
  );
};

const StyledMarketHeader = styled.div<{ isLogin: boolean }>`
  .header-menu {
    padding: 12px 22px;
    padding-bottom: 0px;
    display: flex;
    gap: 53px;
    height: ${(props) => (props.isLogin ? "115px" : "72px")};
    @media screen and (max-width: 800px) {
      gap: 13px;
      height: ${(props) => (props.isLogin ? "78px" : "56px")};
    }
    .header-item {
      width: 50%;
    }
  }
  .address br {
    display: none;
  }
  .my-tokens-button {
    margin-top: 8px;
    position: relative;
    background-color: #ffe177;
    font-size: 18px;
    text-align: center;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      background-color: ${darken(0.2, "#ffe177")};
    }
    .arrow {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      svg {
        font-size: 30px;
      }
    }
    @media screen and (max-width: 800px) {
      height: 24px;
      font-size: 13px;
      padding: 2px;
      border-radius: 4px;
      margin-top: 5px;
      .arrow {
        svg {
          margin-bottom: -2px;
          font-size: 20px;
        }
      }
    }
  }
`;
