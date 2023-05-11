import { environment } from "../_environments/environment";
import { KeyringService } from "./keyring.service";
import { TestSystem } from "@shared/test-server";
import { KeyringModule } from "./keyring.module";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Keyring Service", () => {
  const system = new TestSystem();
  let keyringService: KeyringService;
  let networkService: srv.NetworkService;
  let walletService: srv.WalletService;
  let network: db.Network.Doc;
  let testWallets: db.Wallet.Doc[];
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    keyringService = app.get<KeyringService>(KeyringService);
    networkService = app.get<srv.NetworkService>(srv.NetworkService);
    walletService = app.get<srv.WalletService>(srv.WalletService);
    network = await networkService.create(sample.networkInput("klaytn"));
    testWallets = await Promise.all(
      environment.klaytn.testWallets.map(async (w) => await walletService.myWallet(network._id, w.address))
    );
  });
  afterAll(async () => await system.terminate());
  let keyring: db.Keyring.Doc;
  let anotherKeyring: db.Keyring.Doc;
  it("Signin With Wallet", async () => {
    const { jwt } = await keyringService.signinWallet(network._id, testWallets[0].address);
    expect(jwt).toBeDefined();
  });
  it("Add Wallet", async () => {
    [keyring] = await keyringService.keyringsHasWallet(network._id, testWallets[0].address);
    expect(keyring).toBeDefined();
    expect(keyring.wallets.some((_id) => _id.equals(testWallets[0]._id))).toBeTruthy();
  });
  it("Add Wallet More", async () => {
    keyring = await keyringService.signaddWallet(keyring._id, network._id, testWallets[1].address);
    expect(keyring.wallets.some((_id) => _id.equals(testWallets[0]._id))).toBeTruthy();
    expect(keyring.wallets.some((_id) => _id.equals(testWallets[1]._id))).toBeTruthy();
  });
  it("Not Duplicate Wallets", async () => {
    keyring = await keyringService.signaddWallet(keyring._id, network._id, testWallets[1].address);
    expect(keyring.wallets.some((_id) => _id.equals(testWallets[0]._id))).toBeTruthy();
    expect(keyring.wallets.some((_id) => _id.equals(testWallets[1]._id))).toBeTruthy();
    expect(keyring.wallets.length).toEqual(2);
  });
  it("Migrate Wallet", async () => {
    const { jwt } = await keyringService.signinWallet(network._id, testWallets[2].address);
    expect(jwt).toBeDefined();
    [anotherKeyring] = await keyringService.keyringsHasWallet(network._id, testWallets[2].address);
    expect(anotherKeyring).toBeDefined();
    expect(anotherKeyring.wallets.some((_id) => _id.equals(testWallets[2]._id))).toBeTruthy();
    anotherKeyring = await keyringService.signaddWallet(anotherKeyring._id, network._id, testWallets[1].address);
    await keyring.refresh();
    expect(keyring.wallets.some((_id) => _id.equals(testWallets[1]._id))).toBeFalsy();
    expect(keyring.wallets.some((_id) => _id.equals(testWallets[1]._id))).toBeFalsy();
  });
  it("Prevent Empty Wallets When Remove Wallet", async () => {
    await expect(
      keyringService.signsubWallet(keyring._id, testWallets[0]._id, testWallets[0].address)
    ).rejects.toThrow();
  });
});
