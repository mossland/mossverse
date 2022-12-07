import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
import { Id } from "@shared/util-server";
const c = new Chance();
export const tradeInput = (token: Id, thing: Id): gql.TradeInput => ({
  name: c.name(),
  inputs: [
    {
      type: "token",
      token,
      num: 1,
    },
  ],
  outputs: [
    {
      type: "thing",
      thing,
      num: 1,
    },
  ],
  policy: ["reversible"],
});
export const createtrade = async (app: TestingModule, token: Id, thing: Id) => {
  const tradeService = app.get<srv.TradeService>(srv.TradeService);
  const trade = await tradeService.create(tradeInput(token, thing));
  return trade;
};
