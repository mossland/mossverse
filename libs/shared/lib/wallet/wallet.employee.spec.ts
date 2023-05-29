import { TestSystem } from "@shared/test-server";
import { WalletEmployee } from "./wallet.employee";
import { environment } from "../env/environment";

import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Wallet Service", () => {
  const system = new TestSystem();
  let walletEmployee: WalletEmployee;
  let networkEmployee: emp.NetworkEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    walletEmployee = app.get<WalletEmployee>(WalletEmployee);
    networkEmployee = app.get<emp.NetworkEmployee>(emp.NetworkEmployee);
  });
  afterAll(async () => await system.terminate());
  let wallet: db.Wallet.Doc;
  let network: db.Network.Doc;
  let address: string;
  it("Generate My Wallet", async () => {
    network = await networkEmployee.create(sample.networkInput("ethereum"));
    address = sample.walletAddress();
    wallet = await walletEmployee.myWallet(network._id, address);
    expect(wallet).toEqual(expect.objectContaining({ address }));
  });
  it("Not Duplicate Wallet", async () => {
    const wallet2 = await walletEmployee.myWallet(network._id, address);
    expect(wallet._id.equals(wallet2._id)).toBeTruthy();
  });
});
