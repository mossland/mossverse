// import { db, srv, fetch, modules } from "@platform/server";
import * as db from "./../db";
import * as ethers from "ethers";
import * as cnst from "./../gql";
import * as sample from "../sample";
import * as srv from "./../srv";
import { TestSystem } from "@shared/test-server";
import { TestingModule } from "@nestjs/testing";
import { Utils } from "@util/server";
import { registerModules } from "../server";

describe("MocWallet Service", () => {
  const system = new TestSystem();
  let app: TestingModule;

  let mocWalletEmployee: emp.MocWalletEmployee;
  let networkEmployee: emp.shared.NetworkEmployee;
  let thingEmployee: emp.shared.ThingEmployee;
  let userEmployee: emp.UserEmployee;
  let luniverseEmployee: emp.LuniverseEmployee;

  let network: db.shared.Network.Doc;
  let thing: db.shared.Thing.Doc;
  let depositor: db.User.Doc;
  let depositorKeyring: db.shared.Keyring.Doc;
  let depositorWallet: db.shared.Wallet.Doc;
  let nonHaveItemUser: db.User.Doc;
  beforeAll(async () => {
    // wip
    app = await system.init(registerModules);
    networkEmployee = app.get<emp.shared.NetworkEmployee>(emp.shared.NetworkEmployee);
    luniverseEmployee = app.get<emp.LuniverseEmployee>(emp.LuniverseEmployee);
    mocWalletEmployee = app.get<emp.MocWalletEmployee>(emp.MocWalletEmployee);
    thingEmployee = app.get<emp.shared.ThingEmployee>(emp.shared.ThingEmployee);
    userEmployee = app.get<emp.UserEmployee>(emp.UserEmployee);

    network = await networkEmployee.create(sample.shared.networkInput("klaytn"));
    thing = await thingEmployee.generate("MMOC");
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
    let input: cnst.MocWalletInput;
    beforeAll(async () => {
      // wip
    });
    it("Create Moc Wallet", async () => {
      const randomWallet = ethers.Wallet.createRandom();
      input = sample.createMocWalletInput(randomWallet.address);
      mocWallet = await mocWalletEmployee.create(input);
      expect(mocWallet.status).toEqual("active");
      expect(mocWallet.address).toEqual(randomWallet.address);
      // wip
    });
    it("Cannot Create Duplicated Moc Wallet", async () => {
      await expect(mocWalletEmployee.create(input)).rejects.toThrow();
    });
    it("Update Moc Wallet", async () => {
      input = sample.createMocWalletInput(mocWallet.address, depositor._id);
      mocWallet = await mocWalletEmployee.update(mocWallet._id, input);
      expect(mocWallet.user).toEqual(input.user);
      // wip
    });
    it("Remove Moc Wallet", async () => {
      mocWallet = await mocWalletEmployee.remove(mocWallet.id);
      expect(mocWallet.status).toEqual("inactive");
      // wip
    });
  });
  describe("MocWallet  Exchange Test", () => {
    let activeMocWallet: db.MocWallet.Doc;
    let upbitWallet: db.MocWallet.Doc; // upbit address
    let depositWallet: db.MocWallet.Doc;
    let input: cnst.MocWalletInput;
    const upbitAddress = "0x686b55be70fc489dc1a6dc8dafbcec4dab06a8df"; // upbit
    const depositAddress = "0xf45c2707f0c83eca9dc1f2271751cdbc03bef58a"; // whitelist address
    beforeAll(async () => {
      // wip
    });
    it("Create Test upbit address", async () => {
      input = sample.createMocWalletInput(upbitAddress);
      // wip
      upbitWallet = await mocWalletEmployee.create(input);
      expect(upbitWallet.status).toEqual("active");
      expect(upbitWallet.address).toEqual(upbitAddress);
    });
    it("Create Test deposit address", async () => {
      input = sample.createMocWalletInput(depositAddress);
      // wip
      depositWallet = await mocWalletEmployee.create(input);
      expect(depositWallet.status).toEqual("active");
      expect(depositWallet.address).toEqual(depositAddress);
    });

    it("Request Desposit", async () => {
      const num = 1;
      depositWallet = await mocWalletEmployee.deposit(activeMocWallet._id, depositor._id);
      expect(depositWallet.status).toEqual("reserved");
      expect(depositWallet.user).toEqual(depositor._id);
      await luniverseEmployee.transfer(upbitWallet.address, depositWallet.address, num);
      Utils.sleepSync(3000);
      const receipt = await mocWalletEmployee.confirmDeposit(depositWallet);
      depositor = await userEmployee.get(depositor._id);
      expect(receipt).toBeDefined();
      expect(receipt.type).toEqual("trade");
      expect(receipt.status).toEqual("success");
      expect(depositor.items.some((item) => item.thing.equals(thing._id) && item.num === num)).toBeTruthy();
    }, 10000);
    it("cannot withdraw to not enouth mmoc", async () => {
      const num = 1;
      await expect(mocWalletEmployee.withdraw(nonHaveItemUser._id, upbitWallet.address, num)).rejects.toThrow();
    });
    it("withdraw", async () => {
      const num = 1;
      const rest = await mocWalletEmployee.withdraw(depositor._id, upbitWallet.address, num);
      expect(rest.status).toEqual("success");
      expect(rest.inputs.some((input) => input.hash)).toBeTruthy();
      const user = await userEmployee.get(depositor._id);
      expect(user.items.find((item) => item.thing.equals(thing._id))).toBeUndefined();
    });
  });
});
