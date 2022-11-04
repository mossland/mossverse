import create from "zustand";
import * as gql from "../gql";
import { setLink, createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { contractGraphQL, Contract, ContractInput } from "./contract.gql";

type State = DefaultState<"contract", gql.Contract> & {
  //
};
const initialState: State = {
  ...createState<"contract", gql.Contract, gql.ContractInput>(contractGraphQL),
};
type Actions = DefaultActions<"contract", gql.Contract, gql.ContractInput> & {
  // initAuth: (uri: string) => Promise<void>; // 초기화
  // signin: () => Promise<void>;
  // signout: () => void;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"contract", gql.Contract, gql.ContractInput>(contractGraphQL, { get, set }),
}));
export const contract = generateStore(store);
