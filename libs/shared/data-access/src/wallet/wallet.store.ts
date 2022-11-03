import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { Wallet, walletGraphQL, WalletInput } from "./wallet.gql";
import * as utils from "./wallet.utils";

type State = DefaultState<"wallet", gql.Wallet> & {
  activeWallets: gql.Wallet[];
  newAddress: string;
  newActiveProvider: gql.LoginMethod;
  newNetworkId: string;
  deleteKeyringId: string;
  deleteWalletId: string;
  errorMsg: string;
  newWalletOperation: "sleep" | "idle" | "registered" | "needDelete";
};
const initialState: State = {
  ...createState<"wallet", gql.Wallet, gql.WalletInput>(walletGraphQL),
  activeWallets: [],
  newAddress: "", // wallet 추가시, 새 address
  newActiveProvider: "klaytn",
  newNetworkId: "",
  deleteKeyringId: "",
  deleteWalletId: "",
  errorMsg: "",
  newWalletOperation: "sleep", // wallet 추가 상태
};
type Actions = Omit<DefaultActions<"wallet", gql.Wallet, gql.WalletInput>, "removeWallet"> & {
  init: (wallets: gql.Wallet[]) => Promise<void>; // 초기화
  checkWalletChange: () => Promise<void>; // wallet 변경 체크
  updateCurrentWallet: (newAddress: string, provider: gql.LoginMethod) => void;
  addWallet: (keyringId: string) => Promise<gql.Keyring>;
  removeWallet: (keyringId: string, walletId: string, address: string) => Promise<void>;
  checkNewWallet: () => Promise<void>; // TODO : delte
  keyringHasWallet: () => Promise<boolean>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"wallet", gql.Wallet, gql.WalletInput>(walletGraphQL, { get, set }),
  init: async (wallets) => {
    const activeWallets: gql.Wallet[] = [];

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
        set({ errorMsg: "Cannot Empty All Wallets" });
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
      set({ newWalletOperation: "registered", errorMsg: "" });
    } else if (keyrings.length) {
      set({
        newWalletOperation: "needDelete",
        deleteKeyringId: keyrings[0].id,
        deleteWalletId: walletId,
        errorMsg: "",
      });
    } else {
      set({ newWalletOperation: "idle", errorMsg: "" });
    }
  },
}));
export const wallet = generateStore(store);
