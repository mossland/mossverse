import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { createSelectors, Nullable } from "@shared/util-client";
import { Utils, cnst } from "@shared/util";

type State = Nullable<types.Network> & {
  modalOpen: boolean;
  network: types.Network | null;
  networks: types.Network[];
  operation: cnst.StoreOperation;
};
const initialState: State = {
  ...types.defaultNetwork, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  network: null, // 1개 조회/작업 시 사용되는 필드
  networks: [], // 여러개 조회 시 사용
  operation: "sleep", // init여부 확인
};
type Actions = {
  init: (networkType: cnst.NetworkType) => Promise<void>; // 초기화
  purify: () => types.NetworkInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 생성
  reset: (network?: types.Network) => void; // 수정필드 리셋
};
export const useNetwork = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async (networkType: cnst.NetworkType) => {
    const networks = await gql.networks({ type: networkType });
    set({ networks, operation: "idle" });
  },
  purify: () => {
    const state = get();
    try {
      const network = types.purifyNetwork(state as types.Network);
      return network;
    } catch (err) {
      return null;
    }
  },
  create: async () => {
    const { purify, networks, reset } = get();
    const input = purify();
    if (!input) return;
    const network = await gql.createNetwork(input);
    if (!network) return;
    set({ networks: [...networks, network] });
    reset(network);
  },
  update: async () => {
    const { purify, networks, id, reset } = get();
    const input = purify();
    if (!input || !id) return;
    const network = input && (await gql.updateNetwork(id, input));
    set({ networks: [network, ...networks.filter((a) => a.id !== network.id)] });
    reset(network);
  },
  reset: (network) => set({ ...types.defaultNetwork, network, modalOpen: false }),
}));
export const networkStore = createSelectors(useNetwork);
