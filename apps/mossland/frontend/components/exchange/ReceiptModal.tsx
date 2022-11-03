import { BiRightArrowAlt } from "react-icons/bi";
import styled from "styled-components";
import { gql, utils, store } from "../../stores";
import { Modal } from "../common";

export const ReceiptModal = () => {
  const self = store.platform.user.use.self();
  const receipt = store.platform.receipt.use.receipt();
  const depositAddress = store.mocWallet.use.depositAddress();
  const initReceipt = store.platform.receipt.use.init();
  const initSelf = store.platform.user.use.initUser();

  if (!receipt) return <></>;
  const input = receipt && receipt.inputs[0];
  const output = receipt && receipt.outputs[0];
  const onClose = async () => {
    store.mocWallet.setState({ depositAddress: "", depositAmount: 0 });
    store.platform.receipt.setState({ receipt: null });
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
            {utils.platform.getExchangeName(input)} {input.num}
            <BiRightArrowAlt />
            <img src="/images/m_coin.png" />
            {utils.platform.getExchangeName(output)} {output.num}
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
