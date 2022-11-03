import { gql, utils, store } from "../../stores";
import { ExchangeAddressBar, MocToMmocStep1, MocToMmocStep2 } from "./mocToMmoc";

export const DepositStep = () => {
  const self = store.platform.user.use.self();
  const wallet = store.shared.wallet.use.wallet();
  const mocWallet = store.mocWallet.use.mocWallet();
  const understand = store.mocWallet.use.understand();
  const deposit = store.mocWallet.use.deposit();

  const onDeposit = async () => {
    if (!self) return;
    await deposit(self.id);
  };

  return (
    <>
      {!understand && (
        <MocToMmocStep1
          isDisabled={!wallet}
          onClick={() => {
            store.mocWallet.setState({ understand: true });
          }}
        />
      )}
      {!mocWallet && understand && <MocToMmocStep2 onClick={onDeposit} />}
      {mocWallet && <ExchangeAddressBar address={mocWallet.address} />}
    </>
  );
};
