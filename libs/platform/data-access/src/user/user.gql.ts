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
  makeDefault,
  makePurify,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";

@InputType("UserInput")
export class UserInput extends shared.User {}

@ObjectType("User", { _id: "id" })
export class User extends UserInput {}

export const userGraphQL = createGraphQL<"user", User, UserInput>(User, UserInput);
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
