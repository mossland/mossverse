import { SetGet, State } from "@shared/util-client";
import type { RootState } from "../store";
import * as gql from "../gql";
import * as slice from "../slice";
import { Vector3 } from "three";
import { cnst } from "@shared/util";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = ({ set, get, pick }: SetGet<slice.MapSliceState>) => ({
  ...slice.makeMapSlice({ set, get, pick }),
  click: new Vector3(0, 0, 0),
  mouse: new Vector3(0, 0, 0),
  keyboard: { ...gql.defaultKeyboard },
  keyLock: false,
  cameraPos: [0, 0, 0] as [number, number, number],
  mapLayerView: gql.mapPlayerLayerView,
  mapDaylight: "day" as "day" | "night",
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  //
});

export type MapState = State<typeof state, typeof actions>;
// * 3. ChildSlice를 추가하세요. Suffix 규칙은 일반적으로 "InModel" as const 로 작성합니다.
export const addMapToStore = ({ set, get, pick }: SetGet<MapState>) => ({
  ...state({ set, get, pick }),
  ...actions({ set, get, pick }),
});
