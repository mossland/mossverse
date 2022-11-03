import { useUser } from "./user";
import { useAsset } from "./asset";
import { useCharacter } from "./character";
import { useDialog } from "./dialog";
import { useMap } from "./map";
import { useGame } from "./game";
import { useInventory } from "./inventory";
import { useWorld } from "./world";
import { useGossip } from "./gossip";
import { useWebview } from "./webview";
import { useEmoji } from "./emoji";
import { useVisualEffect } from "./visualEffect";
import { useWorldEvent } from "./worldEvent";

export * from "@shared/data-access";
export * as types from "./types";
export * as gql from "./gql";
export * as utils from "./utils";

export * from "./asset";
export * from "./character";
export * from "./dialog";
export * from "./map";
export * from "./game";
export * from "./inventory";
export * from "./world";
export * from "./webview";
export * from "./gossip";
export * from "./user";
export * from "./role";
export * from "./emoji";
export * from "./visualEffect";
export * from "./live";
export * from "./callRoom";
export type Stores = {
  user: typeof useUser;
  asset: typeof useAsset;
  charcter: typeof useCharacter;
  dialog: typeof useDialog;
  map: typeof useMap;
  game: typeof useGame;
  world: typeof useWorld;
  worldEvent: typeof useWorldEvent;
  webview: typeof useWebview;
  inventory: typeof useInventory;
  gossip: typeof useGossip;
  emoji: typeof useEmoji;
  visualEffect: typeof useVisualEffect;
};

export const stores: Stores = {
  user: useUser,
  asset: useAsset,
  charcter: useCharacter,
  webview: useWebview,
  worldEvent: useWorldEvent,
  dialog: useDialog,
  map: useMap,
  game: useGame,
  world: useWorld,
  inventory: useInventory,
  gossip: useGossip,
  emoji: useEmoji,
  visualEffect: useVisualEffect,
};
