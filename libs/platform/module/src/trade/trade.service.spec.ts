import { TestSystem } from "@shared/test-server";
import { TradeModule } from "./trade.module";
import { TradeService } from "./trade.service";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../modules";
import { TestingModule } from "@nestjs/testing";
import { ethers } from "ethers";
import { Erc1155, Erc20, Erc721 } from "@shared/util-server";
import { Utils } from "@shared/util";
describe("trade Service", () => {
  const system = new TestSystem();
  let tradeService: TradeService;
  let networkService: srv.shared.NetworkService;
  let contractService: srv.shared.ContractService;
  let tokenService: srv.shared.TokenService;
  let walletService: srv.shared.WalletService;
  let network: db.shared.Network.Doc;
  let contract: db.shared.Contract.Doc;
  let thing: db.shared.Thing.Doc;
  let token: db.shared.Token.Doc;
  let image: db.shared.File.Doc;
  let user: db.User.Doc;

  let wallet: db.shared.Wallet.Doc;
  let keyring: db.shared.Keyring.Doc;
  let otherWallet: db.shared.Wallet.Doc;
  let app: TestingModule;
  const provider = new ethers.providers.JsonRpcProvider(system.env.network.klaytn.endpoint);
  const signer = new ethers.Wallet(system.env.network.klaytn.testWallets[0].privateKey, provider);
  let erc20: Erc20;
  let hash: string;
  beforeAll(async () => {
    app = await system.init(registerModules);
    tradeService = app.get<TradeService>(TradeService);
    networkService = app.get<srv.shared.NetworkService>(srv.shared.NetworkService);
    contractService = app.get<srv.shared.ContractService>(srv.shared.ContractService);
    tokenService = app.get<srv.shared.TokenService>(srv.shared.TokenService);
    walletService = app.get<srv.shared.WalletService>(srv.shared.WalletService);
    image = await sample.shared.createFile(app);
    network = await sample.shared.createNetwork(app, "klaytn");
    [user, keyring, wallet] = await sample.createUser(
      app,
      network._id,
      system.env.network.klaytn.testWallets[0].address
    );
    const rootWallet = (await walletService.myWallet(network._id, system.env.network.klaytn.root.address))
      .merge({ type: "root" })
      .save();
    thing = await sample.shared.createThing(app, image._id);
    otherWallet = await walletService.myWallet(network._id, system.env.network.klaytn.testWallets[1].address);
    contract = await sample.shared.createContract(app, network._id, system.env.network?.klaytn.erc20);
    token = await tokenService.generate(contract);
    erc20 = (await networkService.loadContract(contract)) as Erc20;
    await erc20.contract.transfer(wallet.address, 10, { gasLimit: 100000 });
    await erc20.contract.approve(system.env.network.klaytn.market, 100, { gasLimit: 100000 });
    wallet = await contractService.inventory(wallet);
  }, 30000);
  afterAll(async () => await system.terminate());
  let trade: db.Trade.Doc;
  let input: gql.TradeInput;
  let inputs: gql.ExchangeInput[];
  let outputs: gql.ExchangeInput[];
  it("Create trade", async () => {
    input = sample.tradeInput(token._id, thing._id);
    trade = await tradeService.create(input);
    expect(trade.status).toEqual("active");
    expect(trade.inputs[0].token?.equals(input.inputs[0].token ?? "")).toBeTruthy();
    expect(trade.outputs[0].thing?.equals(input.outputs[0].thing ?? "")).toBeTruthy();
  });
  it("Update trade", async () => {
    input = sample.tradeInput(token._id, thing._id);
    trade = await tradeService.update(trade._id, input);
    expect(trade.inputs[0].token?.equals(input.inputs[0].token ?? "")).toBeTruthy();
    expect(trade.outputs[0].thing?.equals(input.outputs[0].thing ?? "")).toBeTruthy();
  });
  it("Deposit ERC20 to Thing", async () => {
    const [beforeTokenBalance] = await erc20.balances([wallet.address]);
    const beforeTokenNum = wallet.items.find((item) => item.contract.equals(contract._id) && item.num > 0)?.num ?? 0;
    const beforeThingNum = user.items.find((item) => item.thing.equals(thing._id) && item.num > 0)?.num ?? 0;
    hash = (
      await erc20.contract.connect(signer).transfer(system.env.network.klaytn.root.address, 10, { gasLimit: 100000 })
    ).hash;
    inputs = [
      {
        type: "token",
        token: token._id,
        num: 10,
        wallet: wallet._id,
        hash,
      },
    ];
    outputs = [
      {
        type: "thing",
        thing: thing._id,
        num: 10,
      },
    ];
    await Utils.sleep(8000);
    const receipt: db.Receipt.Doc = await tradeService.makeTrade(trade._id, inputs, outputs, false, keyring._id);
    await user.refresh();
    await wallet.refresh();
    const [afterTokenBalance] = await erc20.balances([wallet.address]);
    const afterTokenNum = wallet.items.find((item) => item.contract.equals(contract._id) && item.num > 0)?.num ?? 0;
    const afterThingNum = user.items.find((item) => item.thing.equals(thing._id) && item.num > 0)?.num ?? 0;
    expect(afterTokenBalance.num).toEqual(beforeTokenBalance.num - 10);
    expect(afterTokenNum).toEqual(beforeTokenNum - 10);
    expect(afterThingNum).toEqual(beforeThingNum + 10);
    expect(receipt.inputs.some((input) => input.hash === hash)).toBeTruthy();
    // ! check receipt
  }, 20000);
  it("Should not duplicate deposit", async () => {
    await expect(tradeService.makeTrade(token._id, inputs, outputs, false, keyring._id)).rejects.toThrow();
  });
  it("Withdraw Thing to ERC20", async () => {
    const [beforeTokenBalance] = await erc20.balances([wallet.address]);
    const beforeTokenNum = wallet.items.find((item) => item.contract.equals(contract._id) && item.num > 0)?.num ?? 0;
    const beforeThingNum = user.items.find((item) => item.thing.equals(thing._id) && item.num > 0)?.num ?? 0;
    const receipt: db.Receipt.Doc = await tradeService.makeTrade(trade._id, outputs, inputs, true, keyring._id);
    await Utils.sleep(8000);
    await user.refresh();
    await wallet.refresh();
    const [afterTokenBalance] = await erc20.balances([wallet.address]);
    const afterTokenNum = wallet.items.find((item) => item.contract.equals(contract._id) && item.num > 0)?.num ?? 0;
    const afterThingNum = user.items.find((item) => item.thing.equals(thing._id) && item.num > 0)?.num ?? 0;
    expect(afterTokenBalance.num).toEqual(beforeTokenBalance.num + 10);
    expect(afterTokenNum).toEqual(beforeTokenNum + 10);
    expect(afterThingNum).toEqual(beforeThingNum - 10);
  }, 20000);
  it("Cannot execute withdrawal when wallet not exists", async () => {
    const inputs: gql.ExchangeInput[] = [
      {
        type: "thing",
        thing: thing._id,
        num: 1,
      },
    ];
    const outputs: gql.ExchangeInput[] = [
      {
        type: "token",
        token: token._id,
        wallet: otherWallet._id,
        num: 1,
      },
    ];
    await expect(tradeService.makeTrade(token._id, inputs, outputs, true, keyring._id)).rejects.toThrow();
  });
  it("Cannot Withdraw Thing to ERC20 without balance", async () => {
    const inputs: gql.ExchangeInput[] = [
      {
        type: "thing",
        thing: thing._id,
        num: 100000,
      },
    ];
    const outputs: gql.ExchangeInput[] = [
      {
        type: "token",
        token: token._id,
        wallet: wallet._id,
        num: 100000,
      },
    ];
    await expect(tradeService.makeTrade(token._id, inputs, outputs, true, keyring._id)).rejects.toThrow();
  });
  it("Remove trade", async () => {
    trade = await tradeService.remove(trade._id);
    expect(trade.status).toEqual("inactive");
  });
});
