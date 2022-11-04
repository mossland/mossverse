// ! This File Needs to be Refactor
import styled, { keyframes } from "styled-components";
import { store } from "@shared/data-access";
import { ConnectEthereum, ConnectKlaytn, ConnectLuniverse, ConnectButton } from "./index";
import { MetamaskIcon, KlaytnIcon, LuniverseIcon, EthereumIcon, ModalContainer } from "../common";
import { cnst, Utils } from "@shared/util";
import { walletConnect } from "@shared/util-client";

export type LoginSelectorMobileProps = {
  klaytn?: () => Promise<void>;
  ethereum?: () => Promise<void>;
};

export const LoginSelectorMobile = ({ klaytn, ethereum }: LoginSelectorMobileProps) => {
  const isOpenModal = store.keyring.use.isOpenModal();
  const network = store.network.use.network();
  const networkList = store.network.use.networkList();
  const signMessage = store.keyring.use.signMessage();
  const signStatus = store.keyring.use.signStatus();
  const connector = store.keyring.use.connector();
  const generateSignMessage = store.keyring.use.generateSignMessage();

  const connect = async (provider: cnst.NetworkProvider) => {
    const network = networkList.find((n) => n.provider === provider);
    if (!network) return;
    store.network.setState({ network });
    const { accounts, chainId, networkId, rpcUrl } = await walletConnect.connect(connector);
    if (network.networkId !== chainId) {
      store.keyring.setState({
        signStatus: "network-diff",
      });
      return;
    }

    const signMessage = await generateSignMessage(connector.accounts[0]);
    store.keyring.setState({ signStatus: "connect", signMessage });
  };
  const sign = async () => {
    if (!network || !signMessage) return;
    if (network.provider === "klaytn" && klaytn) await klaytn();
    else if (network.provider === "ethereum" && ethereum) await ethereum();
    // localStorage.removeItem("walletconnect");
  };
  const change = async () => {
    if (!network) return;
    await walletConnect.switchNetwork(connector, network.networkId);
    const signMessage = await generateSignMessage(connector.accounts[0]);
    store.keyring.setState({ signStatus: "connect", signMessage });
  };

  if (!isOpenModal) return null;

  return (
    <ModalContainer
      showModal={isOpenModal}
      closeShowModal={() => {
        // localStorage.removeItem("walletconnect");
        // localStorage.removeItem("ally-supports-cache");
        store.keyring.setState({ isOpenModal: false, signStatus: "none" });
      }}
      title="Select Network"
    >
      <LoginSelectorContainer>
        {signStatus === "connect" && (
          <ConnectButton title={`Sign in`} fontColor={"black"} backgroundColor={"white"} onClick={sign} />
        )}
        {signStatus === "network-diff" && network && (
          <>
            <div style={{ fontSize: 10 }}>
              {`네트워크가 일치하지 않습니다.\n
              버튼을 눌러 네트워크를 ${network.name}으로 변경해주세요.`}
            </div>
            <ConnectButton
              title={`Switch ${network.name}`}
              fontColor={"black"}
              backgroundColor={"white"}
              onClick={change}
            />
          </>
        )}
        {signStatus === "none" && klaytn && (
          <ConnectButton
            title={"Klaytn"}
            fontColor={"white"}
            backgroundColor={"#69583F"}
            icon={<KlaytnIcon />}
            onClick={() => connect("klaytn")}
          />
        )}
        {signStatus === "none" && ethereum && (
          <ConnectButton
            title={"Ethereum"}
            fontColor={"white"}
            backgroundColor={"#343434"}
            icon={<EthereumIcon />}
            onClick={() => connect("ethereum")}
          />
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
