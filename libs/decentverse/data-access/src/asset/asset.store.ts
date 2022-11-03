import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { assetGraphQL } from "../gql";

type State = DefaultState<"asset", gql.Asset> & {
  //
};
const initialState: State = {
  ...createState<"asset", gql.Asset, gql.AssetInput>(assetGraphQL),
};
type Actions = DefaultActions<"asset", gql.Asset, gql.AssetInput> & {
  addAssetFiles: (fileList: FileList, type: gql.LayerType, assetId?: string) => Promise<void>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"asset", gql.Asset, gql.AssetInput>(assetGraphQL, { get, set }),
  addAssetFiles: async (fileList, type, assetId) => {
    const [file] = await gql.addAssetFiles(fileList, assetId);
    set({ [type]: file });
  },
}));
export const asset = generateStore(store);
