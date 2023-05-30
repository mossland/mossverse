import { CurrencyEmployee } from "./currency.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Currency Service", () => {
  const system = new TestSystem();
  let currencyEmployee: CurrencyEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    currencyEmployee = app.get<CurrencyEmployee>(CurrencyEmployee);
  });
  afterAll(async () => await system.terminate());
  let currency: db.Currency.Doc;

  let input: cnst.CurrencyInput;
  it("Create Currency", async () => {
    input = sample.currencyInput();
    currency = await currencyEmployee.create(input);
    expect(currency.status).toEqual("active");
  });
  it("Update Currency", async () => {
    input = sample.currencyInput();
    currency = await currencyEmployee.update(currency._id, input);
  });
  it("Remove Currency", async () => {
    currency = await currencyEmployee.remove(currency._id);
    expect(currency.status).toEqual("inactive");
  });
});
