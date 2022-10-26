import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
export type AdminInput = {
  accountId: string;
  email: string;
  password: string | null;
};

export type Admin = {
  id: string;
  accountId: string;
  email: string;
  password: string | null;
  role: cnst.AdminRole;
  status: cnst.AdminStatus;
  createdAt: Date;
  updatedAt: Date;
};

export const defaultAdmin: Nullable<Admin> = {
  id: null,
  accountId: "",
  email: "",
  password: "",
  role: "admin",
  status: null,
  createdAt: null,
  updatedAt: null,
};
export const purifyAdmin = (admin: Admin): AdminInput => ({
  accountId: admin.accountId,
  email: admin.email,
  password: admin.password,
});

export const adminFragment = gql`
  fragment adminFragment on Admin {
    id
    accountId
    email
    password
    role
    status
    createdAt
    updatedAt
  }
`;
