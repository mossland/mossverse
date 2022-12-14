import * as ethers from "ethers";
import { Erc1155 } from "./erc1155";
import { Multicall } from "./multicall";
import {
  AkaMarket,
  erc1155,
  ERC1155,
  market as mk,
  multicall as mc,
  Multicall as MulticallContract,
} from "@shared/contract";
import { Utils } from "@shared/util";
import { env } from "@shared/test-server";

describe("ERC1155 Instance", () => {
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
  const contract = new ethers.Contract(env.network.ethereum.erc1155, erc1155.abi, wallet) as unknown as ERC1155;
  const instance = new Erc1155(env.network.ethereum.erc1155, contract, {
    abi: erc1155.abi,
    multicall,
    market,
    intf: new ethers.utils.Interface(erc1155.abi),
  });
  const wallets = env.network.ethereum.testWallets.map((w) => new ethers.Wallet(w.privateKey, provider));

  afterAll(async () => {
    instance.destroy();
    await ws.destroy();
  });
  const tokenId = 0;
  it("Transfer Token", async () => {
    let isTransferred = false;
    const value = 10;
    const balance = (await instance.balances([wallets[0].address], [0]))[0].num;
    instance.listen({
      onTransferSingle: (operator, from, to, id, val) => {
        isTransferred = parseInt(val.toString()) === value && from === wallet.address;
      },
    });
    await instance.contract.safeTransferFrom(wallet.address, wallets[0].address, tokenId, value, "0x00");
    await Utils.sleep(8000);
    const postBalance = (await instance.balances([wallets[0].address], [0]))[0].num;
    expect(isTransferred).toBeTruthy();
    expect(postBalance - balance).toEqual(value);
    await instance.contract
      .connect(wallets[0])
      .safeTransferFrom(wallets[0].address, wallet.address, tokenId, value, "0x00");
  }, 15000);
  it("Approve", async () => {
    let isApproved = false;
    instance.listen({
      onApprovalForAll: (account, operator, approved, e) => {
        isApproved = approved && operator === wallets[0].address;
      },
    });
    await instance.contract.setApprovalForAll(wallets[0].address, true);
    await Utils.sleep(8000);
    expect(isApproved).toBeTruthy();
  }, 15000);
  it("Get Snapshot", async () => {
    const balances = await instance.snapshot([wallet.address, ...wallets.map((w) => w.address)], [0]);
    balances.map((arr) => expect(arr).toHaveProperty("num"));
  });
});
