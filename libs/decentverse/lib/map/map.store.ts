import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState } from "@util/client";
import { Vector3 } from "three";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.mapGraphQL),

  click: new Vector3(0, 0, 0),
  mouse: new Vector3(0, 0, 0),
  mousePosition: "" as "" | "map" | "interface",
  keyboard: { ...fetch.defaultKeyboard },
  keyLock: false,
  cameraPos: [0, 0, 0] as [number, number, number],
  mapLayerView: fetch.mapPlayerLayerView as fetch.MapLayerView & { [key in string]: any },
  mapDaylight: "day" as "day" | "night",
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.mapGraphQL, { set, get, pick }),
  //
  //
});

export type MapState = Get<typeof state, typeof actions>;
export type MapSlice = Slice<"map", MapState>;
export const makeMapSlice = createSlicer("map" as const, state, actions);