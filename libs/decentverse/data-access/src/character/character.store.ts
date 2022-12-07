import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { characterGraphQL, Character, CharacterInput } from "./character.gql";

const state = {
  ...createState(characterGraphQL),
};

const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(characterGraphQL, { get, set }),
  addCharacterFiles: async (fileList: FileList) => {
    const { characterForm } = get();
    const [file] = await gql.addCharacterFiles(fileList, characterForm.id);
    set({ characterForm: { ...characterForm, file, totalSize: file.imageSize } });
  },
});
export const character = makeStore(characterGraphQL.refName, state, actions);
