import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { createSelectors, Nullable } from "@shared/util-client";
import { update } from "libs/shared/util/src/utils";
import { cnst } from "@shared/util";

type State = Nullable<types.ShipInfo> & {
  shipInfo: types.ShipInfo | null;
};

const initialState: State = {
  ...types.defaultShipInfo,
  shipInfo: null,
};

type Action = {
  init: () => Promise<void>; // 초기화
  purify: () => types.ShipInfoInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (shipInfo?: types.ShipInfo) => void; // 수정필드 리셋
};

export const useShipInfo = create<State & Action>()(
  devtools((set, get) => ({
    ...initialState,
    init: async () => {
      // const shipInfos = await gql.shipInfos({});
      // console.log(shipInfos);
      // set({ shipInfos, operation: "idle" });
    },
    purify: () => {
      const state = get();
      try {
        const shipInfo = types.purifyShipInfo(state as types.ShipInfo);
        return shipInfo;
      } catch (err) {
        return null;
      }
    },

    create: async () => {
      //* not used
    }, // 생성
    update: async () => {
      //* not used
    }, // 수정
    remove: async () => {
      //* not used
    }, // 제거
    reset: (shipInfo?: types.ShipInfo) => set({ ...types.defaultShipInfo, shipInfo }),
  }))
);

export const shipInfoStore = createSelectors(useShipInfo);
