import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const stakePoolInput = (thing: Id, webview?: Id): gql.StakePoolInput => ({
  // stakings: [],
  thing,
  type: "staking",
  // webview,
});

export const createStakePool = async (app: TestingModule, thing: Id, webview?: Id) => {
  const stakePoolService = app.get<srv.StakePoolService>(srv.StakePoolService);
  const stakePool = await stakePoolService.create(stakePoolInput(thing, webview));
  return stakePool;
};
