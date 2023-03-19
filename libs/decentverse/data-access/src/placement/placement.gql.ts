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
import { gql as shared } from "@shared/data-access";

import { Asset, LightAsset } from "../asset/asset.gql";
import { Map } from "../map/map.gql";
@InputType("PlacementInput")
export class PlacementInput {
  @Field(() => Map)
  map: Map;

  @Field(() => Asset)
  asset: Asset | LightAsset;

  @Field(() => [Float])
  center: [number, number];

  @Field(() => [Float])
  wh: [number, number];
}

@ObjectType("Placement", { _id: "id" })
export class Placement extends BaseGql(PlacementInput) {
  @Field(() => String)
  status: cnst.PlacementStatus;
}

@ObjectType("LightPlacement", { _id: "id", gqlRef: "Placement" })
export class LightPlacement extends PickType(Placement, ["asset", "center", "wh", "status"] as const) {}

@ObjectType("PlacementSummary")
export class PlacementSummary {
  @Field(() => Int)
  totalPlacement: number;
}

export const placementQueryMap: { [key in keyof PlacementSummary]: any } = {
  totalPlacement: { status: { $ne: "inactive" } },
};

export const placementGraphQL = createGraphQL("placement" as const, Placement, PlacementInput, LightPlacement);
export const {
  getPlacement,
  listPlacement,
  placementCount,
  placementExists,
  createPlacement,
  updatePlacement,
  removePlacement,
  placementFragment,
  lightPlacementFragment,
  purifyPlacement,
  crystalizePlacement,
  lightCrystalizePlacement,
  defaultPlacement,
  mergePlacement,
} = placementGraphQL;
