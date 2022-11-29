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
  ID,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Emoji } from "../emoji/emoji.gql";

@InputType("HotkeyInput")
export class HotkeyInput {
  @Field(() => String)
  key: string;

  @Field(() => Emoji)
  emoji: Emoji;
}
@ObjectType("Hotkey")
export class Hotkey extends BaseArrayFieldGql(HotkeyInput) {}

@InputType("UserInput")
export class UserInput extends shared.User {
  @Field(() => [Hotkey])
  hotkeys: Hotkey[];

  @Field(() => [Int])
  currentPosition: number[];

  @Field(() => ID, { nullable: true })
  currentMap: string | null;
}

@ObjectType("User", { _id: "id" })
export class User extends UserInput {}

@ObjectType("LightUser", { _id: "id", gqlRef: "User" })
export class LightUser extends PickType(User, ["status"] as const) {}

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
  purifyUser,
  defaultUser,
} = userGraphQL;
export type UserSlice = SliceModel<"user", User, LightUser>;

// ! Need to refactor
export type MyItem = {
  token: shared.Token | null;
  user: shared.User | null;
  thing: shared.Thing | null;
  type: "token" | "thing" | "user";
  num: number;
};

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

export const whoAmI = async () => (await query<WhoAmIQuery>(whoAmIQuery)).whoAmI;

// * GetUserTokenList Query
export type GetUserTokenListQuery = { getUserTokenList: [number] };
export const getUserTokenListQuery = graphql`
  query getUserTokenList($address: String!, $contract: String!) {
    getUserTokenList(address: $address, contract: $contract)
  }
`;

export const getUserTokenList = async (address: string, contract: string) =>
  (
    await query<GetUserTokenListQuery>(getUserTokenListQuery, {
      address,
      contract,
    })
  ).getUserTokenList;
