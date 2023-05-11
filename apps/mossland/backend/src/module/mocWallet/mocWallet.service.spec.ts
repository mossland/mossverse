// import { db, srv, gql, modules } from "@platform/module";
import { TestSystem } from "@shared/test-server";
import { Utils } from "@shared/util";
import * as sample from "../sample";
import * as db from "./../db";
import * as srv from "./../srv";
import * as gql from "./../gql";
import * as ethers from "ethers";
import { TestingModule } from "@nestjs/testing";
import { registerModules } from "../module";

describe("MocWallet Service", () => {
  const system = new TestSystem();
  let app: TestingModule;

  let mocWalletService: srv.MocWalletService;
  let networkService: srv.shared.NetworkService;
  let thingService: srv.shared.ThingService;
  let userService: srv.UserService;
  let luniverseService: srv.LuniverseService;

  let network: db.shared.Network.Doc;
  let thing: db.shared.Thing.Doc;
  let depositor: db.User.Doc;
  let depositorKeyring: db.shared.Keyring.Doc;
  let depositorWallet: db.shared.Wallet.Doc;
  let nonHaveItemUser: db.User.Doc;
  beforeAll(async () => {
    // wip
    app = await system.init(registerModules);
    networkService = app.get<srv.shared.NetworkService>(srv.shared.NetworkService);
    luniverseService = app.get<srv.LuniverseService>(srv.LuniverseService);
    mocWalletService = app.get<srv.MocWalletService>(srv.MocWalletService);
    thingService = app.get<srv.shared.ThingService>(srv.shared.ThingService);
    userService = app.get<srv.UserService>(srv.UserService);

    network = await networkService.create(sample.shared.networkInput("klaytn"));
    thing = await thingService.generate("MMOC");
    const randomWallet = ethers.Wallet.createRandom();
    [nonHaveItemUser, ,] = (await sample.platform.createUser(app, network._id, randomWallet.address)) as any;
    [depositor, depositorKeyring, depositorWallet] = (await sample.platform.createUser(
      app,
      network._id,
      system.env.network.klaytn.root.address
    )) as any;
  }, 30000);
  afterAll(async () => await system.terminate());

  describe("MocWallet  CRUD Test", () => {
    let mocWallet: db.MocWallet.Doc;
    let input: gql.MocWalletInput;
    beforeAll(async () => {
      // wip
    });
    it("Create Moc Wallet", async () => {
      const randomWallet = ethers.Wallet.createRandom();
      input = sample.createMocWalletInput(randomWallet.address);
      mocWallet = await mocWalletService.create(input);
      expect(mocWallet.status).toEqual("active");
      expect(mocWallet.address).toEqual(randomWallet.address);
      // wip
    });
    it("Cannot Create Duplicated Moc Wallet", async () => {
      await expect(mocWalletService.create(input)).rejects.toThrow();
    });
    it("Update Moc Wallet", async () => {
      input = sample.createMocWalletInput(mocWallet.address, depositor._id);
      mocWallet = await mocWalletService.update(mocWallet._id, input);
      expect(mocWallet.user).toEqual(input.user);
      // wip
    });
    it("Remove Moc Wallet", async () => {
      mocWallet = await mocWalletService.remove(mocWallet.id);
      expect(mocWallet.status).toEqual("inactive");
      // wip
    });
  });
  describe("MocWallet  Exchange Test", () => {
    let activeMocWallet: db.MocWallet.Doc;
    let upbitWallet: db.MocWallet.Doc; // upbit address
    let depositWallet: db.MocWallet.Doc;
    let input: gql.MocWalletInput;
    const upbitAddress = "0x686b55be70fc489dc1a6dc8dafbcec4dab06a8df"; // upbit
    const depositAddress = "0xf45c2707f0c83eca9dc1f2271751cdbc03bef58a"; // whitelist address
    beforeAll(async () => {
      // wip
    });
    it("Create Test upbit address", async () => {
      input = sample.createMocWalletInput(upbitAddress);
      // wip
      upbitWallet = await mocWalletService.create(input);
      expect(upbitWallet.status).toEqual("active");
      expect(upbitWallet.address).toEqual(upbitAddress);
    });
    it("Create Test deposit address", async () => {
      input = sample.createMocWalletInput(depositAddress);
      // wip
      depositWallet = await mocWalletService.create(input);
      expect(depositWallet.status).toEqual("active");
      expect(depositWallet.address).toEqual(depositAddress);
    });

    it("Request Desposit", async () => {
      const num = 1;
      depositWallet = await mocWalletService.deposit(activeMocWallet._id, depositor._id);
      expect(depositWallet.status).toEqual("reserved");
      expect(depositWallet.user).toEqual(depositor._id);
      await luniverseService.transfer(upbitWallet.address, depositWallet.address, num);
      Utils.sleepSync(3000);
      const receipt = await mocWalletService.confirmDeposit(depositWallet);
      depositor = await userService.get(depositor._id);
      expect(receipt).toBeDefined();
      expect(receipt.type).toEqual("trade");
      expect(receipt.status).toEqual("success");
      expect(depositor.items.some((item) => item.thing.equals(thing._id) && item.num === num)).toBeTruthy();
    }, 10000);
    it("cannot withdraw to not enouth mmoc", async () => {
      const num = 1;
      await expect(mocWalletService.withdraw(nonHaveItemUser._id, upbitWallet.address, num)).rejects.toThrow();
    });
    it("withdraw", async () => {
      const num = 1;
      const rest = await mocWalletService.withdraw(depositor._id, upbitWallet.address, num);
      expect(rest.status).toEqual("success");
      expect(rest.inputs.some((input) => input.hash)).toBeTruthy();
      const user = await userService.get(depositor._id);
      expect(user.items.find((item) => item.thing.equals(thing._id))).toBeUndefined();
    });
  });
});
