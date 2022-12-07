import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const currencyInput = (): gql.CurrencyInput => ({
  name: "ether",
  type: "crypto",
  symbol: "ETH",
  services: ["ethers"],
});

export const createCurrency = async (app: TestingModule) => {
  const currencyService = app.get<srv.CurrencyService>(srv.CurrencyService);
  const currency = await currencyService.create(currencyInput());
  return currency;
};
