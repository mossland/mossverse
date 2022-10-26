import gql from "graphql-tag";
import * as types from "../types";
import { cnst } from "@shared/util";
import { fileFragment } from "../file/file.types";
import { Nullable } from "@shared/util-client";

export type ThingInput = {
  name: string;
  description: string;
  image: string;
};
export type Thing = {
  id: string;
  name: string;
  description: string;
  image: types.File;
  type: cnst.ThingType;
  status: cnst.ThingStatus;
  createdAt: Date;
  updatedAt: Date;
};
export const defaultThing: Nullable<Thing> = {
  id: null,
  name: null,
  description: null,
  image: null,
  type: null,
  status: null,
  createdAt: null,
  updatedAt: null,
};
export const purifyThing = (thing: Thing): ThingInput => ({
  name: thing.name,
  description: thing.description,
  image: thing.image.id,
});
export const thingFragment = gql`
  ${fileFragment}
  fragment thingFragment on Thing {
    id
    name
    description
    image {
      ...fileFragment
    }
    type
    status
    createdAt
    updatedAt
  }
`;

export type ThingItemInput = {
  thing: string;
  num: number;
};

export type ThingItem = {
  thing: types.Thing;
  num: number;
};
export const purifyThingItem = (thingItem: ThingItem): ThingItemInput => ({
  thing: thingItem.thing.id,
  num: thingItem.num,
});
export const thingItemFragment = gql`
  ${thingFragment}
  fragment thingItemFragment on ThingItem {
    thing {
      ...thingFragment
    }
    num
  }
`;
