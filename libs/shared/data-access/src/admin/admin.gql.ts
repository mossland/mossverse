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
  SliceModel,
} from "@shared/util-client";
import { AccessToken } from "../_scalar";

@InputType("AdminInput")
export class AdminInput {
  @Field(() => String)
  accountId: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  password: string | null;
}

@ObjectType("Admin", { _id: "id" })
export class Admin extends BaseGql(AdminInput) {
  @Field(() => String)
  role: cnst.AdminRole;

  @Field(() => String)
  status: cnst.AdminStatus;
}

@ObjectType("LightAdmin", { _id: "id", gqlRef: "Admin" })
export class LightAdmin extends PickType(Admin, ["accountId", "email", "role", "status"] as const) {}

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
  defaultAdmin,
} = adminGraphQL;
export type AdminSlice = SliceModel<"admin", Admin, LightAdmin>;

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
export const me = async () => (await query<MeQuery>(meQuery)).me;

// * Signin Admin Mutation
export type SigninAdminMutation = { signinAdmin: AccessToken };
export const signinAdminMutation = graphql`
  mutation signinAdmin($accountId: String!, $password: String!) {
    signinAdmin(accountId: $accountId, password: $password) {
      accessToken
    }
  }
`;
export const signinAdmin = async (accountId: string, password: string) =>
  (await mutate<SigninAdminMutation>(signinAdminMutation, { accountId, password })).signinAdmin;
