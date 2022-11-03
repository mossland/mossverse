import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { networkGraphQL, Network, NetworkInput } from "./network.gql";

type State = DefaultState<"network", gql.Network> & {
  //
};
const initialState: State = {
  ...createState<"network", gql.Network, gql.NetworkInput>(networkGraphQL),
};
type Actions = DefaultActions<"network", gql.Network, gql.NetworkInput> & {
  //
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"network", gql.Network, gql.NetworkInput>(networkGraphQL, { get, set }),
}));
export const network = generateStore(store);
