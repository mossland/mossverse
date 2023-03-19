import { TestingModule } from "@nestjs/testing";
import { Id } from "@shared/util-server";
import { WalletService } from "./wallet.service";
import * as Chance from "chance";
import * as gql from "../gql";
const c = new Chance();
export const walletAddress = () => c.hash();
export const createWallet = async (app: TestingModule, networkId: Id) => {
  const walletService = app.get<WalletService>(WalletService);
  const wallet = await walletService.myWallet(networkId, walletAddress());
  return wallet;
};
