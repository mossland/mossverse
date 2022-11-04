import { query, mutate } from "../gql";
import * as types from "../types";
import gql from "graphql-tag";

// * WhoAmI Query
export type WhoAmIQuery = { whoAmI: types.User };

export const whoAmIQuery = gql`
  ${types.userFragment}
  query whoAmI {
    whoAmI {
      ...userFragment
    }
  }
`;

export const whoAmI = async () => (await query<WhoAmIQuery>(whoAmIQuery)).whoAmI;

// * user Query
export type UserQuery = { user: types.User };
export const userQuery = gql`
  ${types.userFragment}
  query user($userId: ID!) {
    user(userId: $userId) {
      ...userFragment
    }
  }
`;
export const user = async (userId: string) => (await query<UserQuery>(userQuery, { userId })).user;

// * users Query
export type UsersQuery = { users: types.User[] };
export const usersQuery = gql`
  ${types.userFragment}
  query users($query: JSON!, $skip: Float!, $limit: Float!) {
    users(query: $query, skip: $skip, limit: $limit) {
      ...userFragment
    }
  }
`;
export const users = async (qry: any, skip = 0, limit = 0) =>
  (await query<UsersQuery>(usersQuery, { qry, skip, limit })).users;

// * GetUserTokenList Query
export type GetUserTokenListQuery = { getUserTokenList: [number] };
export const getUserTokenListQuery = gql`
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

// * UpdateUser Mutation
export type UpdateUserMutation = { updateUser: types.User };

export const updateUserMutation = gql`
  ${types.userFragment}
  mutation updateUser($userId: ID!, $data: UserInput!) {
    updateUser(userId: $userId, data: $data) {
      ...userFragment
    }
  }
`;

export const updateUser = async (userId: types.ID, data: types.UserInput) =>
  (
    await mutate<UpdateUserMutation>(updateUserMutation, {
      userId,
      data,
    })
  ).updateUser;

// * CreateUser Mutation
export type CreateUserMutation = { createUser: types.User };

export const createUserMutation = gql`
  ${types.userFragment}
  mutation createUser($data: UserInput!) {
    createUser(data: $data) {
      ...userFragment
    }
  }
`;

export const createUser = async (data: types.UserInput) =>
  (await mutate<CreateUserMutation>(createUserMutation, { data })).createUser;
