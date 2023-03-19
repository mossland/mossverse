// ! This File Needs to be Refactor
import { gql, st } from "@shared/data-access";
import { ConnectButton } from "./index";
import { KlaytnIcon, LuniverseIcon, EthereumIcon, ModalContainer } from "../common";

export type LoginSelectorProps = {
  networkList: gql.LightNetwork[];
};

export const LoginSelector = ({ networkList }: LoginSelectorProps) => {
  const keyringModal = st.use.keyringModal();

  if (keyringModal !== "addWallet") return null;
  return (
    <ModalContainer
      title="Select Network"
      showModal={keyringModal === "addWallet"}
      closeShowModal={() => st.set({ keyringModal: null })}
    >
      <div className="py-[24px] px-[22px] flex gap-[18px] flex-col z-[2]">
        {networkList.map((network) =>
          network.provider === "klaytn" ? (
            <ConnectButton
              title={"Klaytn"}
              fontColor={"white"}
              backgroundColor={"#69583F"}
              icon={<KlaytnIcon />}
              onClick={() => st.do.signuporinWallet("kaikas", network, { loginType: "skipReplace" })}
            />
          ) : network.provider === "ethereum" ? (
            <ConnectButton
              title={"Ethereum"}
              fontColor={"white"}
              backgroundColor={"#343434"}
              icon={<EthereumIcon />}
              onClick={() => st.do.signuporinWallet("metamask", network, { loginType: "skipReplace" })}
            />
          ) : null
        )}
      </div>
    </ModalContainer>
  );
};
