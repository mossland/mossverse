import React from "react";
import styled from "styled-components";
import { darken } from "polished";
import { gql, utils, store } from "../../../stores";

export const MmocToMocForm = () => {
  const self = store.platform.user.use.self();
  const wallet = store.shared.wallet.use.wallet();
  const depositAmount = store.mocWallet.use.depositAmount();
  const depositAddress = store.mocWallet.use.depositAddress();
  const max = () => {
    if (!self) return 0;
    const item = self.items.find((item) => item.thing.name === "MMOC");
    if (!item) return 0;
    return Math.floor(item.num);
  };
  // const updateInputBefore = useExchange((state) => state.updateInputBefore);
  // const inputBefore = useExchange((state) => state.inputBefore);
  // const after = useExchange((state) => state.after);
  // const balanceInMMOC = useUser((state) => state.balanceInMMOC);
  return (
    <MmocToMocFormContainer disabled={!wallet}>
      <p className="label">Amount</p>
      <div className="input-box">
        {/* <input
          className="text-input"
          value={depositAddress}
          onChange={(e) => store.mocWallet.setState({ depositAddress: e.target.value })}
        /> */}
        <input
          disabled={!wallet}
          min={0}
          max={max()}
          type="number"
          value={depositAmount}
          onBlur={(e) =>
            store.mocWallet.setState({ depositAmount: max() < e.target.valueAsNumber ? 0 : e.target.valueAsNumber })
          }
          onChange={(e) => store.mocWallet.setState({ depositAmount: e.target.valueAsNumber })}
        />
        <div className="unit">MMOC</div>
        <div
          id="max-button"
          className={`max-button`}
          onClick={() =>
            store.mocWallet.setState({
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
          onChange={(e) => store.mocWallet.setState({ depositAddress: e.target.value })}
        />
        {/* <Field.Text
          label=""
          value={depositAddress}
          onChange={(depositAddress) => store.mocWallet.setState({ depositAddress })}
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
