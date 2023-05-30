import * as fetch from "../fetch";
import {
  Get,
  LoginForm,
  SetGet,
  Slice,
  Utils,
  client,
  createActions,
  createSlicer,
  createState,
  trying,
} from "@util/client";
import dayjs, { Dayjs } from "dayjs";
import type { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.keyringGraphQL),

  myKeyring: fetch.defaultKeyring as fetch.Keyring,
  signupKeyring: null as fetch.Keyring | null, // 회원가입용 keyring
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
  ...createActions(fetch.keyringGraphQL, { set, get, pick }),
  //
  initUserAuth: async () => set({ myKeyring: await fetch.myKeyring() }),
  signupWallet: async (networkId: string, loginForm?: Partial<LoginForm>) => {
    const { signupKeyring } = get();
    if (!client.isSigned()) throw new Error("Signature not set");
    const keyring = await trying("Sign up wallet", async () => fetch.signupWallet(networkId, signupKeyring?.id));
    if (!loginForm) return set({ signupKeyring: keyring });
    await fetch.activateUser(keyring.id);
    const { signinWallet } = get() as RootState;
    await signinWallet(networkId, loginForm);
  },
  signinWallet: async (networkId: string, loginForm: Partial<LoginForm> = {}) => {
    const { login } = get() as RootState;
    if (!client.isSigned()) throw new Error("Signature not set");
    trying("Sign in", async () => {
      const jwt = await fetch.signinWallet(networkId);
      await login({ auth: "user", jwt, ...loginForm });
    });
    set({ signupKeyring: null });
  },
  signuporinWallet: async (networkId: string, loginForm: Partial<LoginForm> = {}) => {
    const { signupWallet, signinWallet } = get() as RootState;
    console.log(client);
    if (!client.isSigned()) throw new Error("Signature not set");
    const keyringId = await fetch.getKeyringIdHasWallet(networkId);
    if (keyringId) return await signinWallet(networkId, loginForm);
    else return await signupWallet(networkId, loginForm);
  },
  signaddWallet: async (network: fetch.LightNetwork) => {
    const { myKeyring } = get();
    const keyring = await trying("Add wallet", async () => {
      if (!client.isSigned()) throw new Error("Signature not set");
      if (myKeyring.wallets.some((wallet) => wallet.address === client.address)) throw new Error("Already added");
      return await fetch.signaddWallet(network.id);
    });
    set({ myKeyring: keyring, keyringModal: null });
  },
  signsubWallet: async (wallet: fetch.LightWallet) => {
    const myKeyring = await trying("Remove wallet", fetch.signsubWallet(wallet.id));
    set({ myKeyring, keyringModal: null });
  },
  signupPassword: async (loginForm?: Partial<LoginForm>) => {
    const { signupKeyring, keyringForm, password, turnstileToken } = get();
    if (!turnstileToken) return;
    const keyring = await trying(
      "Sign up",
      fetch.signupPassword(keyringForm.accountId ?? "", password, turnstileToken, signupKeyring?.id)
    );
    if (!loginForm) return set({ password: "", signupKeyring: keyring, keyringForm: { ...fetch.defaultKeyring } });
    await fetch.activateUser(keyring.id);
  },
  signinPassword: async (loginForm: Partial<LoginForm> = {}) => {
    const { keyringForm, password, turnstileToken } = pick("keyringForm", "password", "turnstileToken");
    const { login } = get() as RootState;
    await trying("Sign in", async () => {
      const jwt = await fetch.signinPassword(keyringForm.accountId ?? "", password, turnstileToken);
      await login({ auth: "user", jwt, ...loginForm });
    });
    set({ password: "", turnstileToken: null, keyringForm: { ...fetch.defaultKeyring }, signupKeyring: null });
  },
  signaddPassword: async () => {
    const { keyringForm, password, turnstileToken } = pick("keyringForm", "password", "turnstileToken");
    const myKeyring = await fetch.signaddPassword(keyringForm.accountId ?? "", password, turnstileToken);
    set({
      myKeyring,
      password: "",
      passwordConfirm: "",
      keyringForm: { ...fetch.defaultKeyring },
    });
  },
  changePassword: async () => {
    const { password, prevPassword, turnstileToken } = pick("password", "prevPassword", "turnstileToken");
    if (!window.confirm("Do you want to change your password?")) return;
    await trying("Change password", fetch.changePassword(password, prevPassword, turnstileToken));
    set({ keyringModal: null, password: "", prevPassword: "", turnstileToken: null });
  },
  changePasswordWithPhone: async () => {
    const { myKeyring, password, phoneCode } = pick("myKeyring", "password", "phoneCode");
    if (!myKeyring.phone) throw new Error("No phone number");
    if (!window.confirm("Do you want to change your password?")) return;
    await trying("Change password", fetch.changePasswordWithPhone(password, myKeyring.phone, phoneCode));
    set({ keyringModal: null, password: "", phoneCode: "", phoneCodeAt: null });
  },
  resetPassword: async () => {
    const { showMessage, keyringForm, resetKeyring } = get() as RootState;
    await fetch.resetPassword(keyringForm.accountId ?? "");
    showMessage({ content: "Reset password request sent. Please check your email.", type: "success" });
    resetKeyring();
  },
  requestPhoneCode: async (keyringId: string, phone: string, hash = "signin") => {
    if (dayjs().subtract(5, "seconds").isBefore(get().phoneCodeAt)) return;
    const phoneCodeAt = await trying("Phone code request", fetch.requestPhoneCode(keyringId, phone, hash));
    set({ phoneCodeAt, phoneCode: "" });
  },
  verifyPhoneCode: async () => {
    const { myKeyring, phoneCode } = pick("myKeyring", "phoneCode");
    if (!myKeyring.phone) throw new Error("No phone number");
    const keyring = await trying("Verify phone code", fetch.verifyPhoneCode(myKeyring.id, myKeyring.phone, phoneCode));
    set({ myKeyring: keyring });
  },
  signupPhone: async (loginForm?: Partial<LoginForm>) => {
    const { signupKeyring, phoneCode } = pick("signupKeyring", "phoneCode");
    if (!signupKeyring.phone || !Utils.isPhoneNumber(signupKeyring.phone)) return;
    await fetch.verifyPhoneCode(signupKeyring.id, signupKeyring.phone, phoneCode);
    const keyring = await fetch.signupPhone(signupKeyring.id, signupKeyring.phone, phoneCode);
    if (!loginForm) return set({ signupKeyring: keyring, phoneCode: "", phoneCodeAt: null });
    await fetch.activateUser(keyring.id);
    const { signinPhone } = get() as RootState;
    await signinPhone(keyring.id, loginForm);
  },
  signaddPhone: async (hash?: string) => {
    const { myKeyring, phoneCode } = pick("myKeyring", "phoneCode");
    if (!myKeyring.phone || !Utils.isPhoneNumber(myKeyring.phone)) return;
    set({
      myKeyring: await fetch.signaddPhone(myKeyring.phone, phoneCode),
      phoneCodeAt: null,
      phoneCode: "",
    });
  },
  signinPhone: async (keyringId: string, loginForm: Partial<LoginForm> = {}) => {
    const { login, phoneCode, keyringForm } = get() as RootState;
    if (!keyringForm.phone || !Utils.isPhoneNumber(keyringForm.phone)) return;
    const jwt = await fetch.signinPhone(keyringId, keyringForm.phone, phoneCode);
    await login({ auth: "user", jwt, ...loginForm });
    set({ phoneCodeAt: null, phoneCode: "", signupKeyring: null });
  },
});

export type KeyringState = Get<typeof state, typeof actions>;
export type KeyringSlice = Slice<"keyring", KeyringState>;
export const makeKeyringSlice = createSlicer("keyring" as const, state, actions);
