import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { characterGraphQL, Character, CharacterInput } from "./character.gql";

type State = DefaultState<"character", gql.Character> & {
  //
};
const initialState: State = {
  ...createState<"character", gql.Character, gql.CharacterInput>(characterGraphQL),
};
type Actions = DefaultActions<"character", gql.Character, gql.CharacterInput> & {
  addCharacterFiles: (fileList: FileList) => Promise<void>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"character", gql.Character, gql.CharacterInput>(characterGraphQL, { get, set }),
  addCharacterFiles: async (fileList) => {
    const [file] = await gql.addCharacterFiles(fileList, get().id);
    set({ file, totalSize: file.imageSize });
  },
}));
export const character = generateStore(store);
