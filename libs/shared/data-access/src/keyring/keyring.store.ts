/* eslint-disable @typescript-eslint/no-var-requires */
import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink, setSignature, setToken } from "../apollo";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { createSelectors, getAccount, signKaikas, signMetamask, walletConnect } from "@shared/util-client";
import { isMobile } from "react-device-detect";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { cnst, Utils } from "@shared/util";
const Caver = require("caver-js");

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: any;
  }
}
type State = {
  loginMethod: types.LoginMethod;
  networks: types.Network[];
  isOpenModal: boolean;
  networkType: cnst.NetworkType;
  signExpired: boolean;
  signMessage: string | null;
  connector: WalletConnect;
  otp: string | null;
  signStatus: "none" | "connect" | "signed" | "network-diff";
  operation: "sleep" | "idle" | "loading";
};

const defaultKeyring: State = {
  loginMethod: "none",
  networks: [],
  connector: new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
    qrcodeModalOptions: {
      desktopLinks: ["metamask"],
      mobileLinks: ["metamask"],
    },
  }),
  signExpired: false,
  signMessage: null,
  isOpenModal: false,
  otp: null,
  signStatus: "none",
  operation: "sleep",
  networkType: "testnet",
};

type Action = {
  init: (type: cnst.NetworkType) => Promise<void>; // 초기화
  login: (connect: types.LoginMethod) => Promise<void>;
  sign: (connect: types.LoginMethod) => Promise<void>;
  getNetwork: (provider: cnst.NetworkProvider) => types.Network;
  signKaikas: () => Promise<void>;
  getOtp: () => Promise<void>;
  signMetaMask: (signchain: types.MetamaskProvider) => Promise<void>;
  signWalletConnect: (method: types.LoginMethod) => Promise<void>;
  signinWithAddress: (networkId: string) => Promise<void>;
  generateSignMessage: (address: string, signMessage?: string) => Promise<string>;
};

export const useKeyring = create<State & Action>((set, get) => ({
  ...defaultKeyring,
  init: async (networkType: cnst.NetworkType) => {
    const networks = await gql.networks({ type: networkType });
    set({ networks, operation: "idle", networkType });
  },
  signinWithAddress: async (networkId: string) => {
    const token = await gql.signinWithAddress(networkId); // try catch 사용해야함
    await setToken(token);
    localStorage.setItem("currentUser", token);
  },
  getNetwork: (provider: cnst.NetworkProvider) => {
    const { networks, networkType } = get();
    const network = networks.find((network) => network.provider === provider && network.type === networkType);
    if (!network) throw new Error("can not found network.");
    return network;
  },
  generateSignMessage: async (address: string, signMessage?: string) => {
    const message = signMessage ?? "test message";
    const hash = await gql.encrypt(address as string);
    return `${message} token:[${hash}] timeStamp:${new Date().getTime()}`;
  },

  signMetaMask: async (signchain: types.MetamaskProvider) => {
    const { generateSignMessage, getNetwork, signinWithAddress } = get();
    const message = `test message`;
    const network = getNetwork(signchain);
    const account = await getAccount(network.provider, network.networkId);
    if (!account) return;
    const signmessage = await generateSignMessage(account as string, message);
    const signaddress = await signMetamask(signmessage, account);
    if (!signaddress) return;
    setSignature({ signchain: "metamask", signmessage, signaddress });
  },

  signKaikas: async () => {
    const { generateSignMessage, getNetwork, signinWithAddress } = get();
    const message = `test message`;
    const network = getNetwork("klaytn");
    const account = await getAccount(network.provider, network.networkId);
    if (!account) return;
    const signmessage = await generateSignMessage(account as string, message);
    const signaddress = await signKaikas(signmessage, account);
    setSignature({ signchain: "kaikas", signmessage, signaddress });
  },

  signWalletConnect: async (method: types.LoginMethod) => {
    const { networks, connector, signinWithAddress, signMessage } = get();
    //! wallet connect network 가져오는 방법??
    if (!signMessage) return;
    const network = networks.find((net) => net.provider === method);
    if (!network) throw new Error("네트워크를 찾을 수 없습니다.");
    // if (network.networkId !== connector.chainId) {
    //   console.log(network.networkId, connector.chainId);
    //   set({ signStatus: "network-diff" });
    //   throw new Error();
    // }
    const params = [signMessage, connector.accounts[0]];
    const signaddress = await walletConnect.personalSign(connector, params);

    setSignature({ signchain: "metamask", signmessage: signMessage, signaddress });
    await signinWithAddress(network.id);
    set({ loginMethod: "ethereum" });
  },

  sign: async (loginMethod: types.LoginMethod) => {
    const { signMetaMask, signKaikas, signWalletConnect } = get();
    loginMethod === "ethereum" ? await signMetaMask("ethereum") : loginMethod === "klaytn" && (await signKaikas());
    // : loginMethod === "walletConnect" && (await signWalletConnect());
  },
  getOtp: async () => {
    const otp = await gql.generateOtp();
    set({ otp: otp.otp });
  },
  login: async (loginMethod: types.LoginMethod) => {
    const { signExpired, sign, getNetwork, signinWithAddress } = get();
    // if (signExpired) return;
    const networkProvider = loginMethod as cnst.NetworkProvider;
    try {
      await sign(loginMethod);
      const network = getNetwork(networkProvider);
      await signinWithAddress(network.id);

      // setTimeout(() => set({ signExpired: true }), 6000 * 10);
      set({ loginMethod, signExpired: false });
    } catch (err) {
      set({ loginMethod: "none", isOpenModal: false });
      throw new Error();
    }
  },
  loginWithOtp: async () => {
    const url = new URL(window.location.href);
    const idx = url.search.indexOf("=");
    const otp = url.search.slice(idx + 1, url.search.length);
    if (!otp) return;
    const accessToken = await gql.signinWithOtp(otp);
    setToken(accessToken);
  },
}));
export const keyringStore = createSelectors(useKeyring);
