import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { contractGraphQL, Contract, ContractInput } from "./contract.gql";

const state = {
  ...createState(contractGraphQL),
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(contractGraphQL, { get, set }),
});
export const contract = makeStore(contractGraphQL.refName, state, actions);
