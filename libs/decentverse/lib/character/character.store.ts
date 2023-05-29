import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState } from "@util/client";
import { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.characterGraphQL),

  // 한번 설정되는 필드
  ...({
    playerNickname: `Guest${Math.floor(Math.random() * 10000)}`,
    playerType: null as null | "user" | "guest",
    playerCharacter: fetch.defaultCharacter as fetch.LightCharacter,
    playerMaxSpeed: 150,
    playerAcceleration: 1,
    playerDeceleration: 1,
  } as fetch.PlayerInit),

  // 자주 업데이트되는 필드
  ...({
    playerVelocity: [0, 0] as [number, number],
    playerPosition: [0, 0] as [number, number],
    playerSpriteState: "idle" as "idle" | "walk",
    playerDirection: "right" as "left" | "right" | "up" | "down",
    playerChatText: "",
    playerEmojiUrl: null as null | string,
    playerStatus: null as "talk" | null,
  } as fetch.PlayerRender),

  otherPlayerInitMap: new Map<string, fetch.PlayerInit>(),
  otherPlayerRenderMap: new Map<string, fetch.PlayerRender>(),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.characterGraphQL, { set, get, pick }),
  rejectCharacter: async (id: string) => {
    const { characterMap } = pick("characterMap");
    const character = await fetch.rejectCharacter(id);
    characterMap.set(character.id, character);
    set({ characterMap: new Map(characterMap) });
  },
  approveCharacter: async (id: string) => {
    const { characterMap } = pick("characterMap");
    const character = await fetch.approveCharacter(id);
    characterMap.set(character.id, character);
    set({ characterMap: new Map(characterMap) });
  },

  reapplyCharacter: async () => {
    const { refreshCharacter, myKeyring, characterForm } = get() as RootState;
    const characterMotion = { row: 0, column: 2, duration: 500 };
    const file = characterForm.file;
    if (!file) throw new Error("No file");

    const purifyCharacter = fetch.purifyCharacter({
      ...characterForm,
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
    // const wallet =
    //   myKeyring.wallets[0].network.provider === "ethereum"
    //     ? "metamask"
    //     : myKeyring.wallets[0].network.provider === "klaytn"
    //     ? "kaikas"
    //     : "walletConnect";
    // await client.setWallet(wallet);
    await fetch.reapplyCharacter(characterForm.id, purifyCharacter);
    await refreshCharacter({ invalidate: true });
    set({ character: "loading", characterModal: null });
  },
});

export type CharacterState = Get<typeof state, typeof actions>;
export type CharacterSlice = Slice<"character", CharacterState>;
export const makeCharacterSlice = createSlicer("character" as const, state, actions);
