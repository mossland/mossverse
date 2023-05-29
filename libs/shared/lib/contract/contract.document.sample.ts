import * as cnst from "../cnst";
import { ContractEmployee } from "./contract.employee";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const contractInput = (network: Id, address: string): cnst.ContractInput => ({
  network,
  address,
});
export const createContract = async (app: TestingModule, network: Id, address: string) => {
  const contractEmployee = app.get<ContractEmployee>(ContractEmployee);
  const contract = await contractEmployee.create(contractInput(network, address));
  return contract;
};
