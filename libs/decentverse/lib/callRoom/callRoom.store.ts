import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState, defaultMyStream } from "@util/client";
import { Vector3 } from "three";
import type { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.callRoomGraphQL),
  ...defaultMyStream,
  streamSettingModal: false,
  // analyzeInterval: undefined as NodeJS.Timer | undefined,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.callRoomGraphQL, { set, get, pick }),
  movePointerOnCallRoom: (point: Vector3) => {
    const { callRoomForm } = pick("callRoomForm");
    if (!callRoomForm.wh.length) set((state) => (state.callRoomForm.center = [point.x, point.y]));
    else
      set((state: RootState) => {
        state.mouse = point;
        Object.assign(state.callRoomForm, {
          center: [(state.click.x + point.x) / 2, (state.click.y + point.y) / 2],
          wh: [Math.abs(state.click.x - point.x), Math.abs(state.click.y - point.y)],
        });
      });
  },
  clickPointerOnCallRoom: async (point: Vector3) => {
    const { callRoomForm, createCallRoom } = get() as RootState;
    if (!callRoomForm.wh.length)
      set((state: RootState) => {
        state.click = point;
        state.callRoomForm.wh = [0, 0];
      });
    else await createCallRoom({ modal: "edit" });
  },
  //
  // operateAudioAnalysing: (callback: () => void) => {
  //   const intervalId = setInterval(callback, 300);
  //   set({ analyzeInterval: intervalId });
  // },
  // operateAudioAnalysing: (callback: () => number) => {
  //   const intervalId = setInterval(() => {
  //     const { mic } = get() as RootState;
  //     const volume = callback();
  //     if (mic && volume > 0.1) set({ isTalk: true });
  //     else set({ isTalk: false });
  //   }, 300);
  //   set({ analyzeInterval: intervalId });
  // },
  // stopAudioAnalysing: () => {
  //   const { analyzeInterval } = get();
  //   clearInterval(analyzeInterval);
  //   set({ analyzeInterval: undefined, isTalk: false });
  // },
});

export type CallRoomState = Get<typeof state, typeof actions>;
export type CallRoomSlice = Slice<"callRoom", CallRoomState>;
export const makeCallRoomSlice = createSlicer("callRoom" as const, state, actions);
