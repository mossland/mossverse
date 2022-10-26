import styled, { keyframes } from "styled-components";
import { keyringStore, networkStore } from "@shared/data-access";
import { ConnectEthereum, ConnectKlaytn, ConnectLuniverse, ConnectButton } from "./index";
import { MetamaskIcon, KlaytnIcon, LuniverseIcon, EthereumIcon, ModalContainer } from "../common";
import { cnst, Utils } from "@shared/util";
import { walletConnect } from "@shared/util-client";
import { whoAmI } from "@platform/data-access";

export type LoginSelectorMobileProps = {
  klaytn?: () => Promise<void>;
  ethereum?: () => Promise<void>;
};

export const LoginSelectorMobile = ({ klaytn, ethereum }: LoginSelectorMobileProps) => {
  const isOpenModal = keyringStore.use.isOpenModal();
  const network = networkStore.use.network();
  const networks = networkStore.use.networks();
  const signMessage = keyringStore.use.signMessage();
  const signStatus = keyringStore.use.signStatus();
  const connector = keyringStore.use.connector();
  const generateSignMessage = keyringStore.use.generateSignMessage();

  const connect = async (provider: cnst.NetworkProvider) => {
    const network = networks.find((n) => n.provider === provider);
    if (!network) return;
    networkStore.setState({ network });
    const { accounts, chainId, networkId, rpcUrl } = await walletConnect.connect(connector);
    if (network.networkId !== chainId) {
      keyringStore.setState({
        signStatus: "network-diff",
      });
      return;
    }

    const signMessage = await generateSignMessage(connector.accounts[0]);
    keyringStore.setState({ signStatus: "connect", signMessage });
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
    keyringStore.setState({ signStatus: "connect", signMessage });
  };

  if (!isOpenModal) return null;

  return (
    <ModalContainer
      showModal={isOpenModal}
      closeShowModal={() => {
        // localStorage.removeItem("walletconnect");
        // localStorage.removeItem("ally-supports-cache");
        keyringStore.setState({ isOpenModal: false, signStatus: "none" });
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
