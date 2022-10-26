import * as types from "../types";
import { cnst } from "@shared/util";
import gql from "graphql-tag";
import { thingItemFragment } from "../thing/thing.types";
import { keyringFragment } from "../keyring/keyring.types";
import { Nullable } from "@shared/util-client";

export type BaseUserInput = {
  nickname: string | null;
};
export type BaseUser = {
  id: string;
  nickname: string;
  role: cnst.UserRole;
  items: types.ThingItem[];
  keyring: types.Keyring | null;
  status: cnst.UserStatus;
  createdAt: Date;
  updatedAt: Date;
};
export const defaultBaseUser: BaseUser = {
  id: "",
  nickname: "Type Nicknake",
  role: "guest",
  items: [],
  keyring: null,
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const purifyBaseUser = (user: BaseUser): BaseUserInput => ({
  nickname: user.nickname,
});
export const baseUserFragment = gql`
  ${thingItemFragment}
  ${keyringFragment}
  fragment baseUserFragment on User {
    id
    role
    nickname
    items {
      ...thingItemFragment
    }
    keyring {
      ...keyringFragment
    }
    status
    createdAt
    updatedAt
  }
`;
