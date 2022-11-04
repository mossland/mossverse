import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { thingGraphQL, Thing, ThingInput } from "./thing.gql";

type State = DefaultState<"thing", gql.Thing> & {
  currencyList: gql.Thing[];
};
const initialState: State = {
  ...createState<"thing", gql.Thing, gql.ThingInput>(thingGraphQL),
  currencyList: [],
};
type Actions = DefaultActions<"thing", gql.Thing, gql.ThingInput> & {
  addThingFiles: (fileList: FileList) => Promise<void>;
  initCurrency: () => Promise<void>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"thing", gql.Thing, gql.ThingInput>(thingGraphQL, { get, set }),
  addThingFiles: async (fileList) => {
    const [file] = await gql.addThingFiles(fileList, get().id);
    set({ image: file });
  },
  initCurrency: async () => {
    if (get().currencyList.length) return;
    const { listThing: currencyList } = await gql.listThing({ type: "root" });
    set({ currencyList });
  },
}));
export const thing = generateStore(store);
