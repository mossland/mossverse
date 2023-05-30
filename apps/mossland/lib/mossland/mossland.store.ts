import * as fetch from "../fetch";
import { Get, SetGet, Slice, createSlicer } from "@util/client";
import type { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = ({ set, get, pick }: SetGet<any>) => ({
  //
  marketMenu: "market" as "goods" | "nfts",
  marketSubMenu: "all " as "cyberthug" | "all" | "gifticon" | "mossmarket" | "skinp2p" | "raffle" | "p2p",
});

// * 2. Action을 내용을 정의하세요. Action은 모두  void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  //

  tradeSkin: async () => {
    const { character, tradeForm, refreshTrade, refreshCharacter, resetCharacter, setCharacter } = get() as RootState;
    const purifyTrade = fetch.platform.purifyTrade(tradeForm);
    if (!purifyTrade) throw new Error("purifyTrade is not found");
    if (character === "loading") throw new Error("character is not found");
    // await client.wallet.sign();
    await fetch.tradeSkin(character.id, purifyTrade);
    refreshTrade({ invalidate: true });
    refreshCharacter({ invalidate: true });
    resetCharacter();
  },
  buySkin: async () => {
    const { trade, refreshOwnership, refreshTrade, refreshListing } = get() as RootState;
    // const hash = "testhash"
    // window.crypto.getRandomValues(arr);
    if (trade === "loading") throw new Error("trade is not found");
    await fetch.platform.makeTrade(
      trade.id,
      [fetch.platform.purifyExchange(trade.inputs[0]) as fetch.platform.Exchange],
      [fetch.platform.purifyExchange(trade.outputs[0]) as fetch.platform.Exchange]
    );
    refreshTrade({ invalidate: true });
    refreshListing({ invalidate: true });
    refreshOwnership({ invalidate: true });
    // refreshOwnershipInMoney({ invalidate: true }); //! 별도 상태관리 필요
    // set({});
  },
});

export type MosslandState = Get<typeof state, typeof actions>;
export type MosslandSlice = Slice<"mossland", MosslandState>;
export const makeMosslandSlice = createSlicer("mossland" as const, state, actions);
