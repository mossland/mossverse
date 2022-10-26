import create from "zustand";
import * as types from "./dialog.types";
import * as gql from "../gql";
import { createSelectors, Nullable } from "@shared/util-client";

type State = Nullable<types.Dialog> & {
  modalOpen: boolean;
  dialogueOpen: boolean;
  speakModalOpen: boolean;
  questionModalOpen: boolean;
  dialog: types.Dialog | null;
  dialogs: types.Dialog[];
  operation: "sleep" | "idle" | "loading";
};

const initialState: State = {
  ...types.defaultDialog, // 기본 수정 필드
  dialogueOpen: false,
  modalOpen: false, // 기본 수정 모달
  speakModalOpen: false,
  questionModalOpen: false,
  dialog: null, // 1개 조회/작업 시 사용되는 필드
  dialogs: [], // 여러개 조회 시 사용
  operation: "sleep", // init여부 확인
};

type Actions = {
  init: () => Promise<void>; // 초기화
  purify: () => types.DialogInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id?: string) => Promise<void>; // 제거
  reset: (dialog?: types.Dialog) => void; // 수정필드 리셋
};

export const useDialog = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async () => {
    const { operation } = get();
    if (operation !== "sleep") return;
    const dialogs = await gql.dialogs({});
    set({ dialogs, operation: "idle" });
  },
  purify: () => {
    const state = get();
    try {
      const input = types.purifyDialog(state as types.Dialog);
      return input;
    } catch (err) {
      return null;
    }
  },
  create: async () => {
    const { purify, dialogs, reset } = get();
    const input = purify();
    if (!input) return;
    const dialog = await gql.createDialog(input);
    set({ dialogs: [dialog, ...dialogs] });
    reset(dialog);
  },
  update: async () => {
    const { purify, id, dialogs, reset } = get();
    const input = purify();
    const idx = dialogs.findIndex((dialog) => dialog.id === id);
    if (!input || !id || idx === -1) return;
    const dialog = await gql.updateDialog(id, input);
    set({ dialogs: dialogs.map((dlg) => (dlg.id === id ? dialog : dlg)) });
    reset(dialog);
  },
  remove: async (id?: string) => {
    //
  },
  reset: (dialog?: types.Dialog) => set({ ...types.defaultDialog, modalOpen: false, dialog }),
}));
export const dialogStore = createSelectors(useDialog);
