import { Get, SetGet, State } from "@shared/util-client";
import type { RootState } from "../store";
import * as gql from "../gql";
import * as slice from "../slice";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = ({ set, get, pick }: SetGet<slice.WalletSliceState>) => ({
  ...slice.makeWalletSlice({ set, get, pick }),
  activeWallets: [] as gql.Wallet[],
  wallets: [] as gql.Wallet[],
  newAddress: "", // wallet 추가시, 새 address
  newActiveProvider: "klaytn" as any,
  newNetworkId: "",
  deleteKeyringId: "",
  deleteWalletId: "",
  errorMsg: "",
  newWalletOperation: "sleep" as "sleep" | "idle" | "registered" | "needDelete", // wallet 추가 상태
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
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
  // keyringHasWallet: async () => {
  //   const { newNetworkId, newAddress } = get();
  //   if (!newNetworkId) return;
  //   const keyrings = await gql.keyringHasWallet(newNetworkId);
  //   let walletId = "";
  //   keyrings.forEach((keyring) => {
  //     walletId = keyring.wallets.find((wallet) => wallet.address === newAddress)?.id || walletId;
  //   });
  //   if (keyrings.length)
  //     set({
  //       deleteKeyringId: keyrings[0].id,
  //       deleteWalletId: walletId,
  //     });
  // },
  // checkNewWallet: async () => {
  //   const { newNetworkId, wallets, newAddress } = get();
  //   const keyrings = await gql.keyringHasWallet(newNetworkId);
  //   let walletId = "";
  //   keyrings.forEach((keyring) => {
  //     walletId = keyring.wallets.find((wallet) => wallet.address === newAddress)?.id || walletId;
  //   });
  //   if (wallets.some((wallet) => wallet.address.toLowerCase() === newAddress.toLowerCase())) {
  //     set({ newWalletOperation: "registered", errorMsg: "" });
  //   } else if (keyrings.length) {
  //     set({
  //       newWalletOperation: "needDelete",
  //       deleteKeyringId: keyrings[0].id,
  //       deleteWalletId: walletId,
  //       errorMsg: "",
  //     });
  //   } else {
  //     set({ newWalletOperation: "idle", errorMsg: "" });
  //   }
  // },
});

export type WalletState = State<typeof state, typeof actions>;
// * 3. ChildSlice를 추가하세요. Suffix 규칙은 일반적으로 "InModel" as const 로 작성합니다.
export const addWalletToStore = ({ set, get, pick }: SetGet<WalletState>) => ({
  ...state({ set, get, pick }),
  ...actions({ set, get, pick }),
});
