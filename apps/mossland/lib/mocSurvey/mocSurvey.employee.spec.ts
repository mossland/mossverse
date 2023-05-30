import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import * as emp from "../emp";
import { TestSystem } from "@shared/test-server";
import { Utils } from "@util/server";
import { environment } from "../../environments/environment";
import { registerModules } from "../server";
describe("MocSurvey Service", () => {
  const system = new TestSystem();
  let mocSurveyEmployee: emp.MocSurveyEmployee;
  let thingEmployee: emp.shared.ThingEmployee;
  let networkEmployee: emp.shared.NetworkEmployee;
  let walletEmployee: emp.shared.WalletEmployee;
  let user: db.User.Doc;
  let thing: db.shared.Thing.Doc;
  let wallet: db.shared.Wallet.Doc;
  let hasThingUser: db.User.Doc;
  let network: db.shared.Network.Doc;

  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    mocSurveyEmployee = app.get<emp.MocSurveyEmployee>(emp.MocSurveyEmployee);
    thingEmployee = app.get<emp.shared.ThingEmployee>(emp.shared.ThingEmployee);
    networkEmployee = app.get<emp.shared.NetworkEmployee>(emp.shared.NetworkEmployee);
    walletEmployee = app.get<emp.shared.WalletEmployee>(emp.shared.WalletEmployee);
    network = await networkEmployee.create(sample.shared.networkInput("klaytn"));
    wallet = await walletEmployee.myWallet(network._id, system.env.network.klaytn.root.address);
    thing = await thingEmployee.generate("MMOC");
    [user, ,] = (await sample.platform.createUser(app, network._id, wallet.address)) as any;
    hasThingUser = (await sample.platform.getHasThingUser(app, network._id, wallet.address, thing._id)) as any;
  });
  afterAll(async () => await system.terminate());
  let mocSurvey: db.MocSurvey.Doc;
  let input: cnst.MocSurveyInput;

  it("Create MocSurvey", async () => {
    input = sample.mocSurveyInput(thing._id, user._id);
    mocSurvey = await mocSurveyEmployee.create(input);
    expect(mocSurvey.status).toEqual("active");
    expect(mocSurvey).toEqual(expect.objectContaining(input));
  }, 30000);

  it("Update MocSurvey", async () => {
    input = sample.mocSurveyInput(thing._id, hasThingUser._id);
    mocSurvey = await mocSurveyEmployee.update(mocSurvey._id, input);
    expect(mocSurvey.status).toEqual("active");
    expect(mocSurvey).toEqual(expect.objectContaining(input));
  }, 30000);

  // it("Cannot Generate MocSurvey at not contract owner", async () => {
  //   input = sample.mocSurveyInput(thing._id, user._id);
  //   await expect(mocSurveyEmployee.generateMocSurvey(input)).rejects.toThrow();
  // }, 30000);

  it("Generate MocSurvey", async () => {
    input = sample.mocSurveyInput(thing._id, hasThingUser._id);
    mocSurvey = await mocSurveyEmployee.generateMocSurvey(input);
    expect(mocSurvey.creator).toEqual(hasThingUser._id);
    expect(mocSurvey.status).toEqual("active");
  }, 30000);

  it("Cannot Respond Before Open", async () => {
    await expect(
      mocSurveyEmployee.respondMocSurvey(mocSurvey._id, sample.UserSurveyResponseInput(user._id), user.keyring)
    ).rejects.toThrow();
  }, 30000);

  // it("Cannot Open MocSurvey With other Wallet", async () => {
  //   await expect(mocSurveyEmployee.openMocSurvey(mocSurvey._id, testWallets[0].address)).rejects.toThrow();
  //   },30000);

  it("Open MocSurvey", async () => {
    mocSurvey = await mocSurveyEmployee.openMocSurvey(mocSurvey._id, hasThingUser.keyring);
    expect(mocSurvey.status).toEqual("surveying");
  }, 30000);

  it("Unable to Update After Open", async () => {
    await expect(
      mocSurveyEmployee.update(mocSurvey._id, sample.mocSurveyInput(mocSurvey.thing, wallet._id))
    ).rejects.toThrow();
  }, 30000);

  it("Response MocSurvey", async () => {
    await mocSurvey.merge({ openAt: new Date() }).save();
    mocSurvey = await mocSurveyEmployee.respondMocSurvey(
      mocSurvey._id,
      sample.UserSurveyResponseInput(user._id),
      user.keyring
    );
    expect(mocSurvey.responses.length).toEqual(1);
  }, 30000);

  it("No Duplicated Response MocSurvey", async () => {
    mocSurvey = await mocSurveyEmployee.respondMocSurvey(
      mocSurvey._id,
      sample.UserSurveyResponseInput(user._id),
      user.keyring
    );
    expect(mocSurvey.responses.length).toEqual(1);
  }, 30000);

  it("Cannot Respond After Closed", async () => {
    await mocSurvey.merge({ closeAt: new Date() }).save();
    await expect(
      mocSurveyEmployee.respondMocSurvey(mocSurvey._id, sample.UserSurveyResponseInput(user._id), user.keyring)
    ).rejects.toThrow();
  }, 30000);

  it("Cannot Close Before Close Time", async () => {
    await mocSurvey.merge({ closeAt: Utils.getLastHour(-1) }).save();
    await expect(mocSurveyEmployee.closeMocSurvey(mocSurvey._id)).rejects.toThrow();
  }, 30000);

  it("Take Snapshot and Make result", async () => {
    await mocSurvey.merge({ closeAt: new Date() }).save();
    mocSurvey = await mocSurveyEmployee.closeMocSurvey(mocSurvey._id);
    expect(mocSurvey.snapshot.length).toBeGreaterThan(0);
  }, 30000);
});
