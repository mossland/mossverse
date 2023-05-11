import { SetGet, State } from "@shared/util-client";
import type { RootState } from "../store";
import * as gql from "../gql";
import * as slice from "../slice";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = ({ set, get, pick }: SetGet<slice.CharacterSliceState>) => ({
  ...slice.makeCharacterSlice({ set, get, pick }),
  ...slice.makeCharacterSlice({ set, get, pick }, "InMe" as const),
  // 한번 설정되는 필드
  ...({
    playerNickname: `Guest${Math.floor(Math.random() * 10000)}`,
    playerType: null as null | "user" | "guest",
    playerCharacter: gql.defaultCharacter as gql.LightCharacter,
    playerMaxSpeed: 150,
    playerAcceleration: 1,
    playerDeceleration: 1,
  } as gql.PlayerInit),

  // 자주 업데이트되는 필드
  ...({
    playerVelocity: [0, 0] as [number, number],
    playerPosition: [0, 0] as [number, number],
    playerSpriteState: "idle" as "idle" | "walk",
    playerDirection: "right" as "left" | "right" | "up" | "down",
    playerChatText: "",
    playerEmojiUrl: null as null | string,
    playerStatus: null as "talk" | null,
  } as gql.PlayerRender),

  otherPlayerInitMap: new Map<string, gql.PlayerInit>(),
  otherPlayerRenderMap: new Map<string, gql.PlayerRender>(),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  //
});

export type CharacterState = State<typeof state, typeof actions>;
// * 3. ChildSlice를 추가하세요. Suffix 규칙은 일반적으로 "InModel" as const 로 작성합니다.
export const addCharacterToStore = ({ set, get, pick }: SetGet<CharacterState>) => ({
  ...state({ set, get, pick }),
  ...actions({ set, get, pick }),
});
