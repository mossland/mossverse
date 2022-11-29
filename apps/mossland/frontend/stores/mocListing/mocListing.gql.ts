import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  Float,
  Int,
  InputOf,
  PickType,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { gql as platform } from "@platform/data-access";
import { MocOwnership } from "../_scalar/scalar.gql";

@InputType("MocListingInput")
export class MocListingInput extends platform.ListingInput {}

@ObjectType("MocListing", { _id: "id" })
export class MocListing extends BaseGql(MocListingInput) {
  @Field(() => String)
  status: cnst.ListingStatus;
}

@ObjectType("LightMocListing", { _id: "id", gqlRef: "MocListing" })
export class LightMocListing extends PickType(MocListing, ["status"] as const) {}

export const mocListingGraphQL = createGraphQL("mocListing" as const, MocListing, MocListingInput, LightMocListing);
export const {
  getMocListing,
  listMocListing,
  mocListingCount,
  mocListingExists,
  createMocListing,
  updateMocListing,
  removeMocListing,
  mocListingFragment,
  purifyMocListing,
  defaultMocListing,
} = mocListingGraphQL;
