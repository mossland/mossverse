import { BaseGql, Field, Float, InputType, Int, ObjectType, PickType, cnst, createGraphQL } from "@util/client";
import { Map } from "../map/map.fetch";
import { fetch as shared } from "@shared/client";

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
  initTile,
  viewTile,
  editTile,
} = tileGraphQL;
