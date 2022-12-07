import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { thingGraphQL, Thing, ThingInput } from "./thing.gql";

const state = {
  ...createState(thingGraphQL),
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(thingGraphQL, { get, set }),
});
export const thing = makeStore(thingGraphQL.refName, state, actions);
