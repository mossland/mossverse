import * as cnst from "../cnst";
import { NetworkEmployee } from "./network.employee";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const networkInput = (provider: "ethereum" | "klaytn"): cnst.NetworkInput => ({
  name: "bassman",
  endPoint: "http://bassman.ddns.net",
  type: "ganache",
  provider,
  networkId: 5777,
});
export const createNetwork = async (app: TestingModule, provider: "ethereum" | "klaytn" = "klaytn") => {
  const networkEmployee = app.get<NetworkEmployee>(NetworkEmployee);
  const network = await networkEmployee.create(networkInput(provider));
  return network;
};
