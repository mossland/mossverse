import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { Utils } from "@shared/util";
import { createSelectors, Nullable } from "@shared/util-client";
import { Vector3 } from "three";

type State = Nullable<types.Map> & {
  modalOpen: boolean;
  loadModalOpen: boolean;
  map: types.Map | null;
  maps: types.Map[];
  selectIds: types.ID[];
  views: types.MapView[];
  edit: types.Interaction | null;
  editMode: types.EditMode;
  mainTool: types.MainTool;
  pointer: Vector3;
  daylight: "day" | "night";
  operation: "sleep" | "idle" | "loading";
};
const initialState: State = {
  ...types.defaultMap, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  loadModalOpen: false, // 기타 커스텀 모달
  map: null, // 1개 조회/작업 시 사용되는 필드
  maps: [], // 여러개 조회 시 사용
  selectIds: [],
  views: types.defaultEditorMapView,
  edit: null,
  editMode: "select",
  mainTool: "assets",
  pointer: new Vector3(0, 0, 0),
  daylight: "day",
  operation: "sleep", // init여부 확인
};
type Actions = {
  init: (mode: "editor" | "game") => Promise<void>; // 초기화
  purify: () => types.MapInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: (overwrite?: boolean) => Promise<void>; // 수정
  remove: () => Promise<void>; // 제거
  reset: (map?: types.Map) => void; // 수정필드 리셋
  addMapFiles: (fileList: FileList, type: types.LayerType, mapId?: types.ID) => Promise<void>;
};
export const useMap = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async (mode: "editor" | "game") => {
    const { operation } = get();
    if (operation !== "sleep") return;
    const maps = await gql.maps({});
    set({
      maps,
      map: mode === "game" ? maps.at(-1) : null,
      views: mode === "game" ? types.defaultGameMapView : types.defaultEditorMapView,
      operation: "idle",
    });
  },
  purify: () => {
    const state = get();
    try {
      const map = types.purifyMap(state as types.Map);
      return map;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  create: async () => {
    const { purify, maps, reset } = get();
    const mapInput = purify();
    if (!mapInput) return;
    const map = await gql.createMap(mapInput);
    set({ maps: [...maps, map] });
    reset(map);
  },
  update: async (overwrite?: boolean) => {
    console.log(get());
    const { purify, id, maps, reset } = get();
    const input = purify();
    const idx = maps.findIndex((map) => map.id === id);
    if (!input || !id || idx === -1) return;
    const map = await gql.updateMap(id, input);
    set({ maps: maps.map((m) => (m.id === id ? map : m)) });
    overwrite && reset(map);
  },
  remove: async () => {
    //
  },
  reset: (map?: types.Map) => set({ ...types.defaultMap, ...(map ?? {}), modalOpen: false, loadModalOpen: false, map }),
  addMapFiles: async (fileList, type, mapId) => {
    const [file] = await gql.addMapFiles(fileList, mapId);
    set(Utils.update(type, file));
  },
}));
export const mapStore = createSelectors(useMap);
