import { BiRightArrowAlt } from "react-icons/bi";
import { gql, st, store } from "../../stores";
import { Modal } from "../common";

export const ReceiptModal = () => {
  const self = st.use.self();
  const receipt = st.use.receipt();
  const depositAddress = st.use.depositAddress();

  if (!receipt || receipt === "loading") return <></>;
  const input = receipt && receipt.inputs[0];
  const output = receipt && receipt.outputs[0];
  const onClose = async () => {
    st.set({ depositAddress: "", depositAmount: 0 });
    st.do.resetReceipt();
    self && (await st.do.initReceipt({ query: { user: self.id } }));
    // await initSelf();
  };
  //!need to change
  const descClassName = "mt-[10px] ml-[10px] text-[18px]";

  return (
    receipt && (
      <Modal title={"Trade Success"} type={"close"} onClose={onClose}>
        <div className="justify-center items-center text-[20px]">
          <div className="text-center font-bold text-[38px]"> Trade Success!</div>
          {/* <ExchangeFlow input={input} output={output} /> */}
          <div className="flex justify-center items-center my-[60px] text-[30px]">
            <img src="/images/mm_coin.png" />
            {input.getName()} {input.value}
            <BiRightArrowAlt />
            <img src="/images/m_coin.png" />
            {output.getName()} {output.value}
          </div>
          <div className={descClassName}>Deposited address : {depositAddress}</div>
          <div className={descClassName}>Tx Hash : {output.hash}</div>
          <div className={descClassName}>Receipt ID : {receipt.id}</div>
          {/* {input && input[input.type].num}
        {output && output[output.type].num} */}
        </div>
      </Modal>
    )
  );
};
