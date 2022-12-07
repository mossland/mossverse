import * as ethers from "ethers";
import { Erc20 } from "./erc20";
import { Multicall } from "./multicall";
import {
  erc20,
  ERC20,
  market as mk,
  multicall as mc,
  Multicall as MulticallContract,
  AkaMarket,
} from "@shared/contract";
import { Utils } from "@shared/util";
import { environment as env } from "../_environments/environment";
describe("ERC20 Instance", () => {
  const provider =
    env.ethereum.network === "ganache"
      ? new ethers.providers.JsonRpcProvider(env.ethereum.endpoint)
      : new ethers.providers.InfuraProvider(env.ethereum.network, env.ethereum.infuraId);
  const ws = env.klaytn.websocket ? new ethers.providers.WebSocketProvider(env.klaytn.websocket) : null;

  const wallet = new ethers.Wallet(env.ethereum.root.privateKey, provider);
  const multicall = new Multicall(
    new ethers.Contract(env.ethereum.multicall, mc.abi, wallet) as unknown as MulticallContract
  );
  const market = new ethers.Contract(env.ethereum.market, mk.abi, wallet) as AkaMarket;
  const contract = new ethers.Contract(env.ethereum.erc20, erc20.abi, wallet) as unknown as ERC20;
  const instance = new Erc20(env.ethereum.erc20, contract, {
    abi: erc20.abi,
    multicall,
    market,
    intf: new ethers.utils.Interface(erc20.abi),
    scanNum: env.ethereum.scanNum,
  });
  const wallets = env.ethereum.testWallets.map((w) => new ethers.Wallet(w.privateKey, provider));

  afterAll(async () => {
    instance.destroy();
    await ws?.destroy();
  });
  it("Get Info", async () => {
    const { name, totalSupply, symbol } = await instance.info();
    expect(name).toBeDefined();
    expect(totalSupply).toBeDefined();
    expect(symbol).toBeDefined();
  });
  it("Transfer Token", async () => {
    const value = Math.floor(Math.random() * 10 + 1);
    const balance = (await instance.balances([wallets[0].address]))[0].num;
    let isTransferred = false;
    instance.listen({
      onTransfer: (from, to, val) => {
        isTransferred = to === wallets[0].address && parseInt(val.toString()) === value;
      },
    });
    await instance.contract.transfer(wallets[0].address, value);
    await Utils.sleep(8000);
    expect(isTransferred).toBeTruthy();
    const nextBalance = (await instance.balances([wallets[0].address]))[0].num;
    expect(nextBalance - balance).toEqual(value);
  }, 30000);
  it("Approve", async () => {
    const value = Math.floor(Math.random() * 10 + 1);
    let isApproved = false;
    instance.listen({
      onApproval: (owner, spender, val, e) => {
        isApproved = spender === wallets[0].address && parseInt(val.toString()) === value;
      },
    });
    await instance.contract.approve(wallets[0].address, value);
    await Utils.sleep(8000);
    expect(isApproved).toBeTruthy();
  }, 30000);
  it("Get Snapshot", async () => {
    const snapshot = await instance.snapshot([wallet.address, ...wallets.map((w) => w.address)]);
    snapshot.map((s) => {
      expect(s.address).toBeDefined();
      expect(s.num).toBeDefined();
    });
  });
});
