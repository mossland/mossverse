import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { Utils } from "@shared/util";
const c = new Chance();
export const raffleInput = (wallet: Id, token: Id, currency: Id): gql.RaffleInput => ({
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

export const createRaffle = async (app: TestingModule, wallet: db.shared.Wallet.Doc, product: Id, currency: Id) => {
  const raffleService = app.get<srv.RaffleService>(srv.RaffleService);
  const raffle = await raffleService.create(raffleInput(wallet._id, product, currency));
  return raffle;
};
