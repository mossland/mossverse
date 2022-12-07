import { environment } from "../_environments/environment";
import { WalletService } from "./wallet.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Wallet Service", () => {
  const system = new TestSystem();
  let walletService: WalletService;
  let networkService: srv.NetworkService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    walletService = app.get<WalletService>(WalletService);
    networkService = app.get<srv.NetworkService>(srv.NetworkService);
  });
  afterAll(async () => await system.terminate());
  let wallet: db.Wallet.Doc;
  let network: db.Network.Doc;
  let address: string;
  it("Generate My Wallet", async () => {
    network = await networkService.create(sample.networkInput("ethereum"));
    address = sample.walletAddress();
    wallet = await walletService.myWallet(network._id, address);
    expect(wallet).toEqual(expect.objectContaining({ address }));
  });
  it("Not Duplicate Wallet", async () => {
    const wallet2 = await walletService.myWallet(network._id, address);
    expect(wallet._id.equals(wallet2._id)).toBeTruthy();
  });
});
