//! temp
import * as fetch from "./lib/fetch";
import { RootState } from "./lib/store";
import { Store } from "@util/client";
import { TextureLoader } from "three";
import { gqlTemp } from "@shared/client";
export const st = {} as Store<RootState>;
Object.assign(gqlTemp, fetch);
//! temp
export * as store from "./lib/store";
export * as fetch from "./lib/fetch";
export * from "./lib/dict";
export * from "./lib/_decentverse/_client";
export * as Asset from "./lib/asset/_client";
export * as CallRoom from "./lib/callRoom/_client";
export * as Character from "./lib/character/_client";
export * as Collision from "./lib/collision/_client";
export * as Dialog from "./lib/dialog/_client";
export * as Live from "./lib/live/_client";
export * as Map from "./lib/map/_client";
export * as Placement from "./lib/placement/_client";
export * as Teleport from "./lib/teleport/_client";
export * as Tile from "./lib/tile/_client";
export * as Webview from "./lib/webview/_client";
export const loader = new TextureLoader();
loader.setCrossOrigin("anonymous");
