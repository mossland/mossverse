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
  WalletType,
} from "@shared/util-client";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { cnst, Utils } from "@shared/util";
import create, { StateCreator } from "zustand";
import * as gql from "../gql";
import { keyringGraphQL, Keyring, KeyringInput, defaultKeyring } from "./keyring.gql";
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
  me: defaultKeyring as gql.Keyring,
  accountId: "",
  password: "",
  prevPassword: "",
  connector: new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
    qrcodeModalOptions: {
      desktopLinks: ["metamask"],
      mobileLinks: ["metamask"],
    },
  }),
  isOpenModal: false,
  otp: null as string | null,
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(keyringGraphQL, { get, set }),
  initAuth: async () => {
    const me = await gql.myKeyring();
    set({ me });
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

  getOtp: async () => {
    const otp = await gql.generateOtp();
    set({ otp: otp.otp });
  },

  signinWithWallet: async (type: WalletType, network: gql.LightNetwork) => {
    await client.setWallet(type);
    const token = await gql.signinWithAddress(network.id);
    await ui.getState().login({ auth: "user", type: "autoLogin", token });
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

export const keyring = makeStore(keyringGraphQL.refName, state, actions);
