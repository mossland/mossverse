import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import { TokenService } from "./token.service";
import * as Chance from "chance";
import * as gql from "../gql";
const c = new Chance();
export const tokenInput = (contract: Id): gql.TokenInput => ({
  contract,
  tokenId: 0,
});
export const createToken = async (app: TestingModule, contractId: Id) => {
  const tokenService = app.get<TokenService>(TokenService);
  const token = await tokenService.create(tokenInput(contractId));
  return token;
};
