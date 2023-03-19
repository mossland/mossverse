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
  PickType,
  ID,
} from "@shared/util-client";
import { Keyring } from "../keyring/keyring.gql";
import { File } from "../file/file.gql";

@InputType("UserInput")
export class UserInput {
  @Field(() => String)
  nickname: string;

  @Field(() => File, { nullable: true })
  image: File | null;

  @Field(() => [String])
  requestRoles: cnst.UserRole[];
}

@ObjectType("User", { _id: "id" })
export class User extends BaseGql(UserInput) {
  @Field(() => [String])
  roles: cnst.UserRole[];

  @Field(() => ID)
  keyring: string;

  @Field(() => String)
  status: cnst.UserStatus;
}

@ObjectType("LightUser", { _id: "id", gqlRef: "User" })
export class LightUser extends PickType(User, ["nickname", "image"] as const) {}
