import {
  BaseGql,
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  PickType,
  cnst,
  createGraphQL,
  graphql,
  mutate,
} from "@util/client";
import { MapConfig, MapPosition } from "../_decentverse/decentverse.fetch";
import { ReactNode } from "react";
import { fetch } from "../../client";
import { fetch as shared } from "@shared/client";

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

export type MapModuleType = {
  key: string;
  layerView: {
    selected: boolean;
  };
  edit?: ReactNode;
  world?: ReactNode;
  list?: ReactNode;
  preview?: ReactNode;
};

export type EditModuleType = {
  key: string;
  layerView: boolean;
  edit: ReactNode;
  preview: ReactNode;
  modal: ReactNode;
  select: ReactNode;
  world: (map: fetch.Map) => ReactNode;
};

export type ViewModuleType = {
  key: string;
  view?: ReactNode;
};

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
  initMap,
  viewMap,
  editMap,
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
