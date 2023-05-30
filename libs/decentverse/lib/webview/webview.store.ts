import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState } from "@util/client";
import { Vector3 } from "three";
import type { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.webviewGraphQL),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.webviewGraphQL, { set, get, pick }),
  movePointerOnWebview: (point: Vector3) => {
    const { webviewForm } = pick("webviewForm");
    if (!webviewForm.wh.length)
      set((state: RootState) => {
        state.mouse = point;
        state.webviewForm.center = [point.x, point.y];
      });
    else
      set((state: RootState) => {
        state.mouse = point;
        Object.assign(state.webviewForm, {
          center: [(state.click.x + point.x) / 2, (state.click.y + point.y) / 2],
          wh: [Math.abs(state.click.x - point.x), Math.abs(state.click.y - point.y)],
        });
      });
  },
  clickPointerOnWebview: async (point: Vector3) => {
    const { webviewForm, createWebview } = get() as RootState;
    if (!webviewForm.wh.length)
      set((state: RootState) => {
        state.click = point;
        state.webviewForm.wh = [0, 0];
      });
    else await createWebview({ modal: "edit" });
  },
  //
});

export type WebviewState = Get<typeof state, typeof actions>;
export type WebviewSlice = Slice<"webview", WebviewState>;
export const makeWebviewSlice = createSlicer("webview" as const, state, actions);
