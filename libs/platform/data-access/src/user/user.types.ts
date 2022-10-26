import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
import { baseUserFragment, defaultBaseUser, purifyBaseUser } from "libs/shared/data-access/src/types";

export type UserInput = types.shared.BaseUserInput & {
  //
};

export type User = types.shared.BaseUser & {
  //
};

export const defaultUser: User = {
  ...defaultBaseUser,
  //
};

export const purifyUser = (user: User): UserInput => ({
  ...purifyBaseUser(user),
  //
});

export const userFragment = gql`
  ${baseUserFragment}
  fragment userFragment on User {
    ...baseUserFragment
  }
`;

export type MyItem = {
  token?: types.shared.Token;
  thing?: types.shared.Thing;
  type: "token" | "thing";
  num: number;
};
