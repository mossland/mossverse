import React from "react";
import styled from "styled-components";
import { ExchangeCancelButton, MmocToMocButton } from "@platform/ui-web";
import { MyBalanceInfo } from "@platform/ui-web";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { gql, utils, store } from "../../../stores";

export const MmcoToMocFooter = () => {
  const self = store.platform.user.use.self();
  const depositAmount = store.mocWallet.use.depositAmount();
  const depositAddress = store.mocWallet.use.depositAddress();
  const withdraw = store.mocWallet.use.withdraw();
  const disabled = !ethers.utils.isAddress(depositAddress) || !depositAmount;

  const onWithdraw = async () => {
    if (!self) return toast.error("please login after withdraw.");
    const receipt = await withdraw(self.id, depositAddress, depositAmount);
    store.platform.receipt.setState({ receipt });
    toast.success(`withdraw suceess!`);
  };
  return (
    <MmcoToMocFooterContainer className="footer-button">
      <div className="only-mobile">
        <ExchangeCancelButton />
      </div>
      <MmocToMocButton disabled={disabled} onClick={onWithdraw} />
    </MmcoToMocFooterContainer>
  );
};

const MmcoToMocFooterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 22px;
  gap: 10px;
  svg {
    display: inline-block;
  }
  & div {
    flex: 1;
  }
`;
