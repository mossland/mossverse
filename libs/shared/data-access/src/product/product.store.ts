import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { Nullable } from "@shared/util-client";
import { cnst } from "@shared/util";

type State = Nullable<types.Product> & {
  product: types.Product | null;
  products: types.Product[];
  operation: cnst.StoreOperation;
};

export const defaultState: State = {
  ...types.defaultProduct,
  product: null,
  products: [],
  operation: "sleep",
};

type Actions = {
  init: () => Promise<void>; // 초기화
  purify: () => types.ProductInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 생성
  reset: (product?: types.Product) => void; // 수정필드 리셋
};

export const useMarket = create<State & Actions>()(
  devtools((set, get) => ({
    ...defaultState,
    init: async () => {
      const products = await gql.products({});
      set({ products, operation: "idle" });
    },
    purify: () => {
      const state = get();
      try {
        const product = types.purifyProduct(state as types.Product);
        return product;
      } catch (err) {
        return null;
      }
    },
    create: async () => {
      const { purify, products, reset } = get();
      const input = purify();
      if (!input) return;
      const product = await gql.createProduct(input);
      if (!product) return;
      set({ products: [...products, product] });
      reset(product);
    },
    update: async () => {
      const { purify, products, id, reset } = get();
      const input = purify();
      if (!input || !id) return;
      const product = input && (await gql.updateProduct(id, input));
      set({ products: [product, ...products.filter((a) => a.id !== product.id)] });
      reset(product);
    },
    reset: (product) => set({ ...types.defaultProduct, product }),
  }))
);
