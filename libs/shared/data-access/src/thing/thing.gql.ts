import { query, mutate } from "../apollo";
import gql from "graphql-tag";
import * as types from "../types";

// * Thing Query
export type ThingQuery = { thing: types.Thing };
export const thingQuery = gql`
  ${types.thingFragment}
  query thing($thingId: ID!) {
    thing(thingId: $thingId) {
      ...thingFragment
    }
  }
`;
export const thing = async (thingId: string) => (await query<ThingQuery>(thingQuery, { thingId })).thing;

// * Things Query
export type ThingsQuery = { things: types.Thing[]; thingCount: number };
export const thingsQuery = gql`
  ${types.thingFragment}
  query things($query: JSON!, $skip: Int, $limit: Int) {
    things(query: $query, skip: $skip, limit: $limit) {
      ...thingFragment
    }
    thingCount(query: $query)
  }
`;
export const things = async (qry: any, skip = 0, limit = 0) =>
  (await query<ThingsQuery>(thingsQuery, { query: qry, skip, limit })).things;

// * Create Thing Mutation
export type CreateThingMutation = { createThing: types.Thing };
export const createThingMutation = gql`
  ${types.thingFragment}
  mutation createThing($data: ThingInput!) {
    createThing(data: $data) {
      ...thingFragment
    }
  }
`;
export const createThing = async (data: types.ThingInput) =>
  (await mutate<CreateThingMutation>(createThingMutation, { data })).createThing;

// * Update Thing Mutation

export type UpdateThingMutation = { updateThing: types.Thing };
export const updateThingMutation = gql`
  ${types.thingFragment}
  mutation updateThing($thingId: ID!, $data: ThingInput!) {
    updateThing(thingId: $thingId, data: $data) {
      ...thingFragment
    }
  }
`;
export const updateThing = async (thingId: string, data: types.ThingInput) =>
  (await mutate<UpdateThingMutation>(updateThingMutation, { thingId, data })).updateThing;

// * Remove Thing Mutation
export type RemoveThingMutation = { removeThing: types.Thing };
export const removeThingMutation = gql`
  ${types.thingFragment}
  mutation removeThing($thingId: ID!) {
    removeThing(thingId: $thingId) {
      ...thingFragment
    }
  }
`;
export const removeThing = async (thingId: string) =>
  (await mutate<RemoveThingMutation>(removeThingMutation, { thingId })).removeThing;

// * Add ThingFiles Mutation
export type AddThingFilesMutation = { addThingFiles: types.File[] };
export const addThingFilesMutation = gql`
  ${types.fileFragment}
  mutation addThingFiles($files: [Upload!]!, $thingId: String) {
    addThingFiles(files: $files, thingId: $thingId) {
      ...fileFragment
    }
  }
`;
export const addThingFiles = async (files: FileList, thingId?: string) =>
  (await mutate<AddThingFilesMutation>(addThingFilesMutation, { files, thingId })).addThingFiles;
