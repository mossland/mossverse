import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import * as utils from "./wallet.utils";
import { createSelectors, Nullable } from "@shared/util-client";

type State = Nullable<types.Wallet> & {
  modalOpen: boolean;
  wallet: types.Wallet | null;
  wallets: types.Wallet[];
  activeWallets: types.Wallet[];
  operation: "sleep" | "idle" | "loading";
  newAddress: string;
  newActiveProvider: types.LoginMethod;
  newNetworkId: string;
  deleteKeyringId: string;
  deleteWalletId: string;
  errorMeg: string;
  newWalletOperation: "sleep" | "idle" | "registered" | "needDelete";
};
const initialState: State = {
  ...types.defaultWallet, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  wallet: null, // 1개 조회/작업 시 사용되는 필드
  wallets: [], // 여러개 조회 시 사용
  activeWallets: [],
  operation: "sleep", // init여부 확인
  newAddress: "", // wallet 추가시, 새 address
  newActiveProvider: "klaytn",
  newNetworkId: "",
  deleteKeyringId: "",
  deleteWalletId: "",
  errorMeg: "",
  newWalletOperation: "sleep", // wallet 추가 상태
};
type Actions = {
  init: (wallets: types.Wallet[]) => Promise<void>; // 초기화
  checkWalletChange: () => Promise<void>; // wallet 변경 체크
  updateCurrentWallet: (newAddress: string, provider: types.LoginMethod) => void;
  addWallet: (keyringId: string) => Promise<types.Keyring>;
  removeWallet: (keyringId: string, walletId: string, address: string) => Promise<void>;
  checkNewWallet: () => Promise<void>; // TODO : delte
  keyringHasWallet: () => Promise<boolean>;
  getCurrentAddress: () => string;
  reset: (wallet?: types.Wallet) => void; // 수정필드 리셋
};
export const useWallet = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async (wallets) => {
    const activeWallets: types.Wallet[] = [];

    if (window.ethereum.selectedAddress) {
      const currentWallet = wallets.find(
        (wallet) => wallet.network.provider === "ethereum" && wallet.address === window.ethereum.selectedAddress
      );
      currentWallet && activeWallets.push(currentWallet);
    }

    if (window.klaytn && window.klaytn.selectedAddress) {
      const currentWallet = wallets.find(
        (wallet) => wallet.network.provider === "klaytn" && wallet.address === window.klaytn.selectedAddress
      );
      currentWallet && activeWallets.push(currentWallet);
    }
    const wallet = activeWallets[0];

    set({ wallets, wallet, activeWallets, operation: "idle" });
    get().checkWalletChange();
  },
  checkWalletChange: async () => {
    const { updateCurrentWallet } = get();
    window?.klaytn?.on("accountsChanged", async ([newAddress]: string[]) => {
      updateCurrentWallet(newAddress, "klaytn");
    });
    window.ethereum.on("accountsChanged", async ([newAddress]: any) => {
      updateCurrentWallet(newAddress, "ethereum");
    });
  },
  updateCurrentWallet: (newAddress, provider) => {
    const { activeWallets, wallets, newActiveProvider } = get();

    const currentWallet = wallets.find(
      (wallet) => wallet.network.provider === provider && wallet.address === newAddress
    );
    if (currentWallet) {
      set({
        activeWallets: [...activeWallets.filter((cur) => cur.network.provider !== provider), currentWallet],
      });
    }
    if (newActiveProvider === provider) set({ newAddress });
  },
  addWallet: async (keyringId) => {
    const { newNetworkId, init } = get();
    const newKeyring = await gql.addWallet(keyringId, newNetworkId);
    await init(newKeyring.wallets);
    set({ modalOpen: false });
    return newKeyring;
  },
  removeWallet: async (keyringId, walletId, address) => {
    try {
      const { init } = get();
      const newKeyring = await gql.removeWallet(keyringId, walletId, address);
      await init(newKeyring.wallets);
      set({ newWalletOperation: "idle", modalOpen: false });
    } catch (err) {
      err instanceof Error &&
        err.message.includes("Cannot Empty All Wallets") &&
        set({ errorMeg: "Cannot Empty All Wallets" });
    }
  },
  keyringHasWallet: async () => {
    const { newNetworkId, newAddress } = get();
    if (!newNetworkId) return false;
    const keyrings = await gql.keyringHasWallet(newNetworkId);
    let walletId = "";
    keyrings.forEach((keyring) => {
      walletId = keyring.wallets.find((wallet) => wallet.address === newAddress)?.id || walletId;
    });
    if (keyrings.length) {
      set({
        deleteKeyringId: keyrings[0].id,
        deleteWalletId: walletId,
      });
      return true;
    } else {
      return false;
    }
  },
  checkNewWallet: async () => {
    const { newNetworkId, wallets, newAddress } = get();
    const keyrings = await gql.keyringHasWallet(newNetworkId);
    let walletId = "";
    keyrings.forEach((keyring) => {
      walletId = keyring.wallets.find((wallet) => wallet.address === newAddress)?.id || walletId;
    });
    if (utils.checkWalletIncluded(wallets, newAddress)) {
      set({ newWalletOperation: "registered", errorMeg: "" });
    } else if (keyrings.length) {
      set({
        newWalletOperation: "needDelete",
        deleteKeyringId: keyrings[0].id,
        deleteWalletId: walletId,
        errorMeg: "",
      });
    } else {
      set({ newWalletOperation: "idle", errorMeg: "" });
    }
  },
  getCurrentAddress: () => {
    // window.ethereum.selectedAddress
    // window.klaytn.selectedAddress
    return "";
  },
  reset: (wallet) => set({ ...types.defaultWallet, wallet }),
}));
export const walletStore = createSelectors(useWallet);
