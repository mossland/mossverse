import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { assetGraphQL } from "../gql";

const state = {
  ...createState(assetGraphQL),
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(assetGraphQL, { get, set }),
  addAssetFiles: async (fileList: FileList, type: "top" | "bottom" | "lighting", assetId?: string) => {
    const { assetForm } = get();
    const [file] = await gql.addAssetFiles(fileList, assetId);
    set({ assetForm: { ...assetForm, [type]: file } });
  },
});
export const asset = makeStore(assetGraphQL.refName, state, actions);
