import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState } from "@util/client";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.dialogGraphQL),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.dialogGraphQL, { set, get, pick }),
  //
  //
});

export type DialogState = Get<typeof state, typeof actions>;
export type DialogSlice = Slice<"dialog", DialogState>;
export const makeDialogSlice = createSlicer("dialog" as const, state, actions);
