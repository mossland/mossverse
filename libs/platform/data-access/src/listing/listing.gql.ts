import { query, mutate } from "../index";
import * as types from "../types";
import gql from "graphql-tag";

// * Listing Query
export type ListingQuery = { listing: types.Listing };
export const listingQuery = gql`
  ${types.listingFragment}
  query listing($listingId: ID!) {
    listings(listingId: $listingId) {
      ...listingFragment
    }
  }
`;

export const listing = async (listingId: string) => (await query<ListingQuery>(listingsQuery, { listingId })).listing;

// * Listings Query
export type ListingsQuery = { listings: types.Listing[] };
export const listingsQuery = gql`
  ${types.listingFragment}
  query listings($query: JSON!, $skip: Int, $limit: Int) {
    listings(query: $query, skip: $skip, limit: $limit) {
      ...listingFragment
    }
  }
`;
export const listings = async (qry: any, skip = 0, limit = 0) =>
  (await query<ListingsQuery>(listingsQuery, { query: qry, skip, limit })).listings;

// * Create Listing Mutation
export type CreateListingMutation = { createListing: types.Listing };
export const createListingMutation = gql`
  ${types.listingFragment}
  mutation createListing($data: ListingInput!) {
    createListing(data: $data) {
      ...listingFragment
    }
  }
`;
export const createListing = async (data: types.ListingInput) =>
  (await mutate<CreateListingMutation>(createListingMutation, { data })).createListing;

// * Update Listing Mutation
export type UpdateListingMutation = { updateListing: types.Listing };
export const updateListingMutation = gql`
  ${types.listingFragment}
  mutation updateListing($listingId: ID!, $data: ListingInput!) {
    updateListing(listingId: $listingId, data: $data) {
      ...listingFragment
    }
  }
`;
export const updateListing = async (listingId: string, data: types.ListingInput) =>
  (await mutate<UpdateListingMutation>(updateListingMutation, { listingId, data })).updateListing;

// * Close Listing Mutation
export type CloseListingMutation = { closeListing: types.Listing };
export const closeListingMutation = gql`
  ${types.listingFragment}
  mutation closeListing($listingId: ID!) {
    closeListing(listingId: $listingId) {
      ...listingFragment
    }
  }
`;
export const closeListing = async (listingId: string) =>
  (await mutate<CloseListingMutation>(closeListingMutation, { listingId })).closeListing;

// * Remove Listing Mutation
export type RemoveListingMutation = { removeListing: types.Listing };
export const removeListingMutation = gql`
  ${types.listingFragment}
  mutation removeListing($listingId: ID!) {
    removeListing(listingId: $listingId) {
      ...listingFragment
    }
  }
`;
export const removeListing = async (listingId: string) =>
  (await mutate<RemoveListingMutation>(removeListingMutation, { listingId })).removeListing;

// * Open Listing Mutation
export type OpenListingMutation = { openListing: types.Listing };
export const openListingMutation = gql`
  ${types.listingFragment}
  mutation openListing($listingId: ID!, $data: ListingInput!) {
    openListing(listingId: $listingId, data: $data) {
      ...listingFragment
    }
  }
`;

export type PurchaseListingMutation = { purchaseListing: types.Receipt };
export const purchaseListingMutation = gql`
  ${types.receiptFragment}
  mutation purchaseListing($listingId: ID!, $priceTag: PriceTagInput!, $num: Float!, $shipInfo: ShipInfoInput) {
    purchaseListing(listingId: $listingId, priceTag: $priceTag, num: $num, shipInfo: $shipInfo) {
      ...receiptFragment
    }
  }
`;
export const purchaseListing = async (
  listingId: string,
  priceTag: types.PriceTagInput,
  num: number,
  shipInfo?: types.ShipInfoInput
) =>
  (await mutate<PurchaseListingMutation>(purchaseListingMutation, { listingId, priceTag, num, shipInfo }))
    .purchaseListing;

export type GenerateListingMutation = { generateListing: types.Listing };
export const generateListingMutation = gql`
  ${types.listingFragment}
  mutation generateListing($data: ListingInput!) {
    generateListing(data: $data) {
      ...listingFragment
    }
  }
`;
export const generateListing = async (data: types.ListingInput) =>
  (await mutate<GenerateListingMutation>(generateListingMutation, { data })).generateListing;
