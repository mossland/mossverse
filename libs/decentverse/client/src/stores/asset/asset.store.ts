import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { createSelectors, Nullable } from "@shared/util-client";
import { Utils } from "@shared/util";

type State = Nullable<types.Asset> & {
  modalOpen: boolean;
  asset: types.Asset | null;
  assets: types.Asset[];
  operation: "sleep" | "idle" | "loading";
};

const initialState: State = {
  ...types.defaultAsset, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  asset: null, // 1개 조회/작업 시 사용되는 필드
  assets: [], // 여러개 조회 시 사용
  operation: "sleep", // init여부 확인
};

type Actions = {
  init: () => Promise<void>; // 초기화
  purify: () => types.AssetInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (asset?: types.Asset) => void; // 수정필드 리셋
  addAssetFiles: (fileList: FileList, type: types.LayerType, assetId?: types.ID) => Promise<void>;
};

export const useAsset = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async () => {
    const { operation } = get();
    if (operation !== "sleep") return;
    const assets = await gql.assets({});
    set({ assets, operation: "idle" });
  },
  purify: () => {
    const state = get();
    try {
      if (!state.top && !state.bottom && !state.lighting) return null;
      const input = types.purifyAsset(state as types.Asset);
      return input;
    } catch (err) {
      return null;
    }
  },
  create: async () => {
    const { purify, assets, reset } = get();
    const assetInput = purify();
    if (!assetInput) return;
    const asset = await gql.createAsset(assetInput);
    set({ assets: [asset, ...assets] });
    reset(asset);
  },
  update: async () => {
    const { purify, id, assets, reset } = get();
    const assetInput = purify();
    const idx = assets.findIndex((asset) => asset.id === id);
    if (!assetInput || !id || idx === -1) return;
    const asset = await gql.updateAsset(id, assetInput);
    set({ assets: assets.map((ast) => (ast.id === id ? asset : ast)) });
    reset(asset);
  },
  remove: async (id: string) => {
    const { assets } = get();
    await gql.removeAsset(id);
    return set({ assets: [...assets.filter((a) => a.id !== id)] });
  },
  reset: (asset?: types.Asset) => set({ ...types.defaultAsset, modalOpen: false, asset }),
  addAssetFiles: async (fileList, type, assetId) => {
    const [file] = await gql.addAssetFiles(fileList, assetId);
    set(Utils.update(type, file));
  },
}));

export const assetStore = createSelectors(useAsset);
