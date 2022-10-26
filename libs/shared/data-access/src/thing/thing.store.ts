import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { createSelectors, Nullable } from "@shared/util-client";
import { Utils } from "@shared/util";

type State = Nullable<types.Thing> & {
  modalOpen: boolean;
  thing: types.Thing | null;
  things: types.Thing[];
  operation: "sleep" | "idle" | "loading";
};
const initialState: State = {
  ...types.defaultThing, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  thing: null, // 1개 조회/작업 시 사용되는 필드
  things: [], // 여러개 조회 시 사용
  operation: "sleep", // init여부 확인
};
type Actions = {
  init: () => Promise<void>; // 초기화
  purify: () => types.ThingInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (thing?: types.Thing) => void; // 수정필드 리셋
  addThingFiles: (fileList: FileList, thingId?: types.ID) => Promise<void>;
};
export const useThing = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async () => {
    const things = await gql.things({});
    set({ things, operation: "idle" });
  },
  purify: () => {
    const state = get();
    try {
      const thing = types.purifyThing(state as types.Thing);
      return thing;
    } catch (err) {
      return null;
    }
  },
  create: async () => {
    const { purify, things, reset } = get();
    const input = purify();
    if (!input) return;
    const thing = await gql.createThing(input);
    if (!thing) return;
    set({ things: [...things, thing] });
    reset(thing);
  },
  update: async () => {
    const { purify, things, id, reset } = get();
    const input = purify();
    if (!input || !id) return;
    const thing = input && (await gql.updateThing(id, input));
    set({ things: [thing, ...things.filter((a) => a.id !== thing.id)] });
    reset(thing);
  },
  remove: async (id: string) => {
    const { things } = get();
    await gql.removeThing(id);
    set({ things: [...things.filter((a) => a.id !== id)] });
  },
  reset: (thing) => set({ ...types.defaultThing, thing, modalOpen: false }),
  addThingFiles: async (fileList, thingId) => {
    const [file] = await gql.addThingFiles(fileList, thingId);
    set({ image: file });
  },
}));
export const thingStore = createSelectors(useThing);
