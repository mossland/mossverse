// ! This File Needs to be Refactor
import styled from "styled-components";
import { store } from "@shared/data-access";
import { ConnectButton } from "./index";
import { KlaytnIcon, LuniverseIcon, EthereumIcon, ModalContainer } from "../common";

export type LoginSelectorProps = {
  klaytn?: () => Promise<void>;
  ethereum?: () => Promise<void>;
  luniverse?: () => Promise<void>;
};

export const LoginSelector = ({ klaytn, ethereum, luniverse }: LoginSelectorProps) => {
  const isOpenModal = store.keyring.use.isOpenModal();

  if (!isOpenModal) return null;

  return (
    <ModalContainer
      showModal={isOpenModal}
      closeShowModal={() => store.keyring.setState({ isOpenModal: false })}
      title="Select Network"
    >
      <LoginSelectorContainer>
        {klaytn && (
          <ConnectButton
            title={"Klaytn"}
            fontColor={"white"}
            backgroundColor={"#69583F"}
            icon={<KlaytnIcon />}
            onClick={klaytn}
          />
        )}
        {ethereum && (
          <ConnectButton
            title={"Ethereum"}
            fontColor={"white"}
            backgroundColor={"#343434"}
            icon={<EthereumIcon />}
            onClick={ethereum}
          />
        )}
        {luniverse && (
          <ConnectButton
            title={"Luniverse"}
            fontColor={"white"}
            backgroundColor={"#1A97DB"}
            icon={<LuniverseIcon />}
            onClick={luniverse}
          />
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
