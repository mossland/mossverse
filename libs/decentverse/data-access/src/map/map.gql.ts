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
  Float,
  PickType,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { MapConfig, MapPosition } from "../_scalar/scalar.gql";

@InputType("MapInput")
export class MapInput {
  @Field(() => String)
  name: string;

  @Field(() => shared.File, { nullable: true })
  splash: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  logo: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  miniView: shared.File | null;

  @Field(() => [Float])
  startPosition: [number, number];

  @Field(() => [MapPosition])
  spawnPositions: MapPosition[];

  @Field(() => MapConfig)
  config: MapConfig;
}

@ObjectType("Map", { _id: "id" })
export class Map extends BaseGql(MapInput) {
  @Field(() => [Float])
  wh: [number, number];

  @Field(() => String)
  status: cnst.MapStatus;

  getSpawnPosition(key?: string) {
    const matchingPosition =
      this.spawnPositions.find((p) => p.key === key)?.position ??
      (this.startPosition.length ? this.startPosition : [500, 500]);
    return matchingPosition;
  }
}

@ObjectType("LightMap", { _id: "id", gqlRef: "Map" })
export class LightMap extends PickType(Map, ["name"] as const) {}

@ObjectType("MapSummary")
export class MapSummary {
  @Field(() => Int)
  totalMap: number;
}

export const mapQueryMap: { [key in keyof MapSummary]: any } = {
  totalMap: { status: { $ne: "inactive" } },
};

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
  crystalizeMap,
  lightCrystalizeMap,
  defaultMap,
  mergeMap,
} = mapGraphQL;

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
