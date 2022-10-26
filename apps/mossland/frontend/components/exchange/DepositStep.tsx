import { userStore } from "@platform/data-access";
import { mocWalletStore } from "apps/mossland/frontend/stores";
import { walletStore } from "@shared/data-access";
import { ExchangeAddressBar, MocToMmocStep1, MocToMmocStep2 } from "./mocToMmoc";

export const DepositStep = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();
  const mocWallet = mocWalletStore.use.mocWallet();
  const understand = mocWalletStore.use.understand();
  const deposit = mocWalletStore.use.deposit();

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
            mocWalletStore.setState({ understand: true });
          }}
        />
      )}
      {!mocWallet && understand && <MocToMmocStep2 onClick={onDeposit} />}
      {mocWallet && <ExchangeAddressBar address={mocWallet.address} />}
    </>
  );
};
