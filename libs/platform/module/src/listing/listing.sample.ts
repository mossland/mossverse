import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { Id } from "@shared/util-server";
import { Utils } from "@shared/util";
const c = new Chance();
export const tokenListingInput = (user: Id, wallet: Id, token: Id, currency: Id): gql.ListingInput => ({
  user,
  wallet,
  token,
  priceTags: [
    {
      type: "thing",
      thing: currency,
      price: Math.ceil(Math.random() * 10),
    },
  ],
  closeAt: Utils.getLastMonths(-3),
});
export const thingListingInput = (user: Id, wallet: Id, thing: Id, currency: Id): gql.ListingInput => ({
  user,
  wallet,
  thing,
  priceTags: [
    {
      type: "thing",
      thing: currency,
      price: Math.ceil(Math.random() * 10),
    },
  ],
  closeAt: Utils.getLastMonths(-3),
});
export const productListingInput = (user: Id, wallet: Id, product: Id, currency: Id): gql.ListingInput => ({
  user,
  wallet,
  product,
  priceTags: [
    {
      type: "thing",
      thing: currency,
      price: Math.ceil(Math.random() * 10),
    },
  ],
  closeAt: Utils.getLastMonths(-3),
});
export const createTokenListing = async (
  app: TestingModule,
  user: Id,
  wallet: db.shared.Wallet.Doc,
  token: Id,
  currency: Id
) => {
  const listingService = app.get<srv.ListingService>(srv.ListingService);
  const listing = await listingService.create(tokenListingInput(user, wallet._id, token, currency));
  return listing;
};
export const createThingListing = async (
  app: TestingModule,
  user: Id,
  wallet: db.shared.Wallet.Doc,
  thing: Id,
  currency: Id
) => {
  const listingService = app.get<srv.ListingService>(srv.ListingService);
  const listing = await listingService.create(thingListingInput(user, wallet._id, thing, currency));
  return listing;
};
export const createProductListing = async (
  app: TestingModule,
  user: Id,
  wallet: db.shared.Wallet.Doc,
  product: Id,
  currency: Id
) => {
  const listingService = app.get<srv.ListingService>(srv.ListingService);
  const listing = await listingService.create(productListingInput(user, wallet._id, product, currency));
  return listing;
};
