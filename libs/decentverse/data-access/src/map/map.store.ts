import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { mapGraphQL, Map, MapInput } from "./map.gql";
import { Utils } from "@shared/util";
import { Vector3 } from "three";

const state = {
  ...createState(mapGraphQL),
  loadModalOpen: false, // 기타 커스텀 모달
  selectIds: [] as string[],
  views: gql.defaultEditorMapView as gql.MapView[],
  edit: null as gql.Interaction | null,
  editMode: "select" as gql.EditMode,
  mainTool: "assets" as gql.MainTool,
  pointer: new Vector3(0, 0, 0),
  daylight: "day" as "day" | "night",
  adminOperation: "sleep" as "sleep" | "idle" | "loading",
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(mapGraphQL, { get, set }),
  init: async (mode: "editor" | "game") => {
    const { listMap } = await gql.listMap({});
    const map = await gql.getMap(listMap[0].id);
    set({
      mapList: listMap,
      map: mode === "game" ? map : null,
      views: mode === "game" ? gql.defaultGameMapView : gql.defaultEditorMapView,
      mapOperation: "idle",
    });
  },
  addMapFiles: async (fileList, type, mapId) => {
    const [file] = await gql.addMapFiles(fileList, mapId);
    set(Utils.update(type, file));
  },
});
export const map = makeStore(mapGraphQL.refName, state, actions);
