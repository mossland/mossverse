import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { createSelectors, Nullable } from "@shared/util-client";
import { Utils } from "@shared/util";

type State = Nullable<types.Contract> & {
  modalOpen: boolean;
  contract: types.Contract | null;
  contracts: types.Contract[];
  operation: "sleep" | "idle" | "loading";
};
const initialState: State = {
  ...types.defaultContract, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  contract: null, // 1개 조회/작업 시 사용되는 필드
  contracts: [], // 여러개 조회 시 사용
  operation: "sleep", // init여부 확인
};
type Actions = {
  init: () => Promise<void>; // 초기화
  purify: () => types.ContractInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (contract?: types.Contract) => void; // 수정필드 리셋
};
export const useContract = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async () => {
    const contracts = await gql.contracts({});
    set({ contracts, operation: "idle" });
  },
  purify: () => {
    const state = get();
    try {
      const contract = types.purifyContract(state as types.Contract);
      return contract;
    } catch (err) {
      return null;
    }
  },
  create: async () => {
    const { purify, contracts, id } = get();
    const input = purify();
    if (!input) return;
    const contract = await gql.createContract(input);
    if (!contract) return;
    return set({ contracts: [...contracts, contract] });
  },
  update: async () => {
    const { purify, contracts, id } = get();
    const input = purify();
    if (!input || !id) return;
    const contract = input && (await gql.updateContract(id, input));
    return set({ contracts: [contract, ...contracts.filter((a) => a.id !== contract.id)] });
  },
  remove: async () => {
    const { id, contracts } = get();
    const contract = id && (await gql.removeContract(id));
    return set({ contracts: [...contracts.filter((a) => a.id !== id)] });
  },
  reset: (contract) => set({ ...types.defaultContract, contract }),
}));
export const contractStore = createSelectors(useContract);
