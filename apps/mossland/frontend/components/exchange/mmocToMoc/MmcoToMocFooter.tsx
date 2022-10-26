import React from "react";
import styled from "styled-components";
import { ExchangeCancelButton, MmocToMocButton } from "@platform/ui-web";
import { receiptStore, useExchange, userStore } from "@platform/data-access";
import { mocWalletStore } from "apps/mossland/frontend/store/stores";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { transformLMPopArguments } from "@redis/client/dist/lib/commands/generic-transformers";

export const MmcoToMocFooter = () => {
  const self = userStore.use.self();
  const initSelf = userStore.use.init();
  const depositAmount = mocWalletStore.use.depositAmount();
  const depositAddress = mocWalletStore.use.depositAddress();
  const withdraw = mocWalletStore.use.withdraw();
  const initReceipt = receiptStore.use.init();
  const disabled = !ethers.utils.isAddress(depositAddress) || !depositAmount;

  const onWithdraw = async () => {
    if (!self) return toast.error("please login after withdraw.");
    const receipt = await withdraw(self.id, depositAddress, depositAmount);
    receiptStore.setState({ receipt });
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
