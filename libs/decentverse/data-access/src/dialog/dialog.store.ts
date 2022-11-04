import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { dialogGraphQL, Dialog, DialogInput } from "./dialog.gql";

type State = DefaultState<"dialog", gql.Dialog> & {
  dialogueOpen: false;
  modalOpen: false; // 기본 수정 모달
  speakModalOpen: false;
  questionModalOpen: false;
};
const initialState: State = {
  ...createState<"dialog", gql.Dialog, gql.DialogInput>(dialogGraphQL),
  dialogueOpen: false,
  modalOpen: false, // 기본 수정 모달
  speakModalOpen: false,
  questionModalOpen: false,
};
type Actions = DefaultActions<"dialog", gql.Dialog, gql.DialogInput> & {
  //
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"dialog", gql.Dialog, gql.DialogInput>(dialogGraphQL, { get, set }),
}));
export const dialog = generateStore(store);
