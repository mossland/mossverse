// ! This File Needs to be Refactor
import styled, { keyframes } from "styled-components";
import { gql, store } from "@shared/data-access";
import { ConnectEthereum, ConnectKlaytn, ConnectLuniverse, ConnectButton } from "./index";
import { MetamaskIcon, KlaytnIcon, LuniverseIcon, EthereumIcon, ModalContainer } from "../common";

export type LoginSelectorMobileProps = {
  klaytn?: () => Promise<void>;
  ethereum?: () => Promise<void>;
  networkList: gql.LightNetwork[];
};

export const LoginSelectorMobile = ({ klaytn, ethereum, networkList }: LoginSelectorMobileProps) => {
  const isOpenModal = store.keyring.use.isOpenModal();

  if (!isOpenModal) return null;

  return (
    <ModalContainer
      showModal={isOpenModal}
      closeShowModal={() => {
        store.keyring.setState({ isOpenModal: false });
      }}
      title="Select Network"
    >
      <LoginSelectorContainer>
        {networkList.map((network) =>
          network.provider === "klaytn" ? (
            <ConnectButton
              title={"Klaytn"}
              fontColor={"white"}
              backgroundColor={"#69583F"}
              icon={<KlaytnIcon />}
              onClick={async () => await store.keyring.do.signinWithWallet("walletConnect", network)}
            />
          ) : network.provider === "ethereum" ? (
            <ConnectButton
              title={"Ethereum"}
              fontColor={"white"}
              backgroundColor={"#343434"}
              icon={<EthereumIcon />}
              onClick={async () => await store.keyring.do.signinWithWallet("walletConnect", network)}
            />
          ) : null
        )}
      </LoginSelectorContainer>
    </ModalContainer>
  );
};

const LoginSelectorContainer = styled.div`
  padding: 24px;
  display: flex;
  gap: 18px;
  flex-direction: column;
`;
