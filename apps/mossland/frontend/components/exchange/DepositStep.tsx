import { client } from "@shared/util-client";
import { gql, st, store } from "../../stores";
import { ExchangeAddressBar, MocToMmocStep1, MocToMmocStep2 } from "./mocToMmoc";

export const DepositStep = () => {
  const self = st.use.self();
  // const wallet = st.use.wallet();
  const myKeyring = st.use.myKeyring();
  const mocWallet = st.use.mocWallet();
  const understand = st.use.understand();
  //!need to change
  const onDeposit = async () => {
    if (!self) return;
    await st.do.deposit(self.id);
  };

  return (
    <>
      {!understand && (
        <MocToMmocStep1
          isDisabled={!myKeyring.wallets.length}
          onClick={() => {
            st.set({ understand: true });
          }}
        />
      )}
      {(mocWallet === "loading" || !mocWallet) && understand && <MocToMmocStep2 onClick={onDeposit} />}
      {mocWallet && mocWallet !== "loading" && <ExchangeAddressBar address={mocWallet.address} />}
    </>
  );
};
