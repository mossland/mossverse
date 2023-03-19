import * as gql from "../gql";
import { createActions, createState, SetGet, Slice, Get, createSlicer, client, SetPick } from "@shared/util-client";
import type { RootState } from "../store";

// ? Slice는 재사용가능한 상태와 액션을 정의합니다. 외부 상태를 가져다쓰지 않는 경우에만 사용하세요.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget, suffix: string) => ({
  ...createState(gql.raffleGraphQL),
  ...createActions(gql.raffleGraphQL, setget, suffix),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, pick }: SetPick<typeof state>, suffix: string) => ({
  //
});

export type RaffleSliceState = Get<typeof state, typeof actions>;
export type RaffleSlice = Slice<"raffle", RaffleSliceState>;
export const makeRaffleSlice = createSlicer("raffle" as const, state, actions);
