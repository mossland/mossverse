import * as cnst from "../cnst";
import * as doc from "../doc";
import * as emp from "../emp";
import { Id, Utils } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const tokenListingInput = (user: Id, wallet: Id, token: Id, currency: Id): cnst.ListingInput => ({
  user,
  wallet,
  token,
  type: "token",
  sellingType: "limited",
  priceTags: [
    {
      type: "thing",
      thing: currency,
      price: Math.ceil(Math.random() * 10),
    },
  ],
  tags: [],
  value: 1,
  closeAt: Utils.getLastMonths(-3),
});
export const thingListingInput = (user: Id, wallet: Id, thing: Id, currency: Id): cnst.ListingInput => ({
  user,
  wallet,
  thing,
  type: "thing",
  sellingType: "limited",
  priceTags: [
    {
      type: "thing",
      thing: currency,
      price: Math.ceil(Math.random() * 10),
    },
  ],
  tags: [],
  value: 1,
  closeAt: Utils.getLastMonths(-3),
});
export const productListingInput = (user: Id, wallet: Id, product: Id, currency: Id): cnst.ListingInput => ({
  user,
  wallet,
  product,
  type: "product",
  sellingType: "limited",
  priceTags: [
    {
      type: "thing",
      thing: currency,
      price: Math.ceil(Math.random() * 10),
    },
  ],
  tags: [],
  value: 1,

  closeAt: Utils.getLastMonths(-3),
});
export const createTokenListing = async (
  app: TestingModule,
  user: Id,
  wallet: doc.shared.Wallet.Doc,
  token: Id,
  currency: Id
) => {
  const listingEmployee = app.get<emp.ListingEmployee>(emp.ListingEmployee);
  const listing = await listingEmployee.create(tokenListingInput(user, wallet._id, token, currency));
  return listing;
};
export const createThingListing = async (
  app: TestingModule,
  user: Id,
  wallet: doc.shared.Wallet.Doc,
  thing: Id,
  currency: Id
) => {
  const listingEmployee = app.get<emp.ListingEmployee>(emp.ListingEmployee);
  const listing = await listingEmployee.create(thingListingInput(user, wallet._id, thing, currency));
  return listing;
};
export const createProductListing = async (
  app: TestingModule,
  user: Id,
  wallet: doc.shared.Wallet.Doc,
  product: Id,
  currency: Id
) => {
  const listingEmployee = app.get<emp.ListingEmployee>(emp.ListingEmployee);
  const listing = await listingEmployee.create(productListingInput(user, wallet._id, product, currency));
  return listing;
};
