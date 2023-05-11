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
  PickType,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { gql as decentverse } from "@decentverse/data-access";
import { gql as social } from "@social/data-access";

@InputType("HotkeyInput")
export class HotkeyInput {
  @Field(() => String)
  key: string;

  @Field(() => social.Emoji)
  emoji: social.Emoji;
}
@ObjectType("Hotkey")
export class Hotkey extends BaseArrayFieldGql(HotkeyInput) {}

@InputType("UserInput")
export class UserInput extends shared.User {
  //!에러나서 주석처리
  // @Field(() => [Hotkey])
  // hotkeys: Hotkey[];

  @Field(() => [Int])
  currentPosition: number[];

  @Field(() => ID, { nullable: true })
  currentMap: string | null;
}

@ObjectType("User", { _id: "id" })
export class User extends UserInput {}

@ObjectType("LightUser", { _id: "id", gqlRef: "User" })
export class LightUser extends PickType(User, ["status", "nickname", "roles"] as const) {}

@ObjectType("UserSummary")
export class UserSummary {
  @Field(() => Int)
  totalUser: number;
}

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

// * WhoAmI Query
export type WhoAmIQuery = { whoAmI: User };
export const whoAmIQuery = graphql`
  ${userFragment}
  query whoAmI {
    whoAmI {
      ...userFragment
    }
  }
`;
export const whoAmI = async () => crystalizeUser((await query<WhoAmIQuery>(whoAmIQuery)).whoAmI);
