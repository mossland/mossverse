import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import { WalletEmployee } from "./wallet.employee";
import Chance from "chance";
const c = new Chance();
export const walletAddress = () => c.hash();
export const createWallet = async (app: TestingModule, networkId: Id) => {
  const walletEmployee = app.get<WalletEmployee>(WalletEmployee);
  const wallet = await walletEmployee.myWallet(networkId, walletAddress());
  return wallet;
};
