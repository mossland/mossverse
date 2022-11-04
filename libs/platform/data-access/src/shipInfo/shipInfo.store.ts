import create from "zustand";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { makeDefault, generateStore, Nullable } from "@shared/util-client";
import { cnst } from "@shared/util";
import { ShipInfo } from "../gql";

//! Need to be refactored

type State = Nullable<gql.ShipInfo> & {
  shipInfo: gql.ShipInfo | null;
};

const initialState: State = {
  ...gql.defaultShipInfo,
  shipInfo: null,
};

type Action = {
  init: () => Promise<void>; // 초기화
  purify: () => gql.ShipInfoInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (shipInfo?: gql.ShipInfo) => void; // 수정필드 리셋
};

const store = create<State & Action>()(
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
        const shipInfo = gql.purifyShipInfo(state as gql.ShipInfo);
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
    reset: (shipInfo?: gql.ShipInfo) => set({ ...gql.defaultShipInfo, shipInfo }),
  }))
);

export const shipInfo = generateStore(store);
