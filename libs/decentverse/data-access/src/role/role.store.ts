import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { roleGraphQL, Role, RoleInput } from "./role.gql";

type State = DefaultState<"role", gql.Role> & {
  //
};
const initialState: State = {
  ...createState<"role", gql.Role, gql.RoleInput>(roleGraphQL),
};
type Actions = DefaultActions<"role", gql.Role, gql.RoleInput> & {
  // initAuth: (uri: string) => Promise<void>; // 초기화
  // signin: () => Promise<void>;
  // signout: () => void;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"role", gql.Role, gql.RoleInput>(roleGraphQL, { get, set }),
}));
export const role = generateStore(store);
