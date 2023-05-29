import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState } from "@util/client";
import dayjs from "dayjs";
import type { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.stakePoolGraphQL),
  stakeValue: 0,
  stakeHour: 24,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.stakePoolGraphQL, { set, get, pick }),
  addStaking: async (stakePoolId: string) => {
    const { self, ownershipMap, showMessage, myKeyring } = get() as RootState;
    const { stakeHour, stakeValue } = get();
    if (ownershipMap === "loading") throw new Error("ownershipMap is loading");
    const mmoc = fetch.shared.Ownership.getValue([...ownershipMap.values()], "MMOC");
    if (!mmoc || mmoc < stakeValue) throw new Error("Not enough MMOC");
    const wallet = myKeyring.wallets[0];
    const expireAt = dayjs().add(stakeHour, "hour");
    const staking = fetch.platform.purifyStaking({
      wallet,
      expireAt,
      user: self,
      value: stakeValue,
      stakingAt: dayjs(),
    });
    if (!staking) throw new Error("staking is null");
    const newStakePool = await fetch.addStaking(stakePoolId, staking);
    set({ stakePool: newStakePool });
    showMessage({ content: "예치 완료!", duration: 3000, type: "success" });
  },
});

export type StakePoolState = Get<typeof state, typeof actions>;
export type StakePoolSlice = Slice<"stakePool", StakePoolState>;
export const makeStakePoolSlice = createSlicer("stakePool" as const, state, actions);
