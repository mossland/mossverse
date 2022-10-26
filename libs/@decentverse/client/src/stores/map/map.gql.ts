import { query, mutate } from "../gql";
import gql from "graphql-tag";
import * as types from "../types";

// * Map Query
export type MapQuery = { map: types.Map };
export const mapQuery = gql`
  ${types.mapFragment}
  query map($mapId: ID!) {
    map(mapId: $mapId) {
      ...mapFragment
    }
  }
`;
export const map = async (mapId: string) => (await query<MapQuery>(mapQuery, { mapId })).map;

// * Maps Query
export type MapsQuery = { maps: types.Map[] };
export const mapsQuery = gql`
  ${types.mapFragment}
  query maps($query: JSON!, $skip: Int, $limit: Int) {
    maps(query: $query, skip: $skip, limit: $limit) {
      ...mapFragment
    }
  }
`;
export const maps = async (qry: any, skip = 0, limit = 0) =>
  (await query<MapsQuery>(mapsQuery, { query: qry, skip, limit })).maps;

// * Create Map Mutation
export type CreateMapMutation = { createMap: types.Map };
export const createMapMutation = gql`
  ${types.mapFragment}
  mutation createMap($data: MapInput!) {
    createMap(data: $data) {
      ...mapFragment
    }
  }
`;
export const createMap = async (data: types.MapInput) =>
  (await mutate<CreateMapMutation>(createMapMutation, { data })).createMap;

// * Update Map Mutation
export type UpdateMapMutation = { updateMap: types.Map };
export const updateMapMutation = gql`
  ${types.mapFragment}
  mutation updateMap($mapId: ID!, $data: MapInput!) {
    updateMap(mapId: $mapId, data: $data) {
      ...mapFragment
    }
  }
`;
export const updateMap = async (mapId: string, data: types.MapInput) =>
  (await mutate<UpdateMapMutation>(updateMapMutation, { mapId, data })).updateMap;

// * Remove Admin Mutation
export type RemoveMapMutation = { removeMap: types.Map };
export const removeMapMutation = gql`
  ${types.mapFragment}
  mutation removeMap($mapId: ID!) {
    removeMap(mapId: $mapId) {
      ...mapFragment
    }
  }
`;
export const removeMap = async (mapId: string) =>
  (await mutate<RemoveMapMutation>(removeMapMutation, { mapId })).removeMap;

// * Add MapFiles Mutation
export type AddMapFilesMutation = { addMapFiles: types.shared.File[] };
export const addMapFilesMutation = gql`
  ${types.shared.fileFragment}
  mutation addMapFiles($files: [Upload!]!, $mapId: String) {
    addMapFiles(files: $files, mapId: $mapId) {
      ...fileFragment
    }
  }
`;
export const addMapFiles = async (files: FileList, mapId?: string) =>
  (await mutate<AddMapFilesMutation>(addMapFilesMutation, { files, mapId })).addMapFiles;
