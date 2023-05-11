import { MetaMaskInpageProvider } from "@metamask/providers";
import { client, State, Get, WalletType, LoginForm, pageMap, SetGet, trying } from "@shared/util-client";
import { Utils } from "@shared/util";
import dayjs, { Dayjs } from "dayjs";
import type { RootState } from "../store";
import * as gql from "../gql";
import * as slice from "../slice";
import { message } from "antd";
import Router from "next/router";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: any;
  }
}

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = ({ set, get, pick }: SetGet<slice.KeyringSliceState>) => ({
  ...slice.makeKeyringSlice({ set, get, pick }),
  myKeyring: gql.defaultKeyring as gql.Keyring,
  signupKeyring: null as gql.Keyring | null, // 회원가입용 keyring
  password: "",
  passwordConfirm: "",
  prevPassword: "",
  phoneCode: "",
  phoneCodeAt: null as Dayjs | null,
  turnstileToken: null as string | null,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  initUserAuth: async () => set({ myKeyring: await gql.myKeyring() }),
  signupWallet: async (type: WalletType, network: gql.LightNetwork, loginForm?: Partial<LoginForm>) => {
    const { signupKeyring } = get();
    await client.setWallet(type);
    const keyring = await trying("Sign up wallet", async () => gql.signupWallet(network.id, signupKeyring?.id));
    if (!loginForm) return set({ signupKeyring: keyring });
    await gql.activateUser(keyring.id);
    const { signinWallet } = get() as RootState;
    await signinWallet(type, network, loginForm);
  },
  signinWallet: async (type: WalletType, network: gql.LightNetwork, loginForm: Partial<LoginForm> = {}) => {
    const { login } = get() as RootState;
    await client.setWallet(type);
    trying("Sign in", async () => {
      const jwt = await gql.signinWallet(network.id);
      await login({ auth: "user", jwt, ...loginForm });
    });
    set({ signupKeyring: null });
  },
  signuporinWallet: async (type: WalletType, network: gql.LightNetwork, loginForm: Partial<LoginForm> = {}) => {
    const { signupWallet, signinWallet } = get() as RootState;
    await client.setWallet(type);
    const keyringId = await gql.getKeyringIdHasWallet(network.id);
    if (keyringId) return await signinWallet(type, network, loginForm);
    else return await signupWallet(type, network, loginForm);
  },
  signaddWallet: async (network: gql.LightNetwork) => {
    const { myKeyring } = get();
    const keyring = await trying("Add wallet", async () => {
      await client.setWallet(pageMap.isMobile ? "walletConnect" : "metamask");
      const address = await client.wallet.getAccount();
      if (myKeyring.wallets.some((wallet) => wallet.address === address)) throw new Error("Already added");
      return await gql.signaddWallet(network.id);
    });
    set({ myKeyring: keyring, keyringModal: null });
  },
  signsubWallet: async (wallet: gql.LightWallet) => {
    const myKeyring = await trying("Remove wallet", gql.signsubWallet(wallet.id));
    set({ myKeyring, keyringModal: null });
  },
  signupPassword: async (loginForm?: Partial<LoginForm>) => {
    const { signupKeyring, keyringForm, password, turnstileToken } = get();
    if (!turnstileToken) return;
    const keyring = await trying(
      "Sign up",
      gql.signupPassword(keyringForm.accountId ?? "", password, turnstileToken, signupKeyring?.id)
    );
    if (!loginForm) return set({ password: "", signupKeyring: keyring, keyringForm: { ...gql.defaultKeyring } });
    await gql.activateUser(keyring.id);
    Router.push("/signin");
  },
  signinPassword: async (loginForm: Partial<LoginForm> = {}) => {
    const { keyringForm, password, turnstileToken } = pick("keyringForm", "password", "turnstileToken");
    const { login } = get() as RootState;
    await trying("Sign in", async () => {
      const jwt = await gql.signinPassword(keyringForm.accountId ?? "", password, turnstileToken);
      await login({ auth: "user", jwt, ...loginForm });
    });
    set({ password: "", turnstileToken: null, keyringForm: { ...gql.defaultKeyring }, signupKeyring: null });
  },
  signaddPassword: async () => {
    const { keyringForm, password, turnstileToken } = pick("keyringForm", "password", "turnstileToken");
    const myKeyring = await gql.signaddPassword(keyringForm.accountId ?? "", password, turnstileToken);
    set({ myKeyring, password: "", passwordConfirm: "", keyringForm: { ...gql.defaultKeyring } });
  },
  changePassword: async () => {
    const { password, prevPassword, turnstileToken } = pick("password", "prevPassword", "turnstileToken");
    if (!window.confirm("Do you want to change your password?")) return;
    await trying("Change password", gql.changePassword(password, prevPassword, turnstileToken));
    set({ keyringModal: null, password: "", prevPassword: "", turnstileToken: null });
  },
  changePasswordWithPhone: async () => {
    const { myKeyring, password, phoneCode } = pick("myKeyring", "password", "phoneCode");
    if (!myKeyring.phone) throw new Error("No phone number");
    if (!window.confirm("Do you want to change your password?")) return;
    await trying("Change password", gql.changePasswordWithPhone(password, myKeyring.phone, phoneCode));
    set({ keyringModal: null, password: "", phoneCode: "", phoneCodeAt: null });
  },
  resetPassword: async () => {
    const { keyringForm, resetKeyring } = get() as RootState;
    await gql.resetPassword(keyringForm.accountId ?? "");
    message.success("Reset password request sent. Please check your email.");
    resetKeyring();
  },
  requestPhoneCode: async (keyringId: string, phone: string, hash = "signin") => {
    if (dayjs().subtract(5, "seconds").isBefore(get().phoneCodeAt)) return;
    const phoneCodeAt = await trying("Phone code request", gql.requestPhoneCode(keyringId, phone, hash));
    set({ phoneCodeAt, phoneCode: "" });
  },
  verifyPhoneCode: async () => {
    const { myKeyring, phoneCode } = pick("myKeyring", "phoneCode");
    if (!myKeyring.phone) throw new Error("No phone number");
    const keyring = await trying("Verify phone code", gql.verifyPhoneCode(myKeyring.id, myKeyring.phone, phoneCode));
    set({ myKeyring: keyring });
  },
  signupPhone: async (loginForm?: Partial<LoginForm>) => {
    const { signupKeyring, phoneCode } = pick("signupKeyring", "phoneCode");
    if (!signupKeyring.phone || !Utils.isPhoneNumber(signupKeyring.phone)) return;
    await gql.verifyPhoneCode(signupKeyring.id, signupKeyring.phone, phoneCode);
    const keyring = await gql.signupPhone(signupKeyring.id, signupKeyring.phone, phoneCode);
    if (!loginForm) return set({ signupKeyring: keyring, phoneCode: "", phoneCodeAt: null });
    await gql.activateUser(keyring.id);
    const { signinPhone } = get() as RootState;
    await signinPhone(keyring.id, loginForm);
  },
  signaddPhone: async (hash?: string) => {
    const { myKeyring, phoneCode } = pick("myKeyring", "phoneCode");
    if (!myKeyring.phone || !Utils.isPhoneNumber(myKeyring.phone)) return;
    set({ myKeyring: await gql.signaddPhone(myKeyring.phone, phoneCode), phoneCodeAt: null, phoneCode: "" });
  },
  signinPhone: async (keyringId: string, loginForm: Partial<LoginForm> = {}) => {
    const { login, phoneCode, keyringForm } = get() as RootState;
    if (!keyringForm.phone || !Utils.isPhoneNumber(keyringForm.phone)) return;
    const jwt = await gql.signinPhone(keyringId, keyringForm.phone, phoneCode);
    await login({ auth: "user", jwt, ...loginForm });
    set({ phoneCodeAt: null, phoneCode: "", signupKeyring: null });
  },
});

export type KeyringState = State<typeof state, typeof actions>;
// * 3. ChildSlice를 추가하세요. Suffix 규칙은 일반적으로 "InModel" as const 로 작성합니다.
export const addKeyringToStore = ({ set, get, pick }: SetGet<KeyringState>) => ({
  ...state({ set, get, pick }),
  ...actions({ set, get, pick }),
});
