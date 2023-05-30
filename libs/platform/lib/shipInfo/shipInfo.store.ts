import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState } from "@util/client";
import type { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.shipInfoGraphQL),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.shipInfoGraphQL, { set, get, pick }),
  openMyShipInfo: async (user: fetch.User, product?: fetch.shared.Product) => {
    const { newShipInfo, editShipInfo } = get() as RootState;

    if (!product) return;

    const { listShipInfo } = await fetch.listShipInfo({ query: { user: user.id, product: product.id } });
    listShipInfo.length ? await editShipInfo(listShipInfo[0].id) : newShipInfo({ product, user });
  },
  addWinnerShipInfo: async (raffleId: string) => {
    const { shipInfoForm } = pick("shipInfoForm");
    console.log(shipInfoForm);
    const purifyShipInfo = fetch.purifyShipInfo(shipInfoForm);
    if (!purifyShipInfo) return;
    await fetch.addWinnerShipInfo(raffleId, purifyShipInfo);
  },
  //
});

export type ShipInfoState = Get<typeof state, typeof actions>;
export type ShipInfoSlice = Slice<"shipInfo", ShipInfoState>;
export const makeShipInfoSlice = createSlicer("shipInfo" as const, state, actions);
