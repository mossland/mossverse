import create, { StoreMutators } from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { Socket } from "socket.io-client";
import { stores } from "./../../stores";
import { Socket as Soc } from "socket.io-client";
import { createSelectors } from "@shared/util-client";
export interface InventoryState {
  items: types.Item[];
  inventory: types.Inventory[];
  tab: types.ItemTypes;
  itemCallbacks: types.ItemCallback[];
  inventoryRender: types.Item[][];
  isOpenInventory: boolean;
  isOpenItemMenu: boolean;
  isShowItemInfo: boolean;
  isShowItemOption: boolean;
  selectedItemId: string;
  inputItemNum: number;
  itemMenuIndex: number;
  isLoading: boolean;
  setItems: () => Promise<void>;
  syncInventory: (userId: string) => Promise<void>;
  changeTab: (tab: types.ItemTypes) => void;
  setItemCallbacks: (itemCallbacks: types.ItemCallback[]) => Promise<void>;
  applyItem: (itemId: string, socket: Soc, callback: types.ItemCallback, option?: object) => Promise<void>;
  // store: types.Stores;
  toggleOpenInventory: () => void;
  toggleItemMenu: (itemId: string) => void;
  toggleItemInfo: () => void;
  toggleItemOption: (index?: number) => void;
  updateInputItemNum: (value: number) => void;
}
export const useInventory = create<InventoryState>((set, get) => ({
  items: [],
  tab: "equipment",
  itemCallbacks: [],
  inventory: [],
  inventoryRender: [],
  inputItemNum: 1,
  isOpenInventory: false,
  isOpenItemMenu: false,
  isShowItemInfo: false,
  isShowItemOption: false,
  selectedItemId: "",
  itemMenuIndex: 1,
  isLoading: false,
  setItems: async () => {
    // const items = await gql.items();
    // set({ items });
  },
  syncInventory: async (userId: string) => {
    set({ isLoading: true });
    const inventory = await gql.syncInventory(userId);
    inventory && set({ inventory });
    set({ isLoading: false });
  },
  changeTab: (tab: types.ItemTypes) => set({ tab, isOpenItemMenu: false }),
  setItemCallbacks: async (itemCallbacks: any) => {
    set({ itemCallbacks });
  },
  // applyItem: async (itemId: string) => {
  //   const { itemCallbacks } = get();
  //   console.log(itemId);
  //   // await gql.useItem(itemId);
  //   const itemCallback = itemCallbacks[itemId];
  //   console.log("itemCallback", itemCallback);
  //   if (!itemCallback) return;

  //   const store = get().store;
  //   itemCallback(store);
  // },
  applyItem: async (itemId, socket, callback, option?: object) => {
    // set((state) => ({ isShowItemOption: false, isOpenItemMenu: false, selectedItemId: "" }));
    // const userId = stores.world.getState().me.id;
    // option ? await callback(stores, socket, itemId, option) : await callback(stores, socket, itemId);
    // gql.useItem(userId, itemId);
  },
  toggleOpenInventory: async () => {
    set((state) => ({ isOpenInventory: !state.isOpenInventory, isOpenItemMenu: false }));
  },
  toggleItemMenu: (itemId) => {
    const isShowItemOption = get().isOpenItemMenu === false ? false : get().isShowItemOption;
    set((state) => ({ isOpenItemMenu: !state.isOpenItemMenu, selectedItemId: itemId, isShowItemOption }));
  },
  toggleItemInfo: () => {
    set((state) => ({ isShowItemInfo: !state.isShowItemInfo, isOpenItemMenu: false }));
  },
  toggleItemOption: (index) => {
    set((state) => ({
      isShowItemOption: !state.isShowItemOption,
      inputItemNum: 1,
      itemMenuIndex: index,
      isOpenItemMenu: false,
    }));
  },
  updateInputItemNum: (value) => {
    set({ inputItemNum: value });
  },
}));

export const inventoryStore = createSelectors(useInventory);
