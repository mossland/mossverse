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
} from "@shared/util-client";
import { ThingItem } from "../thing/thing.gql";
import { Keyring } from "../keyring/keyring.gql";

@InputType("UserInput")
export class UserInput {
  @Field(() => String)
  nickname: string;
}

@ObjectType("User", { _id: "id" })
export class User extends BaseGql(UserInput) {
  @Field(() => String)
  role: cnst.UserRole;

  @Field(() => [ThingItem])
  items: ThingItem[];

  @Field(() => [Keyring], { nullable: true })
  keyring: Keyring | null;

  @Field(() => String)
  status: cnst.UserStatus;
}
