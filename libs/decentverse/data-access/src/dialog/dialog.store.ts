import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { dialogGraphQL, Dialog, DialogInput } from "./dialog.gql";

const state = {
  ...createState(dialogGraphQL),
  dialogueOpen: false,
  modalOpen: false, // 기본 수정 모달
  speakModalOpen: false,
  questionModalOpen: false,
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(dialogGraphQL, { get, set }),
});
export const dialog = makeStore(dialogGraphQL.refName, state, actions);
