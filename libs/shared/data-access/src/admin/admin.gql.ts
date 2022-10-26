import { query, mutate } from "../apollo";
import * as types from "../types";
import gql from "graphql-tag";

// * Ping Query

export type PingQuery = { ping: string };
export const pingQuery = gql`
  query ping {
    ping
  }
`;
export const ping = async () => (await query<PingQuery>(pingQuery)).ping;

// * Me Query
export type MeQuery = { me: types.Admin };
export const meQuery = gql`
  ${types.adminFragment}
  query me {
    me {
      ...adminFragment
    }
  }
`;
export const me = async () => (await query<MeQuery>(meQuery)).me;

// * Admin Query
export type AdminQuery = { admin: types.Admin };
export const adminQuery = gql`
  ${types.adminFragment}
  query admin($adminId: ID!) {
    admin(adminId: $adminId) {
      ...adminFragment
    }
  }
`;
export const admin = async (adminId: string) => (await query<AdminQuery>(adminQuery, { adminId })).admin;

// * Admins Query
export type AdminsQuery = { admins: types.Admin[]; adminCount: number };
export const adminsQuery = gql`
  ${types.adminFragment}
  query admins($query: JSON!, $skip: Int, $limit: Int) {
    admins(query: $query, skip: $skip, limit: $limit) {
      ...adminFragment
    }
    adminCount(query: $query)
  }
`;
export const admins = async (qry: any, skip = 0, limit = 0) =>
  (await query<AdminsQuery>(adminsQuery, { query: qry, skip, limit })).admins;

// * Create Admin Mutation
export type CreateAdminMutation = { createAdmin: types.Admin };
export const createAdminMutation = gql`
  ${types.adminFragment}
  mutation createAdmin($data: AdminInput!) {
    createAdmin(data: $data) {
      ...adminFragment
    }
  }
`;
export const createAdmin = async (data: types.AdminInput) =>
  (await mutate<CreateAdminMutation>(createAdminMutation, { data })).createAdmin;

// * Update Admin Mutation

export type UpdateAdminMutation = { updateAdmin: types.Admin };
export const updateAdminMutation = gql`
  ${types.adminFragment}
  mutation updateAdmin($adminId: ID!, $data: AdminInput!) {
    updateAdmin(adminId: $adminId, data: $data) {
      ...adminFragment
    }
  }
`;
export const updateAdmin = async (adminId: string, data: types.AdminInput) =>
  (await mutate<UpdateAdminMutation>(updateAdminMutation, { adminId, data })).updateAdmin;

// * Remove Admin Mutation
export type RemoveAdminMutation = { removeAdmin: types.Admin };
export const removeAdminMutation = gql`
  ${types.adminFragment}
  mutation removeAdmin($adminId: ID!) {
    removeAdmin(adminId: $adminId) {
      ...adminFragment
    }
  }
`;
export const removeAdmin = async (adminId: string) =>
  (await mutate<RemoveAdminMutation>(removeAdminMutation, { adminId })).removeAdmin;

// * Signin Admin Mutation
export type SigninAdminMutation = { signinAdmin: types.AccessToken };
export const signinAdminMutation = gql`
  mutation signinAdmin($accountId: String!, $password: String!) {
    signinAdmin(accountId: $accountId, password: $password) {
      accessToken
    }
  }
`;
export const signinAdmin = async (accountId: string, password: string) =>
  (await mutate<SigninAdminMutation>(signinAdminMutation, { accountId, password })).signinAdmin;
