import * as gql from "../gql";
import { createActions, createState, SetGet, Slice, Get, createSlicer, SetPick } from "@shared/util-client";
import type { RootState } from "../store";
import { Vector3 } from "three";

// ? Slice는 재사용가능한 상태와 액션을 정의합니다. 외부 상태를 가져다쓰지 않는 경우에만 사용하세요.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget, suffix: string) => ({
  ...createState(gql.webviewGraphQL),
  ...createActions(gql.webviewGraphQL, setget, suffix),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, pick }: SetPick<typeof state>, suffix: string) => ({
  movePointerOnWebview: (point: Vector3) => {
    const { webviewForm } = pick("webviewForm");
    if (!webviewForm.wh.length)
      set((state: RootState) => {
        state.mouse = point;
        state[`webviewForm${suffix}`].center = [point.x, point.y];
      });
    else
      set((state: RootState) => {
        state.mouse = point;
        Object.assign(state[`webviewForm${suffix}`], {
          center: [(state.click.x + point.x) / 2, (state.click.y + point.y) / 2],
          wh: [Math.abs(state.click.x - point.x), Math.abs(state.click.y - point.y)],
        });
      });
  },
  clickPointerOnWebview: async (point: Vector3) => {
    const { webviewForm, createWebview } = pick("webviewForm", "createWebview");
    if (!webviewForm.wh.length)
      set((state: RootState) => {
        state.click = point;
        state[`webviewForm${suffix}`].wh = [0, 0];
      });
    else await createWebview({ modal: "edit" });
  },
});

export type WebviewSliceState = Get<typeof state, typeof actions>;
export type WebviewSlice = Slice<"webview", WebviewSliceState>;
export const makeWebviewSlice = createSlicer("webview" as const, state, actions);
