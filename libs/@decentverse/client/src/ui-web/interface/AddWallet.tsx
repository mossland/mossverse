import { WalletModal } from "./index";
import { LoginSelector } from "@shared/ui-web";
import { walletStore, types } from "../../stores";

export const AddWallet = () => {
  const onClickWalletButton = async (loginMethod: types.shared.LoginMethod) => {
    walletStore.setState({ modalOpen: true, newWalletOperation: "sleep", newActiveProvider: loginMethod });
  };

  return (
    <>
      <LoginSelector
        ethereum={async () => await onClickWalletButton("ethereum")}
        klaytn={async () => await onClickWalletButton("klaytn")}
      />
      <WalletModal />
    </>
  );
};
