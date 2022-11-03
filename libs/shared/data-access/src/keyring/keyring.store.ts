/* eslint-disable @typescript-eslint/no-var-requires */
import { MetaMaskInpageProvider } from "@metamask/providers";
import { getAccount, signKaikas, signMetamask, walletConnect, setSignature, setToken } from "@shared/util-client";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { cnst, Utils } from "@shared/util";
import create from "zustand";
import * as gql from "../gql";
import { setLink, createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { keyringGraphQL, Keyring, KeyringInput } from "./keyring.gql";
import { toast } from "react-toastify";
import { ui } from "../store";
import { subscribeWithSelector } from "zustand/middleware";

const Caver = require("caver-js");
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: any;
  }
}

type State = DefaultState<"keyring", gql.Keyring> & {
  loginMethod: gql.LoginMethod;
  me: gql.Keyring | null;
  accountId: string;
  password: string;
  prevPassword: string;
  networks: gql.Network[];
  isOpenModal: boolean;
  networkType: cnst.NetworkType;
  signExpired: boolean;
  signMessage: string | null;
  connector: WalletConnect;
  otp: string | null;
  signStatus: "none" | "connect" | "signed" | "network-diff";
};
const initialState: State = {
  ...createState<"keyring", gql.Keyring, gql.KeyringInput>(keyringGraphQL),
  loginMethod: "none",
  me: null,
  accountId: "qwer@qwer.com",
  password: "qwer1234",
  prevPassword: "",
  networks: [],
  networkType: "testnet",
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
};
type Actions = DefaultActions<"keyring", gql.Keyring, gql.KeyringInput> & {
  initAuth: () => Promise<void>; // 초기화
  init: () => Promise<void>; // 초기화
  login: (connect: gql.LoginMethod) => Promise<void>;
  sign: (connect: gql.LoginMethod) => Promise<void>;
  getNetwork: (provider: cnst.NetworkProvider) => gql.Network;
  signKaikas: () => Promise<void>;
  getOtp: () => Promise<void>;
  signMetaMask: (signchain: gql.MetamaskProvider) => Promise<void>;
  signWalletConnect: (method: gql.LoginMethod) => Promise<void>;
  signinWithPassword: () => Promise<void>;
  signupWithPassword: () => Promise<void>;
  changePassword: () => Promise<void>;
  generateSignMessage: (address: string, signMessage?: string) => Promise<string>;
};
const store = create(
  subscribeWithSelector<State & Actions>((set, get) => ({
    ...initialState,
    ...createActions<"keyring", gql.Keyring, gql.KeyringInput>(keyringGraphQL, { get, set }),
    initAuth: async () => {
      const me = await gql.myKeyring();
      set({ me, loginMethod: "password" });
    },
    init: async () => {
      const { networkType } = ui.getState();
      const { listNetwork: networks } = await gql.listNetwork({ type: networkType });
      set({ networks, operation: "idle", networkType });
    },
    signinWithPassword: async () => {
      const { accountId, password } = get();
      try {
        const token = await gql.signinWithPassword(accountId, password);
        await ui.getState().login(token);
      } catch (err) {
        toast.error(err);
      }
    },
    signupWithPassword: async () => {
      const { accountId, password } = get();
      try {
        set({ loginMethod: "password" });
        const token = await gql.signupWithPassword(accountId, password);
        await ui.getState().login(token);
      } catch (err) {
        toast.error(err);
      }
    },
    changePassword: async () => {
      const { id, password, prevPassword } = get();
      const token = await gql.changePassword(id, password, prevPassword);
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

    signMetaMask: async (signchain: gql.MetamaskProvider) => {
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

    signWalletConnect: async (method: gql.LoginMethod) => {
      const { networks, connector, signMessage } = get();
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
      const token = await gql.signinWithAddress(network.id);
      ui.getState().login(token);
      set({ loginMethod: "ethereum" });
    },
    sign: async (loginMethod: gql.LoginMethod) => {
      const { signMetaMask, signKaikas, signWalletConnect } = get();
      loginMethod === "ethereum" ? await signMetaMask("ethereum") : loginMethod === "klaytn" && (await signKaikas());
      // : loginMethod === "walletConnect" && (await signWalletConnect());
    },
    getOtp: async () => {
      const otp = await gql.generateOtp();
      set({ otp: otp.otp });
    },
    login: async (loginMethod: gql.LoginMethod) => {
      const { signExpired, sign, getNetwork } = get();
      // if (signExpired) return;
      const networkProvider = loginMethod as cnst.NetworkProvider;
      try {
        await sign(loginMethod);
        const network = getNetwork(networkProvider);
        const token = await gql.signinWithAddress(network.id);
        ui.getState().login(token);
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
  }))
);
export const keyring = generateStore(store);
