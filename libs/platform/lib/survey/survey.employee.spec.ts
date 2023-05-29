import { SurveyEmployee } from "./survey.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";

import * as cnst from "../cnst";
import * as db from "../db";
import * as emp from "../emp";
import * as sample from "../sample";
import { Utils } from "@util/server";
import { registerModules } from "../server";
describe("Survey Service", () => {
  const system = new TestSystem();
  let surveyEmployee: SurveyEmployee;
  let contractEmployee: emp.shared.ContractEmployee;
  let networkEmployee: emp.shared.NetworkEmployee;
  let walletEmployee: emp.shared.WalletEmployee;
  let tokenEmployee: emp.shared.TokenEmployee;
  let network: db.shared.Network.Doc;
  let wallet: db.shared.Wallet.Doc;
  let token: db.shared.Token.Doc;
  let hasTokenWallet: db.shared.Wallet.Doc;
  let erc20contract: db.shared.Contract.Doc;
  let erc721contract: db.shared.Contract.Doc;
  let erc1155contract: db.shared.Contract.Doc;
  let testWallets: db.shared.Wallet.Doc[];

  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    surveyEmployee = app.get<SurveyEmployee>(SurveyEmployee);
    contractEmployee = app.get<emp.shared.ContractEmployee>(emp.shared.ContractEmployee);
    networkEmployee = app.get<emp.shared.NetworkEmployee>(emp.shared.NetworkEmployee);
    walletEmployee = app.get<emp.shared.WalletEmployee>(emp.shared.WalletEmployee);
    tokenEmployee = app.get<emp.shared.TokenEmployee>(emp.shared.TokenEmployee);
    network = await networkEmployee.create(sample.shared.networkInput("klaytn"));
    wallet = await walletEmployee.myWallet(network._id, environment.ethereum.root.address);
    erc20contract = await contractEmployee.create(sample.shared.contractInput(network._id, environment.ethereum.erc20));
    token = await tokenEmployee.create({ contract: erc20contract.id });
    hasTokenWallet = await sample.shared.getHasTokenWallet(app, network._id, token._id);
    testWallets = await Promise.all(
      environment.ethereum.testWallets.map(async (w) => await walletEmployee.myWallet(network._id, w.address))
    );
  }, 300000);
  afterAll(async () => await system.terminate());
  let survey: db.Survey.Doc;
  let input: cnst.SurveyInput;

  it("Cannot Generate Survey at not contract owner", async () => {
    input = sample.surveyInput(erc20contract._id, wallet._id);
    await expect(surveyEmployee.generateSurvey(input, wallet.address)).rejects.toThrow();
  });

  it("Generate Survey", async () => {
    input = sample.surveyInput(erc20contract._id, hasTokenWallet._id);
    survey = await surveyEmployee.generateSurvey(input, hasTokenWallet.address);
    expect(survey.creator).toEqual(hasTokenWallet._id);
  });

  it("Create Survey", async () => {
    input = sample.surveyInput(erc20contract._id, wallet._id);
    survey = await surveyEmployee.create(input);
    expect(survey.status).toEqual("active");
    expect(survey).toEqual(expect.objectContaining(input));
  });
  it("Update Survey", async () => {
    input = sample.surveyInput(erc20contract._id, wallet._id);
    survey = await surveyEmployee.update(survey._id, input);
    expect(survey.status).toEqual("active");
    expect(survey).toEqual(expect.objectContaining(input));
  });
  it("Cannot Respond Before Open", async () => {
    await expect(
      surveyEmployee.respondSurvey(survey._id, sample.surveyResponseInput(wallet._id), wallet.address)
    ).rejects.toThrow();
  });
  it("Cannot Open Survey With other Wallet", async () => {
    await expect(surveyEmployee.openSurvey(survey._id, testWallets[0].address)).rejects.toThrow();
  });

  it("Open Survey", async () => {
    survey = await surveyEmployee.openSurvey(survey._id, wallet.address);
    expect(survey.status).toEqual("surveying");
  });
  it("Unable to Update After Open", async () => {
    await expect(
      surveyEmployee.update(survey._id, sample.surveyInput(erc20contract._id, wallet._id))
    ).rejects.toThrow();
  });
  it("Response Survey", async () => {
    await survey.merge({ openAt: new Date() }).save();
    survey = await surveyEmployee.respondSurvey(survey._id, sample.surveyResponseInput(wallet._id), wallet.address);
    expect(survey.responses.length).toEqual(1);
  });
  it("No Duplicated Response Survey", async () => {
    survey = await surveyEmployee.respondSurvey(survey._id, sample.surveyResponseInput(wallet._id), wallet.address);
    expect(survey.responses.length).toEqual(1);
  });
  it("Cannot Respond After Closed", async () => {
    await survey.merge({ closeAt: new Date() }).save();
    await expect(
      surveyEmployee.respondSurvey(survey._id, sample.surveyResponseInput(wallet._id), wallet.address)
    ).rejects.toThrow();
  });
  it("Cannot Close Before Close Time", async () => {
    await survey.merge({ closeAt: Utils.getLastHour(-1) }).save();
    await expect(surveyEmployee.closeSurvey(survey._id)).rejects.toThrow();
  });
  it("Take Snapshot and Make result", async () => {
    await survey.merge({ closeAt: new Date() }).save();
    survey = await surveyEmployee.closeSurvey(survey._id);
    expect(survey.snapshot.length).toBeGreaterThan(0);
  });
});
