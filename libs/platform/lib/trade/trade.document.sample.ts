import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const tradeInput = (token: Id, thing: Id): cnst.TradeInput => ({
  name: c.name(),
  inputs: [
    {
      type: "token",
      token,
      value: 1,
    },
  ],
  outputs: [
    {
      type: "thing",
      thing,
      value: 1,
    },
  ],
  policy: ["reversible"],
});
export const createtrade = async (app: TestingModule, token: Id, thing: Id) => {
  const tradeEmployee = app.get<emp.TradeEmployee>(emp.TradeEmployee);
  const trade = await tradeEmployee.create(tradeInput(token, thing));
  return trade;
};
