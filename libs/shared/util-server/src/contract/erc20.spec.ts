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
import { env } from "@shared/test-server";
describe("ERC20 Instance", () => {
  const provider =
    env.network.ethereum.network === "ganache"
      ? new ethers.providers.JsonRpcProvider(env.network.ethereum.endpoint)
      : new ethers.providers.InfuraProvider(env.network.ethereum.network, env.network.ethereum.infuraId);
  const ws = new ethers.providers.WebSocketProvider(env.network.klaytn.websocket);

  const wallet = new ethers.Wallet(env.network.ethereum.root.privateKey, provider);
  const multicall = new Multicall(
    new ethers.Contract(env.network.ethereum.multicall, mc.abi, wallet) as unknown as MulticallContract
  );
  const market = new ethers.Contract(env.network.ethereum.market, mk.abi, wallet) as AkaMarket;
  const contract = new ethers.Contract(env.network.ethereum.erc20, erc20.abi, wallet) as unknown as ERC20;
  const instance = new Erc20(env.network.ethereum.erc20, contract, {
    abi: erc20.abi,
    multicall,
    market,
    intf: new ethers.utils.Interface(erc20.abi),
  });
  const wallets = env.network.ethereum.testWallets.map((w) => new ethers.Wallet(w.privateKey, provider));

  afterAll(async () => {
    instance.destroy();
    await ws.destroy();
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
  }, 15000);
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
  }, 15000);
  it("Get Snapshot", async () => {
    const snapshot = await instance.snapshot([wallet.address, ...wallets.map((w) => w.address)]);
    snapshot.map((s) => {
      expect(s.address).toBeDefined();
      expect(s.num).toBeDefined();
    });
  });
});
