import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const networkInput = (provider: "ethereum" | "klaytn"): gql.NetworkInput => ({
  name: "bassman",
  endPoint: "http://bassman.ddns.net",
  type: "ganache",
  provider,
  networkId: 5777,
});
export const createNetwork = async (app: TestingModule, provider: "ethereum" | "klaytn" = "klaytn") => {
  const networkService = app.get<srv.NetworkService>(srv.NetworkService);
  const network = await networkService.create(networkInput(provider));
  return network;
};
