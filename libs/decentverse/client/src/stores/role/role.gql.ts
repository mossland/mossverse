import { query, mutate } from "../gql";
import gql from "graphql-tag";
import * as types from "./role.types";

// * Role Query
export type RoleQuery = { role: types.Role };
export const roleQuery = gql`
  ${types.roleFragment}
  query role($roleId: ID!) {
    role(roleId: $roleId) {
      ...roleFragment
    }
  }
`;
export const role = async (roleId: string) => (await query<RoleQuery>(roleQuery, { roleId })).role;

// * Roles Query
export type RolesQuery = { roles: types.Role[] };
export const rolesQuery = gql`
  ${types.roleFragment}
  query roles($query: JSON!, $skip: Int, $limit: Int) {
    roles(query: $query, skip: $skip, limit: $limit) {
      ...roleFragment
    }
  }
`;
export const roles = async (qry: any, skip = 0, limit = 0) =>
  (await query<RolesQuery>(rolesQuery, { query: qry, skip, limit })).roles;

// * Create Role Mutation
export type CreateRoleMutation = { createRole: types.Role };
export const createRoleMutation = gql`
  ${types.roleFragment}
  mutation createRole($data: RoleInput!) {
    createRole(data: $data) {
      ...roleFragment
    }
  }
`;
export const createRole = async (data: types.RoleInput) =>
  (await mutate<CreateRoleMutation>(createRoleMutation, { data })).createRole;

// * Update Role Mutation
export type UpdateRoleMutation = { updateRole: types.Role };
export const updateRoleMutation = gql`
  ${types.roleFragment}
  mutation updateRole($roleId: ID!, $data: RoleInput!) {
    updateRole(roleId: $role, data: $data) {
      ...roleFragment
    }
  }
`;
export const updateRole = async (roleId: string, data: types.RoleInput) =>
  (await mutate<UpdateRoleMutation>(updateRoleMutation, { roleId, data })).updateRole;

// * Remove Admin Mutation
export type RemoveRoleMutation = { removeRole: types.Role };
export const removeRoleMutation = gql`
  ${types.roleFragment}
  mutation removeRole($roleId: ID!) {
    removeRole(roleId: $roleId) {
      ...roleFragment
    }
  }
`;
export const removeRole = async (roleId: string) =>
  (await mutate<RemoveRoleMutation>(removeRoleMutation, { roleId })).removeRole;
