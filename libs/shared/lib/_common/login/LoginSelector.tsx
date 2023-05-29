"use client";
// ! This File Needs to be Refactor
import { EthereumIcon, KlaytnIcon } from "../icon";
import { ModalContainer } from "../ModalContainer";
import { SignWallet, fetch, st } from "@shared/client";

export type LoginSelectorProps = {
  networkList: fetch.LightNetwork[];
};

export const LoginSelector = ({ networkList }: LoginSelectorProps) => {
  const keyringModal = st.use.keyringModal();
  if (keyringModal !== "addWallet") return null;
  console.log(networkList);
  return (
    <ModalContainer
      title="Select Network"
      showModal={keyringModal === "addWallet"}
      closeShowModal={() => st.set({ keyringModal: null })}
    >
      <div className="py-[24px] px-[22px] flex gap-[18px] flex-col z-[2]">
        {networkList.map((network) =>
          network.provider === "klaytn" ? (
            <SignWallet
              networkType={network.type === "ganache" || network.type === "offchain" ? "debugnet" : network.type}
              walletType="kaikas"
              onSigned={() => st.do.signuporinWallet(network.id, {})}
            >
              <button className="w-full p-[10px] text-[22px] text-center bg-[#69583F] gap-2 text-white rounded-[10px] focus:outline-none border-[2px] border-black flex items-center justify-center">
                <KlaytnIcon />
                <div>{network.name}</div>
              </button>
            </SignWallet>
          ) : network.provider === "ethereum" ? (
            <SignWallet
              networkType={network.type === "ganache" || network.type === "offchain" ? "debugnet" : network.type}
              walletType="metamask"
              onSigned={() => st.do.signuporinWallet(network.id, {})}
            >
              <button className="w-full p-[10px] text-[22px] text-center bg-[#343434] gap-2 text-white rounded-[10px] focus:outline-none border-[2px] border-black flex items-center justify-center">
                <EthereumIcon />
                <div>{network.name}</div>
              </button>
            </SignWallet>
          ) : null
        )}
      </div>
    </ModalContainer>
  );
};
