import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
import { userFragment } from "@platform/data-access";

export type MocWalletInput = {
  address: string;
  user: types.lib.ID;
};

export type MocWallet = {
  id: types.lib.ID;
  address: string;
  user: types.lib.User;
  status: cnst.MocWalletStatus;
  expireAt: Date;
  type: cnst.MocWalletType;
};

export const defaultMocWallet: Nullable<MocWallet> = {
  id: null,
  address: null,
  user: null,
  status: null,
  expireAt: null,
  type: null,
};

export const mocWalletFragment = gql`
  ${userFragment}
  fragment mocWalletFragment on MocWallet {
    id
    address
    user {
      ...userFragment
    }
    status
    expireAt
    type
  }
`;
