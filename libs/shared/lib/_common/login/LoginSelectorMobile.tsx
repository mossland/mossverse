"use client";
// ! This File Needs to be Refactor
import { ConnectButton } from "./index";
import { EthereumIcon, KlaytnIcon, ModalContainer } from "..";
import { fetch, st, usePage } from "@shared/client";

export type LoginSelectorMobileProps = {
  klaytn?: () => Promise<void>;
  ethereum?: () => Promise<void>;
  networkList: fetch.LightNetwork[];
};

export const LoginSelectorMobile = ({ klaytn, ethereum, networkList }: LoginSelectorMobileProps) => {
  const keyringModal = st.use.keyringModal();
  const { l } = usePage();

  if (keyringModal !== "addWallet") return null;

  return (
    <ModalContainer
      showModal={keyringModal === "addWallet"}
      closeShowModal={() => st.set({ keyringModal: null })}
      title={l("shared.selectNetwork")}
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
                await st.do.signuporinWallet(network.id, {
                  // loginType: "skipReplace",
                });
              }}
            />
          ) : network.provider === "ethereum" ? (
            <ConnectButton
              title={"Ethereum"}
              fontColor={"white"}
              backgroundColor={"#343434"}
              icon={<EthereumIcon />}
              onClick={async () => {
                await st.do.signuporinWallet(network.id, {
                  // loginType: "skipReplace",
                });
              }}
            />
          ) : null
        )}
      </div>
    </ModalContainer>
  );
};
