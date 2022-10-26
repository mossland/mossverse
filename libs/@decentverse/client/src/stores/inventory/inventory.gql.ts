import { client } from "../gql";
import gql from "graphql-tag";
import * as types from "./inventory.types";

export type MyInventoryQuery = { myInventory: types.Inventory[] };
export const myInventoryQuery = gql`
  ${types.inventoryFragment}
  query myInventory($userId: ID!) {
    myInventory(userId: $userId) {
      ...inventoryFragment
    }
  }
`;

export const myInventory = async (userId: string) =>
  (
    await client.query<MyInventoryQuery>({
      query: myInventoryQuery,
      variables: { userId },
    })
  ).data?.myInventory;

export type UseItemMutation = { useItem: boolean };
export const useItemMutation = gql`
  mutation useItem($userId: ID!, $itemId: ID!) {
    useItem(userId: $userId, itemId: $itemId)
  }
`;

export const useItem = async (userId: string, itemId: string) =>
  (
    await client.mutate<UseItemMutation>({
      mutation: useItemMutation,
      variables: { userId, itemId },
    })
  ).data?.useItem;

export type SyncInventoryMutation = { syncInventory: types.Inventory[] };
export const syncInventoryMutation = gql`
  ${types.inventoryFragment}
  mutation syncInventory($userId: ID!) {
    syncInventory(userId: $userId) {
      ...inventoryFragment
    }
  }
`;

export const syncInventory = async (userId: string) =>
  (
    await client.mutate<SyncInventoryMutation>({
      mutation: syncInventoryMutation,
      variables: { userId },
    })
  ).data?.syncInventory;
