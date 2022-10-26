import { client } from "../gql";
import gql from "graphql-tag";
import * as types from "../types";
import { Nullable } from "@shared/util-client";

export type RoleInput = {
  name: string;
  areas: types.AreaInput[];
};
export type Role = {
  id: string;
  name: string;
  areas: types.Area[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
export const defaultRole: Nullable<Role> = {
  id: null,
  name: null,
  areas: [],
  status: null,
  createdAt: null,
  updatedAt: null,
};
export const purifyRole = (role: Role): RoleInput => ({
  name: role.name,
  areas: role.areas.map((area) => types.purifyArea(area)),
});

export const roleFragment = gql`
  ${types.areaFragment}
  fragment roleFragment on Role {
    id
    name
    areas {
      ...areaFragment
    }
    status
    createdAt
    updatedAt
  }
`;
