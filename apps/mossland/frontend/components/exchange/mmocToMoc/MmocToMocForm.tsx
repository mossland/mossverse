import React from "react";
import styled from "styled-components";
import { useExchangeUi, userStore } from "@platform/data-access";
import { darken } from "polished";
import { useUser } from "@platform/data-access";
import { Utils } from "@shared/util";
import { mocWalletStore } from "apps/mossland/frontend/stores";
import { Field } from "@shared/ui-web";
import { ethers } from "ethers";
import { walletStore } from "@shared/data-access";

export const MmocToMocForm = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();
  const depositAmount = mocWalletStore.use.depositAmount();
  const depositAddress = mocWalletStore.use.depositAddress();
  const max = () => {
    if (!self) return 0;
    const item = self.items.find((item) => item.thing.name === "MMOC");
    if (!item) return 0;
    return Math.floor(item.num);
  };
  // const updateInputBefore = useExchangeUi((state) => state.updateInputBefore);
  // const inputBefore = useExchangeUi((state) => state.inputBefore);
  // const after = useExchangeUi((state) => state.after);
  // const balanceInMMOC = useUser((state) => state.balanceInMMOC);
  return (
    <MmocToMocFormContainer disabled={!wallet}>
      <p className="label">Amount</p>
      <div className="input-box">
        {/* <input
          className="text-input"
          value={depositAddress}
          onChange={(e) => mocWalletStore.setState({ depositAddress: e.target.value })}
        /> */}
        <input
          disabled={!wallet}
          min={0}
          max={max()}
          type="number"
          value={depositAmount}
          onBlur={(e) =>
            mocWalletStore.setState({ depositAmount: max() < e.target.valueAsNumber ? 0 : e.target.valueAsNumber })
          }
          onChange={(e) => mocWalletStore.setState({ depositAmount: e.target.valueAsNumber })}
        />
        <div className="unit">MMOC</div>
        <div
          id="max-button"
          className={`max-button`}
          onClick={() =>
            mocWalletStore.setState({
              depositAmount: max(),
            })
          }
        >
          MAX
        </div>
      </div>
      <p className="after">= {isNaN(depositAmount) ? 0 : depositAmount} MOC</p>
      <p className="label">Address</p>
      <div className="input-box">
        <input
          disabled={!wallet}
          className="text-input"
          value={depositAddress}
          onChange={(e) => mocWalletStore.setState({ depositAddress: e.target.value })}
        />
        {/* <Field.Text
          label=""
          value={depositAddress}
          onChange={(depositAddress) => mocWalletStore.setState({ depositAddress })}
        /> */}
      </div>
    </MmocToMocFormContainer>
  );
};

const MmocToMocFormContainer = styled.div<{ disabled: boolean }>`
  .label {
    color: ${(props) => props.theme.color.grayDD};
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 6px;
  }

  .input-box {
    background-color: "white";
    display: flex;
    align-items: center;
    /* justify-content: flex-end; */
    padding: 0 14px;
    gap: 10px;
    border: 2px solid ${(props) => props.theme.color.black};
    border-radius: 10px;
    input {
      border-width: 0;
      padding: 8px 0;
      flex-grow: 1;
      text-align: right;
      font-size: 20px;
      color: ${(props) => props.theme.color.grayDD};
      background-color: #fff;
      outline: none;
      outline-width: 0px;

      /* caret-shape: underscore; */
    }
    &.text-input {
      margin-top: 0px;
      border-width: 0;
      padding: 8px 0;
      /* width: 100%; */
      flex-grow: 1;
      text-align: right;
      font-size: 16px;
      color: ${(props) => props.theme.color.grayDD};
      background-color: "white";

      outline: none;
      outline-width: 0px;

      /* caret-shape: underscore; */
    }
    .unit {
      font-weight: 700;
      font-size: 20px;
      line-height: 20px;
      color: ${(props) => props.theme.color.gray};
    }
    .max-button {
      font-weight: 700;
      font-size: 20px;
      line-height: 20px;
      cursor: pointer;
      color: #00e5d0;
      transition: all 0.5s;

      &:hover,
      &:active {
        color: ${(props) => darken(0.2, props.theme.color.main)};
      }
    }
    input:not([value="0"]) ~ .max-button {
      display: none;
    }
  }

  .after {
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    text-align: right;
    margin-top: 6px;
    margin-bottom: 9px;
    color: ${(props) => props.theme.color.grayDD};
  }
`;
