import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  createFragment,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  Int,
  BaseArrayFieldGql,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Collision, MapConfig } from "../_scalar/scalar.gql";
import { Webview } from "../webview/webview.gql";
import { Placement } from "../asset/asset.gql";
import { Live } from "../live/live.gql";
import { Dialogue } from "../dialog/dialog.gql";
import { CallRoom } from "../callRoom/callRoom.gql";

@InputType("TileInput")
export class TileInput {
  @Field(() => shared.File, { nullable: true })
  top: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  bottom: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  lighting: shared.File | null;
}

@ObjectType("Tile")
export class Tile extends BaseArrayFieldGql(TileInput) {}
export const tileFragment = createFragment(Tile);

@InputType("MapInput")
export class MapInput {
  @Field(() => String)
  name: string;

  @Field(() => Int, { default: 200 })
  tileSize: number;

  @Field(() => shared.File, { nullable: true })
  top: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  bottom: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  lighting: shared.File | null;

  @Field(() => [Placement])
  placements: Placement[];

  @Field(() => [Collision])
  collisions: Collision[];

  @Field(() => [Webview])
  webviews: Webview[];

  @Field(() => [Live])
  lives: Live[];

  @Field(() => [CallRoom])
  callRooms: CallRoom[];

  @Field(() => [Dialogue])
  dialogues: Dialogue[];

  @Field(() => MapConfig)
  config: MapConfig;
}

@ObjectType("Map", { _id: "id" })
export class Map extends BaseGql(MapInput) {
  @Field(() => [Tile]) // ! 2단계 이상 Array 처리 필요
  tiles: Tile[][];

  @Field(() => [Int])
  wh: [number, number];

  @Field(() => String)
  status: cnst.MapStatus;
}

@ObjectType("LightMap", { _id: "id", gqlRef: "Map" })
export class LightMap extends PickType(Map, ["status"] as const) {}

export const mapGraphQL = createGraphQL("map" as const, Map, MapInput, LightMap);
export const {
  getMap,
  listMap,
  mapCount,
  mapExists,
  createMap,
  updateMap,
  removeMap,
  mapFragment,
  purifyMap,
  defaultMap,
} = mapGraphQL;
export type MapSlice = SliceModel<"map", Map, LightMap>;

// * Add MapFiles Mutation
export type AddMapFilesMutation = { addMapFiles: shared.File[] };
export const addMapFilesMutation = graphql`
  ${shared.fileFragment}
  mutation addMapFiles($files: [Upload!]!, $mapId: String) {
    addMapFiles(files: $files, mapId: $mapId) {
      ...fileFragment
    }
  }
`;
export const addMapFiles = async (files: FileList, mapId?: string) =>
  (await mutate<AddMapFilesMutation>(addMapFilesMutation, { files, mapId })).addMapFiles;

export const mainTools = ["assets", "interaction", "dialog"] as const;
export type MainTool = typeof mainTools[number];
export const editModes = ["select", "add", "modify", "option"] as const;
export type EditMode = typeof editModes[number];
