import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { mapGraphQL, Map, MapInput } from "./map.gql";
import { Utils } from "@shared/util";
import { Vector3 } from "three";

type State = DefaultState<"map", gql.Map> & {
  loadModalOpen: boolean;
  selectIds: string[];
  views: gql.MapView[];
  edit: gql.Interaction | null;
  editMode: gql.EditMode;
  mainTool: gql.MainTool;
  pointer: Vector3;
  daylight: "day" | "night";
  adminOperation: "sleep" | "idle" | "loading";
};
const initialState: State = {
  ...createState<"map", gql.Map, gql.MapInput>(mapGraphQL),
  loadModalOpen: false, // 기타 커스텀 모달
  selectIds: [],
  views: gql.defaultEditorMapView,
  edit: null,
  editMode: "select",
  mainTool: "assets",
  pointer: new Vector3(0, 0, 0),
  daylight: "day",
  adminOperation: "sleep",
};
type Actions = DefaultActions<"map", gql.Map, gql.MapInput> & {
  init: (mode: "editor" | "game") => Promise<void>; // 초기화
  addMapFiles: (fileList: FileList, type: gql.LayerType, mapId?: string) => Promise<void>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"map", gql.Map, gql.MapInput>(mapGraphQL, { get, set }),
  init: async (mode: "editor" | "game") => {
    const { operation } = get();
    const { listMap } = await gql.listMap({});
    console.log(listMap[0]);
    set({
      mapList: listMap,
      map: mode === "game" ? listMap[0] : null,
      views: mode === "game" ? gql.defaultGameMapView : gql.defaultEditorMapView,
      operation: "idle",
    });
  },
  addMapFiles: async (fileList, type, mapId) => {
    const [file] = await gql.addMapFiles(fileList, mapId);
    set(Utils.update(type, file));
  },
}));
export const map = generateStore(store);
