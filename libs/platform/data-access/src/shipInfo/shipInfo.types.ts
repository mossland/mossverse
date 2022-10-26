import * as types from "../types";
import gql from "graphql-tag";
import { Nullable } from "@shared/util-client";

export type ShipInfoInput = {
  siteName: string;
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  message?: string;
};

export type ShipInfo = {
  siteName: string;
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  message?: string;
};

export const defaultShipInfo: Nullable<ShipInfo> = {
  siteName: null,
  name: null,
  phone: null,
  zipcode: null,
  address: null,
  message: null,
};

export const purifyShipInfo = (shipInfo: ShipInfo): ShipInfoInput => ({
  address: shipInfo.address,
  name: shipInfo.name,
  phone: shipInfo.phone,
  siteName: shipInfo.siteName ?? "default",
  zipcode: shipInfo.zipcode ?? "default",
  message: shipInfo.message ?? "default",
});

export const shipInfoFragment = gql`
  fragment shipInfoFragment on ShipInfo {
    siteName
    name
    phone
    zipcode
    address
    message
  }
`;
