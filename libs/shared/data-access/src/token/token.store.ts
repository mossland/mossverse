import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { tokenGraphQL, Token, TokenInput } from "./token.gql";

type State = DefaultState<"token", gql.Token> & {
  //
};
const initialState: State = {
  ...createState<"token", gql.Token, gql.TokenInput>(tokenGraphQL),
};
type Actions = DefaultActions<"token", gql.Token, gql.TokenInput> & {
  addTokenFiles: (fileList: FileList, tokenId?: string) => Promise<void>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"token", gql.Token, gql.TokenInput>(tokenGraphQL, { get, set }),
  addTokenFiles: async (fileList, tokenId) => {
    const [file] = await gql.addTokenFiles(fileList, tokenId);
    set({ image: file });
  },
}));
export const token = generateStore(store);
