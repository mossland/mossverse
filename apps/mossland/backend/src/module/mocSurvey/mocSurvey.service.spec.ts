import { TestSystem } from "@shared/test-server";
import { Utils } from "@shared/util";
import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("MocSurvey Service", () => {
  const system = new TestSystem();
  let mocSurveyService: srv.MocSurveyService;
  let thingService: srv.shared.ThingService;
  let networkService: srv.shared.NetworkService;
  let walletService: srv.shared.WalletService;
  let user: db.User.Doc;
  let thing: db.shared.Thing.Doc;
  let wallet: db.shared.Wallet.Doc;
  let hasThingUser: db.User.Doc;
  let network: db.shared.Network.Doc;

  beforeAll(async () => {
    const app = await system.init(registerModules);
    mocSurveyService = app.get<srv.MocSurveyService>(srv.MocSurveyService);
    thingService = app.get<srv.shared.ThingService>(srv.shared.ThingService);
    networkService = app.get<srv.shared.NetworkService>(srv.shared.NetworkService);
    walletService = app.get<srv.shared.WalletService>(srv.shared.WalletService);
    network = await networkService.create(sample.shared.networkInput("klaytn"));
    wallet = await walletService.myWallet(network._id, system.env.network.klaytn.root.address);
    thing = await thingService.generate("MMOC");
    [user, ,] = (await sample.platform.createUser(app, network._id, wallet.address)) as any;
    hasThingUser = (await sample.platform.getHasThingUser(app, network._id, wallet.address, thing._id)) as any;
  });
  afterAll(async () => await system.terminate());
  let mocSurvey: db.MocSurvey.Doc;
  let input: gql.MocSurveyInput;

  it("Create MocSurvey", async () => {
    input = sample.mocSurveyInput(thing._id, user._id);
    mocSurvey = await mocSurveyService.create(input);
    expect(mocSurvey.status).toEqual("active");
    expect(mocSurvey).toEqual(expect.objectContaining(input));
  }, 30000);

  it("Update MocSurvey", async () => {
    input = sample.mocSurveyInput(thing._id, hasThingUser._id);
    mocSurvey = await mocSurveyService.update(mocSurvey._id, input);
    expect(mocSurvey.status).toEqual("active");
    expect(mocSurvey).toEqual(expect.objectContaining(input));
  }, 30000);

  // it("Cannot Generate MocSurvey at not contract owner", async () => {
  //   input = sample.mocSurveyInput(thing._id, user._id);
  //   await expect(mocSurveyService.generateMocSurvey(input)).rejects.toThrow();
  // }, 30000);

  it("Generate MocSurvey", async () => {
    input = sample.mocSurveyInput(thing._id, hasThingUser._id);
    mocSurvey = await mocSurveyService.generateMocSurvey(input);
    expect(mocSurvey.creator).toEqual(hasThingUser._id);
    expect(mocSurvey.status).toEqual("active");
  }, 30000);

  it("Cannot Respond Before Open", async () => {
    await expect(
      mocSurveyService.respondMocSurvey(mocSurvey._id, sample.UserSurveyResponseInput(user._id), user.keyring)
    ).rejects.toThrow();
  }, 30000);

  // it("Cannot Open MocSurvey With other Wallet", async () => {
  //   await expect(mocSurveyService.openMocSurvey(mocSurvey._id, testWallets[0].address)).rejects.toThrow();
  //   },30000);

  it("Open MocSurvey", async () => {
    mocSurvey = await mocSurveyService.openMocSurvey(mocSurvey._id, hasThingUser.keyring);
    expect(mocSurvey.status).toEqual("opened");
  }, 30000);

  it("Unable to Update After Open", async () => {
    await expect(
      mocSurveyService.update(mocSurvey._id, sample.mocSurveyInput(mocSurvey.thing, wallet._id))
    ).rejects.toThrow();
  }, 30000);

  it("Response MocSurvey", async () => {
    await mocSurvey.merge({ openAt: new Date() }).save();
    mocSurvey = await mocSurveyService.respondMocSurvey(
      mocSurvey._id,
      sample.UserSurveyResponseInput(user._id),
      user.keyring
    );
    expect(mocSurvey.responses.length).toEqual(1);
  }, 30000);

  it("No Duplicated Response MocSurvey", async () => {
    mocSurvey = await mocSurveyService.respondMocSurvey(
      mocSurvey._id,
      sample.UserSurveyResponseInput(user._id),
      user.keyring
    );
    expect(mocSurvey.responses.length).toEqual(1);
  }, 30000);

  it("Cannot Respond After Closed", async () => {
    await mocSurvey.merge({ closeAt: new Date() }).save();
    await expect(
      mocSurveyService.respondMocSurvey(mocSurvey._id, sample.UserSurveyResponseInput(user._id), user.keyring)
    ).rejects.toThrow();
  }, 30000);

  it("Cannot Close Before Close Time", async () => {
    await mocSurvey.merge({ closeAt: Utils.getLastHour(-1) }).save();
    await expect(mocSurveyService.closeMocSurvey(mocSurvey._id)).rejects.toThrow();
  }, 30000);

  it("Take Snapshot and Make result", async () => {
    await mocSurvey.merge({ closeAt: new Date() }).save();
    mocSurvey = await mocSurveyService.closeMocSurvey(mocSurvey._id);
    expect(mocSurvey.snapshot.length).toBeGreaterThan(0);
  }, 30000);
});
