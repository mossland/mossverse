import { TestingModule } from "@nestjs/testing";
import { Id } from "@shared/util-server";
import * as Chance from "chance";
import * as gql from "../gql";
import * as srv from "../srv";
const c = new Chance();
export const walletAddress = () => c.hash();
export const createWallet = async (app: TestingModule, networkId: Id) => {
  const walletService = app.get<srv.WalletService>(srv.WalletService);
  const wallet = await walletService.myWallet(networkId, walletAddress());
  return wallet;
};

export const getHasTokenWallet = async (app: TestingModule, networkId: Id, tokenId: Id) => {
  const walletService = app.get<srv.WalletService>(srv.WalletService);
  const tokenService = app.get<srv.TokenService>(srv.TokenService);
  const wallet = await walletService.myWallet(networkId, walletAddress());
  const token = await tokenService.get(tokenId);
  const num = c.integer({ min: 0, max: 100 });
  return await walletService.update(wallet._id, {
    items: [{ contract: token.contract._id._id, num, bn: num * (10 ^ 18), token: token._id }],
  });
};
