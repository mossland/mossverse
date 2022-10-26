import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { createSelectors, Nullable } from "@shared/util-client";
import { Utils } from "@shared/util";

type State = Nullable<types.Token> & {
  modalOpen: boolean;
  token: types.Token | null;
  tokens: types.Token[];
  operation: "sleep" | "idle" | "loading";
};
const initialState: State = {
  ...types.defaultToken, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  token: null, // 1개 조회/작업 시 사용되는 필드
  tokens: [], // 여러개 조회 시 사용
  operation: "sleep", // init여부 확인
};
type Actions = {
  init: () => Promise<void>; // 초기화
  purify: () => types.TokenInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 수정
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (token?: types.Token) => void; // 수정필드 리셋
  addTokenFiles: (fileList: FileList, tokenId?: types.ID) => Promise<void>;
};
export const useToken = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async () => {
    const tokens = await gql.tokens({});
    set({ tokens, operation: "idle" });
  },
  purify: () => {
    const state = get();
    try {
      const token = types.purifyToken(state as types.Token);
      return token;
    } catch (err) {
      return null;
    }
  },
  create: async () => {
    const { tokens, contract, tokenId, reset } = get();
    if (!contract || (!tokenId && tokenId !== 0)) return;
    const token = await gql.generateToken(contract.id, tokenId);
    if (!token) return;
    set({ tokens: [...tokens, token], modalOpen: false });
    reset(token);
  },
  update: async () => {
    const { purify, tokens, id, reset } = get();
    const input = purify();
    if (!input || !id) return;
    const token = input && (await gql.updateToken(id, input));
    set({ tokens: [token, ...tokens.filter((a) => a.id !== token.id)] });
    reset(token);
  },
  remove: async (id: string) => {
    const { tokens } = get();
    await gql.removeToken(id);
    set({ tokens: [...tokens.filter((a) => a.id !== id)] });
  },
  reset: (token) => set({ ...types.defaultToken, token }),
  addTokenFiles: async (fileList, tokenId) => {
    const [file] = await gql.addTokenFiles(fileList, tokenId);
    set({ image: file });
  },
}));
export const tokenStore = createSelectors(useToken);
