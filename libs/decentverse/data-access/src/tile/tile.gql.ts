import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  ObjectType,
  BaseGql,
  Int,
  Float,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { Map } from "../map/map.gql";
import { gql as shared } from "@shared/data-access";

@InputType("TileInput")
export class TileInput {
  @Field(() => Map)
  map: Map;

  @Field(() => shared.File, { nullable: true })
  top: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  wall: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  bottom: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  lighting: shared.File | null;

  @Field(() => [Float])
  center: [number, number];

  @Field(() => [Float])
  wh: [number, number];
}

@ObjectType("Tile", { _id: "id" })
export class Tile extends BaseGql(TileInput) {
  @Field(() => String)
  status: cnst.TileStatus;
}

@ObjectType("LightTile", { _id: "id", gqlRef: "Tile" })
export class LightTile extends PickType(Tile, [
  "top",
  "bottom",
  "wall",
  "lighting",
  "center",
  "wh",
  "status",
] as const) {}

@ObjectType("TileSummary")
export class TileSummary {
  @Field(() => Int)
  totalTile: number;
}

export const tileQueryMap: { [key in keyof TileSummary]: any } = {
  totalTile: { status: { $ne: "inactive" } },
};

export const tileGraphQL = createGraphQL("tile" as const, Tile, TileInput, LightTile);
export const {
  getTile,
  listTile,
  tileCount,
  tileExists,
  createTile,
  updateTile,
  removeTile,
  tileFragment,
  lightTileFragment,
  purifyTile,
  crystalizeTile,
  lightCrystalizeTile,
  defaultTile,
  mergeTile,
  addTileFiles,
} = tileGraphQL;
