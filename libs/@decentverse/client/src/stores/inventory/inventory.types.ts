import gql from "graphql-tag";
import * as types from "../types";

// export const keyTypes = ["left", "right", "up", "down", "interaction"] as const;
// export type KeyType = typeof keyTypes[number];
// export type Keyboard = { [key in KeyType]: boolean };

export const itemTypes = ["equipment", "consumable"] as const;

export type ItemTypes = typeof itemTypes[number];

export type EffectType = "none" | "goldenBell" | "donationIn" | "donationOut";

export type ItemInput = {
  name: string;
  // contract?: types.ContractInput;
  contract?: string;
  tokenId?: number;
  file: string;
  type: ItemTypes;
};
export type Item = {
  id: string;
  name: string;
  file: types.shared.File;
  type: ItemTypes;
  contract?: types.shared.Contract;
  abi?: string;
  tokenId?: number;
  owner?: string;
  status: string;
};

export const itemFragment = gql`
  ${types.shared.fileFragment}
  ${types.shared.contractFragment}
  fragment itemFragment on Item {
    id
    name
    type
    tokenId
    contract {
      ...contractFragment
    }
    file {
      ...fileFragment
    }
  }
`;

export type Inventory = {
  item: Item;
  num: number;
};
export type InventoryInput = {
  item?: Item;
  num?: number;
};

export const inventoryFragment = gql`
  ${itemFragment}
  fragment inventoryFragment on Inventory {
    item {
      ...itemFragment
    }
    num
  }
`;
