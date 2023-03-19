import { client, SetGet, State } from "@shared/util-client";
import type { RootState } from "../store";
import * as gql from "../gql";
import * as slice from "../slice";
import { signinWallet } from "libs/shared/data-access/src/gql";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = ({ set, get, pick }: SetGet<any>) => ({
  ...slice.decentverse.makeCharacterSlice({ set, get, pick }, "InSubmit" as const),
});

// * 2. Action을 내용을 정의하세요. Action은 모두  void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  //
  reapplyCharacter: async () => {
    const { refreshCharacterInSubmit, myKeyring, characterFormInSubmit } = get() as RootState;
    const characterMotion = { row: 0, column: 2, duration: 500 };
    const file = characterFormInSubmit.file;
    if (!file) throw new Error("No file");

    const purifyCharacter = gql.decentverse.purifyCharacter({
      ...characterFormInSubmit,
      tileSize: [Math.floor(file.imageSize[0] / 2), Math.floor(file.imageSize[1] / 4)],
      totalSize: file.imageSize,
      size: [Math.floor(file.imageSize[0] / 6), Math.floor(file.imageSize[1] / 12)],
      right: {
        idle: characterMotion,
        walk: { ...characterMotion, row: characterMotion.row + 1 },
      },
      left: {
        idle: { ...characterMotion, row: characterMotion.row + 2 },
        walk: { ...characterMotion, row: characterMotion.row + 3 },
      },
    });
    if (!purifyCharacter) throw new Error("No purifyCharacter");
    const wallet =
      myKeyring.wallets[0].network.provider === "ethereum"
        ? "metamask"
        : myKeyring.wallets[0].network.provider === "klaytn"
        ? "kaikas"
        : "walletConnect";
    await client.setWallet(wallet);
    await gql.decentverse.reapplyCharacter(characterFormInSubmit.id, purifyCharacter);
    await refreshCharacterInSubmit({ invalidate: true });
    set({ characterInSubmit: "loading", characterModalInSubmit: null });
  },

  tradeSkin: async () => {
    const { characterInSubmit, tradeForm, refreshTrade, refreshCharacterInSubmit } = get() as RootState;
    const purifyTrade = gql.platform.purifyTrade(tradeForm);
    if (!purifyTrade) throw new Error("purifyTrade is not found");
    if (characterInSubmit === "loading") throw new Error("character is not found");
    // await client.wallet.sign();
    await gql.tradeSkin(characterInSubmit.id, purifyTrade);
    refreshTrade({ invalidate: true });
    refreshCharacterInSubmit({ invalidate: true });
    set({ characterModalInSubmit: null, characterInSubmit: "loading" });
  },
  buySkin: async () => {
    const { trade, refreshOwnershipInItem, refreshOwnershipInMoney, refreshTrade, refreshListing } = get() as RootState;
    // const hash = "testhash"
    // window.crypto.getRandomValues(arr);
    if (trade === "loading") throw new Error("trade is not found");
    await gql.platform.makeTrade(
      trade.id,
      [gql.platform.purifyExchange(trade.inputs[0]) as gql.platform.Exchange],
      [gql.platform.purifyExchange(trade.outputs[0]) as gql.platform.Exchange]
    );
    refreshTrade({ invalidate: true });
    refreshListing({ invalidate: true });
    refreshOwnershipInItem({ invalidate: true });
    refreshOwnershipInMoney({ invalidate: true });
    // set({});
  },
});

export type MainState = State<typeof state, typeof actions>;
// * 3. ChildSlice를 추가하세요. Suffix 규칙은 일반적으로 "InModel" as const 로 작성합니다.
export const addMainToStore = ({ set, get, pick }: SetGet<MainState>) => ({
  ...state({ set, get, pick }),
  ...actions({ set, get, pick }),
});
