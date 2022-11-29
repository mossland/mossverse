import { SurveyService } from "./survey.service";
import { TestSystem } from "@shared/test-server";
import { SurveyModule } from "./survey.module";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
import { Utils } from "@shared/util";
describe("Survey Service", () => {
  const system = new TestSystem();
  let surveyService: SurveyService;
  let contractService: srv.shared.ContractService;
  let networkService: srv.shared.NetworkService;
  let walletService: srv.shared.WalletService;
  let tokenService: srv.shared.TokenService;
  let network: db.shared.Network.Doc;
  let wallet: db.shared.Wallet.Doc;
  let token: db.shared.Token.Doc;
  let hasTokenWallet: db.shared.Wallet.Doc;
  let erc20contract: db.shared.Contract.Doc;
  let erc721contract: db.shared.Contract.Doc;
  let erc1155contract: db.shared.Contract.Doc;
  let testWallets: db.shared.Wallet.Doc[];

  beforeAll(async () => {
    const app = await system.init(registerModules);
    surveyService = app.get<SurveyService>(SurveyService);
    contractService = app.get<srv.shared.ContractService>(srv.shared.ContractService);
    networkService = app.get<srv.shared.NetworkService>(srv.shared.NetworkService);
    walletService = app.get<srv.shared.WalletService>(srv.shared.WalletService);
    tokenService = app.get<srv.shared.TokenService>(srv.shared.TokenService);
    network = await networkService.create(sample.shared.networkInput("klaytn"));
    wallet = await walletService.myWallet(network._id, system.env.network.klaytn.root.address);
    erc20contract = await contractService.create(
      sample.shared.contractInput(network._id, system.env.network.klaytn.erc20)
    );
    token = await tokenService.create({ contract: erc20contract.id });
    hasTokenWallet = await sample.shared.getHasTokenWallet(app, network._id, token._id);
    testWallets = await Promise.all(
      system.env.network.klaytn.testWallets.map(async (w) => await walletService.myWallet(network._id, w.address))
    );
  });
  afterAll(async () => await system.terminate());
  let survey: db.Survey.Doc;
  let input: gql.SurveyInput;

  it("Cannot Generate Survey at not contract owner", async () => {
    input = sample.surveyInput(erc20contract._id, wallet._id);
    await expect(surveyService.generateSurvey(input, wallet.address)).rejects.toThrow();
  });

  it("Generate Survey", async () => {
    input = sample.surveyInput(erc20contract._id, hasTokenWallet._id);
    survey = await surveyService.generateSurvey(input, hasTokenWallet.address);
    expect(survey.creator).toEqual(hasTokenWallet._id);
  });

  it("Create Survey", async () => {
    input = sample.surveyInput(erc20contract._id, wallet._id);
    survey = await surveyService.create(input);
    expect(survey.status).toEqual("active");
    expect(survey).toEqual(expect.objectContaining(input));
  });
  it("Update Survey", async () => {
    input = sample.surveyInput(erc20contract._id, wallet._id);
    survey = await surveyService.update(survey._id, input);
    expect(survey.status).toEqual("active");
    expect(survey).toEqual(expect.objectContaining(input));
  });
  it("Cannot Respond Before Open", async () => {
    await expect(
      surveyService.respondSurvey(survey._id, sample.surveyResponseInput(wallet._id), wallet.address)
    ).rejects.toThrow();
  });
  it("Cannot Open Survey With other Wallet", async () => {
    await expect(surveyService.openSurvey(survey._id, testWallets[0].address)).rejects.toThrow();
  });

  it("Open Survey", async () => {
    survey = await surveyService.openSurvey(survey._id, wallet.address);
    expect(survey.status).toEqual("opened");
  });
  it("Unable to Update After Open", async () => {
    await expect(surveyService.update(survey._id, sample.surveyInput(erc20contract._id, wallet._id))).rejects.toThrow();
  });
  it("Response Survey", async () => {
    await survey.merge({ openAt: new Date() }).save();
    survey = await surveyService.respondSurvey(survey._id, sample.surveyResponseInput(wallet._id), wallet.address);
    expect(survey.responses.length).toEqual(1);
  });
  it("No Duplicated Response Survey", async () => {
    survey = await surveyService.respondSurvey(survey._id, sample.surveyResponseInput(wallet._id), wallet.address);
    expect(survey.responses.length).toEqual(1);
  });
  it("Cannot Respond After Closed", async () => {
    await survey.merge({ closeAt: new Date() }).save();
    await expect(
      surveyService.respondSurvey(survey._id, sample.surveyResponseInput(wallet._id), wallet.address)
    ).rejects.toThrow();
  });
  it("Cannot Close Before Close Time", async () => {
    await survey.merge({ closeAt: Utils.getLastHour(-1) }).save();
    await expect(surveyService.closeSurvey(survey._id)).rejects.toThrow();
  });
  it("Take Snapshot and Make result", async () => {
    await survey.merge({ closeAt: new Date() }).save();
    survey = await surveyService.closeSurvey(survey._id);
    expect(survey.snapshot.length).toBeGreaterThan(0);
  });
});
