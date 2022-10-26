import gql from "graphql-tag";
import * as types from "../types";
import { cnst } from "@shared/util";
export type AccessToken = {
  accessToken: string;
};
export const accessTokenFragment = gql`
  fragment accessTokenFragment on AccessToken {
    accessToken
  }
`;

export type OpenSeaAttribute = {
  display_type?: string;
  trait_type: string;
  value: string;
};
export const openSeaAttributeFragment = gql`
  fragment openSeaAttributeFragment on OpenSeaAttribute {
    display_type
    trait_type
    value
  }
`;

export type OpenSeaMeta = {
  name: string;
  external_url: string;
  image: string;
  description: string;
  attributes: OpenSeaAttribute[];
};
export const openSeaMetaFragment = gql`
  ${openSeaAttributeFragment}
  fragment openSeaMetaFragment on OpenSeaMeta {
    name
    external_url
    image
    description
    attributes {
      ...openSeaAttributeFragment
    }
  }
`;

export type TokenUrl = {
  url: string;
  imageUrl: string;
  meta: OpenSeaMeta;
};
export const tokenUrlFragment = gql`
  ${openSeaMetaFragment}
  fragment tokenUrlFragment on TokenUrl {
    url
    imageUrl
    meta {
      ...openSeaMetaFragment
    }
  }
`;
export type Reference = {
  type: string;
  ref: string;
};
export const referenceFragment = gql`
  fragment referenceFragment on Reference {
    type
    ref
  }
`;
