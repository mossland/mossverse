import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const contractInput = (network: Id, address: string): gql.ContractInput => ({
  network,
  address,
});
export const createContract = async (app: TestingModule, network: Id, address: string) => {
  const contractService = app.get<srv.ContractService>(srv.ContractService);
  const contract = await contractService.create(contractInput(network, address));
  return contract;
};
