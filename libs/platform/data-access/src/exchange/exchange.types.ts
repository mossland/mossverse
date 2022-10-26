import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
import { userFragment, priceTagFragment } from "../types";
import {
  contractFragment,
  productFragment,
  thingFragment,
  tokenFragment,
  walletFragment,
} from "libs/shared/data-access/src/types";
export type ExchangeInput = {
  token?: types.ID;
  thing?: types.ID;
  product?: types.ID;
};

export type Exchange = {
  id: types.ID;
  type: cnst.ExchangeType;
  wallet: types.shared.Wallet;
  token?: types.shared.Token;
  thing?: types.shared.Thing;
  product?: types.shared.Product;
  hash?: string;
  num: number;
};

export const exchangeFragment = gql`
  ${tokenFragment}
  ${thingFragment}
  ${walletFragment}
  ${productFragment}
  fragment exchangeFragment on Exchange {
    id
    wallet {
      ...walletFragment
    }
    token {
      ...tokenFragment
    }
    thing {
      ...thingFragment
    }
    product {
      ...productFragment
    }
    hash
    type
    num
  }
`;
