import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  BaseArrayFieldGql,
  Int,
  ID,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";

@InputType("UserInput")
export class UserInput implements shared.UserInput {
  @Field(() => String)
  nickname: string;

  @Field(() => shared.File, { nullable: true })
  image: shared.File | null;

  @Field(() => [String])
  requestRoles: cnst.UserRole[];
}

@ObjectType("User", { _id: "id" })
export class User extends BaseGql(UserInput) implements shared.User {
  @Field(() => [String])
  roles: cnst.UserRole[];

  @Field(() => ID)
  keyring: string;

  @Field(() => String)
  status: cnst.UserStatus;
}

@ObjectType("LightUser", { _id: "id", gqlRef: "User" })
export class LightUser extends User {}
// PickType(User, [] as const) {}

export const userGraphQL = createGraphQL("user" as const, User, UserInput, LightUser);
export const {
  getUser,
  listUser,
  userCount,
  userExists,
  createUser,
  updateUser,
  removeUser,
  userFragment,
  lightUserFragment,
  purifyUser,
  crystalizeUser,
  lightCrystalizeUser,
  defaultUser,
  mergeUser,
} = userGraphQL;
