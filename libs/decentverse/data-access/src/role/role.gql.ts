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
  BaseArrayFieldGql,
  Int,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { Map } from "../map/map.gql";

@InputType("AreaInput")
export class AreaInput {
  @Field(() => Map)
  map: Map;

  @Field(() => [Int])
  center: [number, number];

  @Field(() => [Int])
  wh: [number, number];
}

@ObjectType("Area")
export class Area extends BaseArrayFieldGql(AreaInput) {}
export const areaFragment = createFragment(Area);

@InputType("RoleInput")
export class RoleInput {
  @Field(() => String)
  name: string;

  @Field(() => [Area])
  areas: Area[];
}

@ObjectType("Role", { _id: "id" })
export class Role extends BaseGql(RoleInput) {
  @Field(() => String)
  status: cnst.RoleStatus;
}

@ObjectType("LightRole", { _id: "id", gqlRef: "Role" })
export class LightRole extends PickType(Role, ["status"] as const) {}

export const roleGraphQL = createGraphQL("role" as const, Role, RoleInput, LightRole);
export const {
  getRole,
  listRole,
  roleCount,
  roleExists,
  createRole,
  updateRole,
  removeRole,
  roleFragment,
  purifyRole,
  defaultRole,
} = roleGraphQL;
export type RoleSlice = SliceModel<"role", Role, LightRole>;
