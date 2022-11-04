export { types as shared } from "@shared/data-access";
export * from "./_scalar/scalar.types";
export * from "./inventory/inventory.types";
export * from "./asset/asset.types";
export * from "./character/character.types";
export * from "./game/game.types";
export * from "./map/map.types";
export * from "./world/world.types";
export * from "./gossip/gossip.types";
export * from "./user/user.types";
export * from "./role/role.types";
export * from "./callRoom/callRoom.types";
export * from "./dialog/dialog.types";
export * from "./emoji/emoji.types";
export type ID = string;

export const layerTypes = ["top", "bottom", "lighting"] as const;
export type LayerType = typeof layerTypes[number];

export const mapStatuses = ["active", "inactive"] as const;
export type MapStatus = typeof mapStatuses[number];
