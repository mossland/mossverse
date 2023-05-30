import * as cnst from "../cnst";
import * as doc from "../doc";
import * as emp from "../emp";
import { Id, Utils } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const raffleInput = (wallet: Id, token: Id, currency: Id): cnst.RaffleInput => ({
  wallet,
  token,
  type: "token",
  winners: [],
  priceTags: [
    {
      type: "thing",
      thing: currency,
      price: Math.ceil(Math.random() * 10),
    },
  ],
  totalRaffleNum: 100,
  tags: [],
  announceAt: Utils.getLastMonths(-3),
  entryLimit: 100,
  closeAt: Utils.getLastMonths(-3),
});

export const createRaffle = async (app: TestingModule, wallet: doc.shared.Wallet.Doc, product: Id, currency: Id) => {
  const raffleEmployee = app.get<emp.RaffleEmployee>(emp.RaffleEmployee);
  const raffle = await raffleEmployee.create(raffleInput(wallet._id, product, currency));
  return raffle;
};
