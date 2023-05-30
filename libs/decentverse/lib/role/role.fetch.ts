import {
  BaseArrayFieldGql,
  BaseGql,
  Field,
  InputType,
  Int,
  ObjectType,
  PickType,
  cnst,
  createFragment,
  createGraphQL,
} from "@util/client";
import { Map } from "../map/map.fetch";

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

@ObjectType("RoleSummary")
export class RoleSummary {
  @Field(() => Int)
  totalRole: number;
}

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
  crystalizeRole,
  lightCrystalizeRole,
  defaultRole,
  mergeRole,
} = roleGraphQL;
