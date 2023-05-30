import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState } from "@util/client";
import type { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.mocWalletGraphQL),

  depositAddress: "",
  depositAmount: 0,
  understand: false,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.mocWalletGraphQL, { set, get, pick }),
  //
  deposit: async (selfId: string) => set({ mocWallet: await fetch.deposit(selfId) }),
  withdraw: async (selfId: string, address: string, amount: number) => {
    const { setReceipt, refreshReceipt, refreshOwnership } = get() as RootState;
    const receipt = await fetch.withdraw(selfId, address, amount);
    setReceipt(receipt);
    await refreshReceipt({ invalidate: true });
    await refreshOwnership({ invalidate: true });
  },
});

export type MocWalletState = Get<typeof state, typeof actions>;
export type MocWalletSlice = Slice<"mocWallet", MocWalletState>;
export const makeMocWalletSlice = createSlicer("mocWallet" as const, state, actions);
