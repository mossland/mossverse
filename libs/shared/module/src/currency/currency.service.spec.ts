import { environment } from "../_environments/environment";
import { CurrencyService } from "./currency.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Currency Service", () => {
  const system = new TestSystem();
  let currencyService: CurrencyService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    currencyService = app.get<CurrencyService>(CurrencyService);
  });
  afterAll(async () => await system.terminate());
  let currency: db.Currency.Doc;

  let input: gql.CurrencyInput;
  it("Create Currency", async () => {
    input = sample.currencyInput();
    currency = await currencyService.create(input);
    expect(currency.status).toEqual("active");
  });
  it("Update Currency", async () => {
    input = sample.currencyInput();
    currency = await currencyService.update(currency._id, input);
  });
  it("Remove Currency", async () => {
    currency = await currencyService.remove(currency._id);
    expect(currency.status).toEqual("inactive");
  });
});
