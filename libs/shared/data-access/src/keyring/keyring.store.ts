/* eslint-disable @typescript-eslint/no-var-requires */
import { MetaMaskInpageProvider } from "@metamask/providers";
import {
  getAccount,
  signKaikas,
  signMetamask,
  walletConnect,
  client,
  createActions,
  createState,
  makeStore,
  SetGet,
  Get,
} from "@shared/util-client";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { cnst, Utils } from "@shared/util";
import create, { StateCreator } from "zustand";
import * as gql from "../gql";
import { keyringGraphQL, Keyring, KeyringInput, defaultKeyring } from "./keyring.gql";
import { toast } from "react-toastify";
import { ui } from "../store";
import { message } from "antd";
import { store } from "..";

const Caver = require("caver-js");
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: any;
  }
}

const state = {
  ...createState(keyringGraphQL),
  loginMethod: "none" as gql.LoginMethod,
  me: defaultKeyring as gql.Keyring,
  accountId: "",
  password: "",
  prevPassword: "",
  networks: [] as gql.LightNetwork[],
  networkType: "testnet" as cnst.NetworkType,
  connector: new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
    qrcodeModalOptions: {
      desktopLinks: ["metamask"],
      mobileLinks: ["metamask"],
    },
  }),
  message: null as string | null,
  signExpired: false,
  signMessage: null as string | null,
  isOpenModal: false,
  otp: null as string | null,
  signStatus: "none" as "none" | "connect" | "signed" | "network-diff",
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(keyringGraphQL, { get, set }),
  initAuth: async () => {
    const me = await gql.myKeyring();
    set({ me, loginMethod: "password" });
  },
  init: async () => {
    const { networkType } = ui.getState() as any;
    const { listNetwork: networks } = await gql.listNetwork({ type: networkType });
    set({ networks, keyringOperation: "idle", networkType });
  },
  signinWithPassword: async () => {
    const { accountId, password } = get();
    message.open({ key: "signin", type: "loading", content: "Signing in..." });
    try {
      const token = await gql.signinWithPassword(accountId, password);
      await ui.getState().login({ auth: "user", type: "signin", token });
      set({ accountId: "", password: "" });
      message.open({ key: "signin", type: "success", content: "Logged in" });
    } catch (err) {
      message.open({ key: "signin", type: "error", content: err.message });
    }
  },
  signupWithPassword: async () => {
    const { accountId, password } = get();
    message.open({ key: "signup", type: "loading", content: "Signing up..." });
    try {
      set({ loginMethod: "password" });
      const token = await gql.signupWithPassword(accountId, password);
      await ui.getState().login({ auth: "user", type: "signup", token });
      set({ accountId: "", password: "" });
      message.open({ key: "signup", type: "success", content: "Logged in" });
    } catch (err) {
      message.open({ key: "signup", type: "error", content: err.message });
    }
  },
  changePassword: async () => {
    const { me, password, prevPassword } = get();
    if (!me) return;
    const token = await gql.changePassword(me.id, password, prevPassword);
    await client.setToken(token);
    localStorage.setItem("currentUser", token);
  },

  signMetaMask: async (signchain: gql.MetamaskProvider) => {
    const { networks, networkType } = get();
    const message = `test message`;
    const network = getNetwork(signchain, networks, networkType);
    const account = await getAccount(network.provider, network.networkId);
    if (!account) return;
    const signmessage = await generateSignMessage(account as string, message);
    const signaddress = await signMetamask(signmessage, account);
    if (!signaddress) return;
    // client.sign({ signchain: "metamask", signmessage, signaddress });
  },

  signKaikas: async () => {
    const { networks, networkType } = get();
    const message = `test message`;
    const network = getNetwork("klaytn", networks, networkType);
    const account = await getAccount(network.provider, network.networkId);
    if (!account) return;
    const signmessage = await generateSignMessage(account as string, message);
    const signaddress = await signKaikas(signmessage, account);
    // client.sign({ signchain: "kaikas", signmessage, signaddress });
  },

  signWalletConnect: async (method: gql.LoginMethod) => {
    const { networks, connector, signMessage } = get();
    //! wallet connect network 가져오는 방법??
    if (!signMessage) return;
    const network = networks.find((net) => net.provider === method);
    if (!network) throw new Error("네트워크를 찾을 수 없습니다.");

    const params = [signMessage, connector.accounts[0]];
    const signaddress = await walletConnect.personalSign(connector, params);

    // client.sign({ signchain: "metamask", signmessage: signMessage, signaddress });
    const token = await gql.signinWithAddress(network.id);
    await ui.getState().login({ auth: "user", type: "signin", token });
    set({ loginMethod: "ethereum" });
  },
  sign: async (loginMethod: gql.LoginMethod) => {
    const { signMetaMask, signKaikas, signWalletConnect } = get() as Get<typeof state, typeof actions>;
    loginMethod === "ethereum" ? await signMetaMask("ethereum") : loginMethod === "klaytn" && (await signKaikas());
    // : loginMethod === "walletConnect" && (await signWalletConnect());
  },

  getOtp: async () => {
    const otp = await gql.generateOtp();
    set({ otp: otp.otp });
  },
  login: async (loginMethod: gql.LoginMethod) => {
    const { signExpired, sign, networks, networkType } = get() as Get<typeof state, typeof actions>;
    // if (signExpired) return;
    const networkProvider = loginMethod as cnst.NetworkProvider;
    try {
      await sign(loginMethod);
      const network = getNetwork(networkProvider, networks, networkType);
      const token = await gql.signinWithAddress(network.id);
      await ui.getState().login({ auth: "user", type: "signin", token });
      // setTimeout(() => set({ signExpired: true }), 6000 * 10);
      set({ loginMethod, signExpired: false });
    } catch (err) {
      set({ loginMethod: "none", isOpenModal: false });
      throw new Error();
    }
  },
  logout: () => {
    ui.getState().logout();
    set({ me: defaultKeyring as Keyring });
  },
  loginWithOtp: async () => {
    const url = new URL(window.location.href);
    const idx = url.search.indexOf("=");
    const otp = url.search.slice(idx + 1, url.search.length);
    if (!otp) return;
    const accessToken = await gql.signinWithOtp(otp);
    client.setToken(accessToken);
  },
});

//! temp

const getNetwork = (provider: cnst.NetworkProvider, networks: gql.LightNetwork[], networkType: cnst.NetworkType) => {
  const network = networks.find((network) => network.provider === provider && network.type === networkType);
  if (!network) throw new Error("can not found network.");
  return network;
};
export const generateSignMessage = async (address: string, signMessage?: string) => {
  const message = signMessage ?? "test message";
  const hash = await gql.encrypt(address as string);
  return `${message} token:[${hash}] timeStamp:${new Date().getTime()}`;
};

export const keyring = makeStore(keyringGraphQL.refName, state, actions);
