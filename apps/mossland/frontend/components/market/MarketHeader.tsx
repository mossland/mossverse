import { gql, utils, store } from "../../stores";
import styled from "styled-components";
import { Connect, MyAddress, MarketNav, MyBalance, MyTokens } from "../";

import { BiChevronRight } from "react-icons/bi";
import { darken } from "polished";
import { ListingHeader } from "@platform/ui-web";
export const MarketHeader = () => {
  const self = store.platform.user.use.self();

  return (
    <ListingHeader>
      <ListingHeader.Menu>
        <ListingHeader.Item>
          <MyBalance />
        </ListingHeader.Item>
        <ListingHeader.Item>
          {self ? (
            <>
              <MyAddress />
              <MyTokens />
            </>
          ) : (
            <Connect />
          )}
        </ListingHeader.Item>
      </ListingHeader.Menu>
      <MarketNav />
    </ListingHeader>
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
