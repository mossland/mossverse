import { query, mutate } from "../gql";
import gql from "graphql-tag";
import * as types from "../types";

// * Asset Query
export type AssetQuery = { asset: types.Asset };
export const assetQuery = gql`
  ${types.assetFragment}
  query asset($assetId: ID!) {
    asset(assetId: $assetId) {
      ...assetFragment
    }
  }
`;
export const asset = async (assetId: string) => (await query<AssetQuery>(assetQuery, { assetId })).asset;

// * Assets Query
export type AssetsQuery = { assets: types.Asset[] };
export const assetsQuery = gql`
  ${types.assetFragment}
  query assets($query: JSON!, $skip: Int, $limit: Int) {
    assets(query: $query, skip: $skip, limit: $limit) {
      ...assetFragment
    }
  }
`;
export const assets = async (qry: any, skip = 0, limit = 0) =>
  (await query<AssetsQuery>(assetsQuery, { query: qry, skip, limit })).assets;

// * Create Asset Mutation
export type CreateAssetMutation = { createAsset: types.Asset };
export const createAssetMutation = gql`
  ${types.assetFragment}
  mutation createAsset($data: AssetInput!) {
    createAsset(data: $data) {
      ...assetFragment
    }
  }
`;
export const createAsset = async (data: types.AssetInput) =>
  (await mutate<CreateAssetMutation>(createAssetMutation, { data })).createAsset;

// * Update Asset Mutation
export type UpdateAssetMutation = { updateAsset: types.Asset };
export const updateAssetMutation = gql`
  ${types.assetFragment}
  mutation updateAsset($assetId: ID!, $data: AssetInput!) {
    updateAsset(assetId: $assetId, data: $data) {
      ...assetFragment
    }
  }
`;
export const updateAsset = async (assetId: string, data: types.AssetInput) =>
  (await mutate<UpdateAssetMutation>(updateAssetMutation, { assetId, data })).updateAsset;

// * Remove Admin Mutation
export type RemoveAssetMutation = { removeAsset: types.Asset };
export const removeAssetMutation = gql`
  ${types.assetFragment}
  mutation removeAsset($assetId: AssetInput!) {
    removeAsset(assetId: $assetId) {
      ...assetFragment
    }
  }
`;
export const removeAsset = async (assetId: string) =>
  (await mutate<RemoveAssetMutation>(removeAssetMutation, { assetId })).removeAsset;

// * Add AssetFiles Mutation
export type AddAssetFilesMutation = { addAssetFiles: types.shared.File[] };
export const addAssetFilesMutation = gql`
  ${types.shared.fileFragment}
  mutation addAssetFiles($files: [Upload!]!, $assetId: String) {
    addAssetFiles(files: $files, assetId: $assetId) {
      ...fileFragment
    }
  }
`;
export const addAssetFiles = async (files: FileList, assetId?: string) =>
  (await mutate<AddAssetFilesMutation>(addAssetFilesMutation, { files, assetId })).addAssetFiles;
