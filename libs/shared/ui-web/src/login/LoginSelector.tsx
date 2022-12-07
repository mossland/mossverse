// ! This File Needs to be Refactor
import styled from "styled-components";
import { gql, store } from "@shared/data-access";
import { ConnectButton } from "./index";
import { KlaytnIcon, LuniverseIcon, EthereumIcon, ModalContainer } from "../common";

export type LoginSelectorProps = {
  networkList: gql.LightNetwork[];
};

export const LoginSelector = ({ networkList }: LoginSelectorProps) => {
  const isOpenModal = store.keyring.use.isOpenModal();

  if (!isOpenModal) return null;

  return (
    <ModalContainer
      showModal={isOpenModal}
      closeShowModal={() => store.keyring.setState({ isOpenModal: false })}
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
              onClick={async () => await store.keyring.do.signinWithWallet("kaikas", network)}
            />
          ) : network.provider === "ethereum" ? (
            <ConnectButton
              title={"Ethereum"}
              fontColor={"white"}
              backgroundColor={"#343434"}
              icon={<EthereumIcon />}
              onClick={async () => await store.keyring.do.signinWithWallet("metamask", network)}
            />
          ) : null
        )}
      </LoginSelectorContainer>
    </ModalContainer>
  );
};

const LoginSelectorContainer = styled.div`
  padding: 24px 22px;
  display: flex;
  gap: 18px;
  flex-direction: column;
  z-index: 2;
  /* height: 240px; */
`;
