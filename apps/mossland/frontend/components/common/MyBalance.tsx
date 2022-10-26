import React, { useEffect } from "react";
import { userStore, useUser } from "@platform/data-access";
import { MyBalanceInfo } from "@platform/ui-web";
import styled from "styled-components";
import { walletStore } from "@shared/data-access";
import { Connect } from "./Connect";
import { MyProfile } from "./";
import { BalanceItem } from "libs/platform/ui-web/src/market";
import { Utils } from "@shared/util";

type MyBalanceProps = {
  isHideMoc?: boolean;
  isHideMmoc?: boolean;
};

export const MyBalance = (props: MyBalanceProps) => {
  // const address = useUser((state) => state.address);
  const self = userStore.use.self();
  // const wallet = walletStore.use.wallet();
  const MMOC = self && self.items.find((item) => item.thing.name === "MMOC");

  useEffect(() => {
    if (!self?.keyring) return;
    walletStore.setState({ wallet: self.keyring.wallets[0] });
  }, [self?.keyring]);

  return (
    <MyBalanceInfoContainer>
      {MMOC ? (
        <div className="balance-item">
          <div className="label">
            <img src={MMOC.thing.image.url} />
            {MMOC.thing.name ?? "MMOC"}
          </div>
          <div className="balance">{MMOC.num ? Utils.numberWithCommas(MMOC.num) : 0}</div>
        </div>
      ) : (
        <div className="balance-item">
          <div className="label">
            <img src="/images/mm_coin.png" />
            {"MMOC"}
          </div>
          <div className="balance">{0}</div>
        </div>
      )}

      {/* {wallet ? (
        <div className="flex-item">
          <MyProfile nickname={self?.nickname || ""} />
        </div>
      ) : (
        <Connect />
      )} */}
    </MyBalanceInfoContainer>
  );
};

const MyBalanceInfoContainer = styled.div`
  margin-top: 6px;
  width: 100%;
  .balance-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      font-weight: bold;
      font-size: 22px;
      color: #555555;
      img {
        display: inline-block;
        margin-top: -2px;
        width: 16px;
        margin-right: 4px;
      }
    }
    .balance {
      font-size: 22px;
    }
  }
  @media screen and (max-width: 800px) {
    margin-top: 0px;
  }
`;
