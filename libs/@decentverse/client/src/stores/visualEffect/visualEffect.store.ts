import create from "zustand";
import * as gql from "../gql";
import { client } from "../gql";
import * as types from "../types";

export interface VisualEffectState {
  effectTimeout?: NodeJS.Timeout;
  effectType: types.EffectType;
  showEffect: (type: types.EffectType) => void;
}
export const useVisualEffect = create<VisualEffectState>((set, get) => ({
  effectTimeout: undefined,
  effectType: "none",
  showEffect: (type) => {
    if (get().effectTimeout) clearInterval(get().effectTimeout);
    const timeout = setTimeout(() => set({ effectType: "none" }), 3000);
    set({ effectTimeout: timeout, effectType: type });
  },
}));
