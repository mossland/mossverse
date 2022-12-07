import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { tokenGraphQL, Token, TokenInput } from "./token.gql";

const state = {
  ...createState(tokenGraphQL),
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(tokenGraphQL, { get, set }),
});
export const token = makeStore(tokenGraphQL.refName, state, actions);
