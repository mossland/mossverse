import create from "zustand";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { createSelectors } from "@shared/util-client";

// export type WorldState = WorldIntractionState;

type State = {
  isPending: boolean;
  isKicked: boolean;
};

const defaultState: State = {
  isPending: false,
  isKicked: false,
};

type Action = {
  //
};

export const useWorldEvent = create<State & Action>((set, get) => ({
  ...defaultState,
}));

export const worldEventStore = createSelectors(useWorldEvent);
