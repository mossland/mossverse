// ! This File Needs to be Refactor
import { gql, st, useLocale } from "@shared/data-access";
import { ConnectButton } from "./index";
import { MetamaskIcon, KlaytnIcon, LuniverseIcon, EthereumIcon, ModalContainer } from "../common";

export type LoginSelectorMobileProps = {
  klaytn?: () => Promise<void>;
  ethereum?: () => Promise<void>;
  networkList: gql.LightNetwork[];
};

export const LoginSelectorMobile = ({ klaytn, ethereum, networkList }: LoginSelectorMobileProps) => {
  const keyringModal = st.use.keyringModal();
  const { l } = useLocale();

  if (keyringModal !== "addWallet") return null;

  return (
    <ModalContainer
      showModal={keyringModal === "addWallet"}
      closeShowModal={() => st.set({ keyringModal: null })}
      title={l("main.selectNetwork")}
    >
      <div className="p-[24px] flex flex-col gap-[18px]">
        {networkList.map((network) =>
          network.provider === "klaytn" ? (
            <ConnectButton
              title={"Klaytn"}
              fontColor={"white"}
              backgroundColor={"#69583F"}
              icon={<KlaytnIcon />}
              onClick={async () => {
                await st.do.signuporinWallet("walletConnect", network, { loginType: "skipReplace" });
              }}
            />
          ) : network.provider === "ethereum" ? (
            <ConnectButton
              title={"Ethereum"}
              fontColor={"white"}
              backgroundColor={"#343434"}
              icon={<EthereumIcon />}
              onClick={async () => {
                await st.do.signuporinWallet("walletConnect", network, { loginType: "skipReplace" });
              }}
            />
          ) : null
        )}
      </div>
    </ModalContainer>
  );
};
