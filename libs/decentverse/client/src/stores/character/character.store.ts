import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { createSelectors, Nullable } from "@shared/util-client";
import { Utils } from "@shared/util";

type State = Nullable<types.Character> & {
  modalOpen: boolean;
  character: types.Character | null;
  characters: types.Character[];
  operation: "sleep" | "idle" | "loading";
};
const initialState: State = {
  ...types.defaultCharacter, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  character: null, // 1개 조회/작업 시 사용되는 필드
  characters: [], // 여러개 조회 시 사용
  operation: "sleep", // init여부 확인
};
type Actions = {
  init: (query?: any) => Promise<void>; // 초기화
  purify: () => types.CharacterInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (character?: types.Character) => void; // 수정필드 리셋
  addCharacterFiles: (fileList: FileList, characterId?: types.ID | null) => Promise<void>;
};
export const useCharacter = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async (query = {}) => {
    const characters = await gql.characters(query);
    set({ characters, operation: "idle" });
  },
  purify: () => {
    const state = get();
    try {
      const character = types.purifyCharacter(state as types.Character);
      return character;
    } catch (err) {
      return null;
    }
  },
  create: async () => {
    const { purify, characters, reset } = get();
    const input = purify();
    if (!input) return;
    const character = await gql.createCharacter(input);
    if (!character) return;
    set({ characters: [...characters, character] });
    reset(character);
  },
  update: async () => {
    const { purify, characters, id, reset } = get();
    const input = purify();
    if (!input || !id) return;
    const character = input && (await gql.updateCharacter(id, input));
    set({ characters: [character, ...characters.filter((a) => a.id !== character.id)] });
    reset(character);
  },
  remove: async (id: string) => {
    const { characters } = get();
    await gql.removeCharacter(id);
    return set({ characters: [...characters.filter((a) => a.id !== id)] });
  },
  reset: (character) => set({ ...types.defaultCharacter, character }),
  addCharacterFiles: async (fileList, characterId) => {
    const [file] = await gql.addCharacterFiles(fileList, characterId);
    set({ file, totalSize: file.imageSize });
  },
}));
export const characterStore = createSelectors(useCharacter);
