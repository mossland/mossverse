import * as gql from "../gql";
import { createActions, createState, SetGet, Slice, Get, createSlicer, client, SetPick } from "@shared/util-client";
import { RootState } from "../store";

// ? Slice는 재사용가능한 상태와 액션을 정의합니다. 외부 상태를 가져다쓰지 않는 경우에만 사용하세요.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget, suffix: string) => ({
  ...createState(gql.characterGraphQL),
  ...createActions(gql.characterGraphQL, setget, suffix),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, pick }: SetPick<typeof state>, suffix: string) => ({
  rejectCharacter: async (id: string, idx?: number) => {
    const character = await gql.rejectCharacter(id);
    if (idx === undefined) return set({ character });
    const { characterList } = pick("characterList");
    set({ characterList: characterList.map((u, i) => (i === idx ? character : u)) });
  },
  approveCharacter: async (id: string, idx?: number) => {
    const character = await gql.approveCharacter(id);
    if (idx === undefined) return set({ character });
    const { characterList } = pick("characterList");
    set({ characterList: characterList.map((u, i) => (i === idx ? character : u)) });
  },
});

export type CharacterSliceState = Get<typeof state, typeof actions>;
export type CharacterSlice = Slice<"character", CharacterSliceState>;
export const makeCharacterSlice = createSlicer("character" as const, state, actions);
