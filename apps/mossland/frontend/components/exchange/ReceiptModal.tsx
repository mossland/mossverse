import { receiptStore, userStore, utils } from "@platform/data-access";
import { ExchangeFlow } from "@platform/ui-web";
import { BiRightArrowAlt } from "react-icons/bi";
import styled from "styled-components";
import { mocWalletStore } from "apps/mossland/frontend/stores";
import { Modal } from "../common";

export const ReceiptModal = () => {
  const self = userStore.use.self();
  const receipt = receiptStore.use.receipt();
  const depositAddress = mocWalletStore.use.depositAddress();
  const initReceipt = receiptStore.use.init();
  const initSelf = userStore.use.init();

  if (!receipt) return <></>;
  const input = receipt && receipt.inputs[0];
  const output = receipt && receipt.outputs[0];
  const onClose = async () => {
    mocWalletStore.setState({ depositAddress: "", depositAmount: 0 });
    receiptStore.setState({ receipt: null });
    self && (await initReceipt(self.id));
    await initSelf();
  };
  return (
    receipt && (
      <Modal title={"Trade Success"} type={"close"} onClose={onClose}>
        <ReceiptContainer>
          <div className="title"> Trade Success!</div>
          {/* <ExchangeFlow input={input} output={output} /> */}
          <div className="flow">
            <img src="/images/mm_coin.png" />
            {utils.getExchangeName(input)} {input.num}
            <BiRightArrowAlt />
            <img src="/images/m_coin.png" />
            {utils.getExchangeName(output)} {output.num}
          </div>
          <div className="desc">Deposited address : {depositAddress}</div>
          <div className="desc">Tx Hash : {output.hash}</div>
          <div className="desc">Receipt ID : {receipt.id}</div>
          {/* {input && input[input.type].num}
        {output && output[output.type].num} */}
        </ReceiptContainer>
      </Modal>
    )
  );
};

const ReceiptContainer = styled.div`
  /* display: flex; */
  justify-content: center;
  align-items: center;
  font-size: 20px;
  .flow {
    display: flex;
    margin: 60px 0px;
    justify-content: center;
    align-items: center;
    font-size: 30px;
  }

  .desc {
    margin-top: 10px;
    margin-left: 10px;
    font-size: 18px;
  }

  .title {
    text-align: center;
    font-size: 38px;
    font-weight: bold;
  }
`;
