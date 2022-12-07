import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { roleGraphQL, Role, RoleInput } from "./role.gql";

const state = {
  ...createState(roleGraphQL),
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(roleGraphQL, { get, set }),
});
export const role = makeStore(roleGraphQL.refName, state, actions);
