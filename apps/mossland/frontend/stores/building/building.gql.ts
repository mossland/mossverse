import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import { createGraphQL, Field, InputType, ObjectType, BaseGql, Int, Float, PickType } from "@shared/util-client";
import { gql as shared } from "@shared/data-access";

@InputType("BuildingInput")
export class BuildingInput {
  @Field(() => String)
  field: string;
}

@ObjectType("Building", { _id: "id" })
export class Building extends BaseGql(BuildingInput) {
  @Field(() => String)
  status: string;
}

@ObjectType("LightBuilding", { _id: "id", gqlRef: "Building" })
export class LightBuilding extends PickType(Building, ["status"] as const) {}

@ObjectType("BuildingSummary")
export class BuildingSummary {
  @Field(() => Int)
  totalBuilding: number;
}

export const buildingGraphQL = createGraphQL("building" as const, Building, BuildingInput, LightBuilding);
export const {
  getBuilding,
  listBuilding,
  buildingCount,
  buildingExists,
  createBuilding,
  updateBuilding,
  removeBuilding,
  buildingFragment,
  lightBuildingFragment,
  purifyBuilding,
  crystalizeBuilding,
  lightCrystalizeBuilding,
  defaultBuilding,
  mergeBuilding,
} = buildingGraphQL;
