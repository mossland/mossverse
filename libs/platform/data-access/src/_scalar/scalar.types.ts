import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
import { contractFragment, thingFragment, tokenFragment, walletFragment } from "libs/shared/data-access/src/types";
export type PriceTagInput = {
  thing?: types.ID;
  token?: types.ID;
  price: number;
  type: cnst.PriceTagType;
};

export type PriceTag = {
  type: cnst.PriceTagType;
  token?: types.shared.Token;
  thing?: types.shared.Thing;
  price: number;
};

export const priceTagFragment = gql`
  ${tokenFragment}
  ${thingFragment}
  fragment priceTagFragment on PriceTag {
    type
    token {
      ...tokenFragment
    }
    thing {
      ...thingFragment
    }
    price
  }
`;
