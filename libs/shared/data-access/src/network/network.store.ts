import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { networkGraphQL, Network, NetworkInput } from "./network.gql";

const state = {
  ...createState(networkGraphQL),
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(networkGraphQL, { get, set }),
});
export const network = makeStore(networkGraphQL.refName, state, actions);
