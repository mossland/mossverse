import * as cnst from "../cnst";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import { TokenEmployee } from "./token.employee";
import Chance from "chance";
const c = new Chance();
export const tokenInput = (contract: Id): cnst.TokenInput => ({
  contract,
  tokenId: 0,
});
export const createToken = async (app: TestingModule, contractId: Id) => {
  const tokenEmployee = app.get<TokenEmployee>(TokenEmployee);
  const token = await tokenEmployee.create(tokenInput(contractId));
  return token;
};
