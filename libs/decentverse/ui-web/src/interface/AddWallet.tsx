import { WalletModal } from "./index";
import { LoginSelector } from "@shared/ui-web";
import { store, gql } from "@decentverse/data-access";

export const AddWallet = () => {
  const onClickWalletButton = async (loginMethod: gql.shared.LoginMethod) => {
    store.shared.wallet.setState({ modalOpen: true, newWalletOperation: "sleep", newActiveProvider: loginMethod });
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
