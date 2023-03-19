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
  PickType,
  Int,
} from "@shared/util-client";
import { AccessToken } from "../_scalar";

@InputType("AdminInput")
export class AdminInput {
  @Field(() => String)
  accountId: string;

  @Field(() => String, { nullable: true })
  password: string | null;
}

@ObjectType("Admin", { _id: "id" })
export class Admin extends BaseGql(AdminInput) {
  @Field(() => [String])
  roles: cnst.AdminRole[];

  @Field(() => String)
  status: cnst.AdminStatus;

  hasAccess(role: cnst.AdminRole) {
    if (role === "superAdmin") return this.roles.includes("superAdmin");
    if (role === "admin") return this.roles.includes("superAdmin") || this.roles.includes("admin");
    else return false;
  }
}

@ObjectType("LightAdmin", { _id: "id", gqlRef: "Admin" })
export class LightAdmin extends PickType(Admin, ["accountId", "roles", "status"] as const) {}

@ObjectType("AdminSummary")
export class AdminSummary {
  @Field(() => Int)
  totalAdmin: number;
}

export const adminQueryMap: { [key: string]: any } = {
  totalAdmin: { status: { $ne: "inactive" } },
};

export const adminGraphQL = createGraphQL("admin" as const, Admin, AdminInput, LightAdmin);
export const {
  getAdmin,
  listAdmin,
  adminCount,
  adminExists,
  createAdmin,
  updateAdmin,
  removeAdmin,
  adminFragment,
  purifyAdmin,
  crystalizeAdmin,
  lightCrystalizeAdmin,
  defaultAdmin,
  mergeAdmin,
} = adminGraphQL;

// * Ping Query
export type PingQuery = { ping: string };
export const pingQuery = graphql`
  query ping {
    ping
  }
`;
export const ping = async () => (await query<PingQuery>(pingQuery)).ping;

// * Me Query
export type MeQuery = { me: Admin };
export const meQuery = graphql`
  ${adminFragment}
  query me {
    me {
      ...adminFragment
    }
  }
`;
export const me = async () => crystalizeAdmin((await query<MeQuery>(meQuery)).me);

// * Signin Admin Mutation
export type SigninAdminMutation = { signinAdmin: AccessToken };
export const signinAdminMutation = graphql`
  mutation signinAdmin($accountId: String!, $password: String!) {
    signinAdmin(accountId: $accountId, password: $password) {
      jwt
    }
  }
`;
export const signinAdmin = async (accountId: string, password: string) =>
  (await mutate<SigninAdminMutation>(signinAdminMutation, { accountId, password })).signinAdmin;

export type AddAdminRoleMutation = { addAdminRole: Admin };
export const addAdminRoleMutation = graphql`
  ${adminFragment}
  mutation addAdminRole($adminId: ID!, $role: String!) {
    addAdminRole(adminId: $adminId, role: $role) {
      ...adminFragment
    }
  }
`;
export const addAdminRole = async (adminId: string, role: cnst.AdminRole) =>
  (await mutate<AddAdminRoleMutation>(addAdminRoleMutation, { adminId, role })).addAdminRole;

export type SubAdminRoleMutation = { subAdminRole: Admin };
export const subAdminRoleMutation = graphql`
  ${adminFragment}
  mutation subAdminRole($adminId: ID!, $role: String!) {
    subAdminRole(adminId: $adminId, role: $role) {
      ...adminFragment
    }
  }
`;
export const subAdminRole = async (adminId: string, role: cnst.AdminRole) =>
  (await mutate<SubAdminRoleMutation>(subAdminRoleMutation, { adminId, role })).subAdminRole;
