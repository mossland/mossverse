import * as cnst from "../cnst";
import { CurrencyEmployee } from "./currency.employee";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const currencyInput = (): cnst.CurrencyInput => ({
  name: "ether",
  type: "crypto",
  symbol: "ETH",
  services: ["ethers"],
});

export const createCurrency = async (app: TestingModule) => {
  const currencyEmployee = app.get<CurrencyEmployee>(CurrencyEmployee);
  const currency = await currencyEmployee.create(currencyInput());
  return currency;
};
