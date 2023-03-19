import * as gql from "../gql";
import { createActions, createState, SetGet, Slice, Get, createSlicer, ID, SetPick } from "@shared/util-client";
import type { RootState } from "../store";
import { addWinnerShipInfo } from "../gql";

// ? Slice는 재사용가능한 상태와 액션을 정의합니다. 외부 상태를 가져다쓰지 않는 경우에만 사용하세요.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget, suffix: string) => ({
  ...createState(gql.shipInfoGraphQL),
  ...createActions(gql.shipInfoGraphQL, setget, suffix),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, pick }: SetPick<typeof state>, suffix: string) => ({
  openMyShipInfo: async (userId?: gql.User, productId?: gql.shared.Product) => {
    //! Issue 코드 개같음
    const { newShipInfo, editShipInfo } = pick("newShipInfo", "editShipInfo");
    if (!userId || !productId) return;
    try {
      const shipInfo = await gql.getMyShipInfo(userId.id, productId.id);
      await editShipInfo(shipInfo);
    } catch (e) {
      newShipInfo({ product: productId, user: userId });
    }
  },
  addWinnerShipInfo: async (raffleId: string) => {
    const { shipInfoForm } = pick("shipInfoForm");
    const purifyShipInfo = gql.purifyShipInfo(shipInfoForm);
    if (!purifyShipInfo) return;
    await gql.addWinnerShipInfo(raffleId, purifyShipInfo);
  },
});

export type ShipInfoSliceState = Get<typeof state, typeof actions>;
export type ShipInfoSlice = Slice<"shipInfo", ShipInfoSliceState>;
export const makeShipInfoSlice = createSlicer("shipInfo" as const, state, actions);
