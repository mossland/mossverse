import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
import { userFragment, exchangeFragment, shipInfoFragment } from "../types";
import { listingFragment } from "../listing/listing.types";
import { walletFragment } from "libs/shared/data-access/src/types";

export type ReceiptInput = {
  from?: types.ID;
  fromWallet?: types.ID;
  to?: types.ID;
  toWallet?: types.ID;
  listing?: types.ID;
  inputs: types.ExchangeInput[];
  outputs: types.ExchangeInput[];
  shipInfo?: types.ShipInfo;
};

export type Receipt = {
  id: types.ID;
  from: types.User;
  fromWallet: types.shared.Wallet;
  to: types.User;
  toWallet: types.shared.Wallet;
  listing: types.Listing;
  inputs: types.Exchange[];
  outputs: types.Exchange[];
  shipInfo?: types.ShipInfo;
  status: cnst.ReceiptStatus;
  createdAt: Date;
  updatedAt: Date;
};

export const defaultReceipt: Nullable<Receipt> = {
  id: null,
  from: null,
  fromWallet: null,
  to: null,
  toWallet: null,
  inputs: null,
  outputs: null,
  listing: null,
  status: null,
  createdAt: null,
  updatedAt: null,
};

export const receiptFragment = gql`
  ${exchangeFragment}
  ${userFragment}
  ${walletFragment}
  ${listingFragment}
  ${shipInfoFragment}
  fragment receiptFragment on Receipt {
    id
    from {
      ...userFragment
    }
    to {
      ...userFragment
    }
    inputs {
      ...exchangeFragment
    }
    outputs {
      ...exchangeFragment
    }
    fromWallet {
      ...walletFragment
    }
    toWallet {
      ...walletFragment
    }
    listing {
      ...listingFragment
    }
    # trade {
    #   ...tradeFragment
    # }
    shipInfo {
      ...shipInfoFragment
    }
    tag
    type
    status
    createdAt
    updatedAt
  }
`;
