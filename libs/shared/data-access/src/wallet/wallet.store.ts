import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, Get, makeStore, SetGet } from "@shared/util-client";
import { Wallet, walletGraphQL, WalletInput } from "./wallet.gql";
import * as utils from "./wallet.utils";

const state = {
  ...createState(walletGraphQL),
  activeWallets: [] as gql.Wallet[],
  wallets: [] as gql.Wallet[],
  newAddress: "", // wallet 추가시, 새 address
  newActiveProvider: "klaytn" as gql.LoginMethod,
  newNetworkId: "",
  deleteKeyringId: "",
  deleteWalletId: "",
  errorMsg: "",
  newWalletOperation: "sleep" as "sleep" | "idle" | "registered" | "needDelete", // wallet 추가 상태
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(walletGraphQL, { get, set }),
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

    set({ wallets, wallet, activeWallets, walletOperation: "idle" });
    (get() as Get<typeof state, typeof actions>).checkWalletChange();
  },
  checkWalletChange: async () => {
    const { updateCurrentWallet } = get() as Get<typeof state, typeof actions>;
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
    const { newNetworkId, init } = get() as Get<typeof state, typeof actions>;
    const newKeyring = await gql.addWallet(keyringId, newNetworkId);
    await init(newKeyring.wallets);
  },
  removeWallet: async (keyringId, walletId, address) => {
    try {
      const { init } = get() as Get<typeof state, typeof actions>;
      const newKeyring = await gql.removeWallet(keyringId, walletId, address);
      await init(newKeyring.wallets);
      set({ newWalletOperation: "idle" });
    } catch (err) {
      err instanceof Error &&
        err.message.includes("Cannot Empty All Wallets") &&
        set({ errorMsg: "Cannot Empty All Wallets" });
    }
  },
  keyringHasWallet: async () => {
    const { newNetworkId, newAddress } = get();
    if (!newNetworkId) return;
    const keyrings = await gql.keyringHasWallet(newNetworkId);
    let walletId = "";
    keyrings.forEach((keyring) => {
      walletId = keyring.wallets.find((wallet) => wallet.address === newAddress)?.id || walletId;
    });
    if (keyrings.length)
      set({
        deleteKeyringId: keyrings[0].id,
        deleteWalletId: walletId,
      });
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
});
export const wallet = makeStore(walletGraphQL.refName, state, actions);
