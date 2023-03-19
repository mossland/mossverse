import * as ethers from "ethers";
import { Erc721 } from "./erc721";
import { Multicall } from "./multicall";
import {
  erc721,
  ERC721A,
  market as mk,
  multicall as mc,
  Multicall as MulticallContract,
  AkaMarket,
  ERC721AToken,
} from "@shared/contract";
import { Utils } from "@shared/util";
import { environment as env } from "../_environments/environment";
describe("ERC721 Instance", () => {
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
  const contract = new ethers.Contract(env.ethereum.erc721, erc721.abi, wallet) as unknown as ERC721AToken;
  const instance = new Erc721(env.ethereum.erc721, contract, {
    abi: erc721.abi,
    multicall,
    market,
    intf: new ethers.utils.Interface(erc721.abi),
    scanNum: env.ethereum.scanNum,
  });
  const wallets = env.ethereum.testWallets.map((w) => new ethers.Wallet(w.privateKey, provider));

  // beforeAll(async () => {});
  afterAll(async () => {
    instance.destroy();
    await ws?.destroy();
  });
  it("Get Info", async () => {
    const { name, totalSupply, symbol } = await instance.info();
    expect(name).toBeDefined();
    expect(totalSupply).toBeDefined();
    expect(symbol).toBeDefined();
  }, 30000);
  let tokenIds: number[];
  it("Transfer Token", async () => {
    tokenIds = await instance.tokenIds(wallet.address);
    const tokenId = Utils.randomPick(tokenIds);
    let isTransferred = false;
    instance.listen({
      onTransfer: (from, to, id) => {
        isTransferred = parseInt(id.toString()) === tokenId;
      },
    });
    await instance.contract.transferFrom(wallet.address, wallets[0].address, tokenId);
    await Utils.sleep(8000);
    expect(isTransferred).toBeTruthy();
    expect(await instance.contract.ownerOf(tokenId)).toEqual(wallets[0].address);
    await instance.contract.connect(wallets[0]).transferFrom(wallets[0].address, wallet.address, tokenId);
    expect(await instance.contract.ownerOf(tokenId)).toEqual(wallet.address);
  }, 1200000);
  it("Approve", async () => {
    let isApproved = false;
    instance.listen({
      onApproval: (owner, spender, value, e) => {
        isApproved = spender === wallets[0].address;
      },
    });
    await instance.contract.approve(wallets[0].address, tokenIds[0]);
    await Utils.sleep(8000);
    expect(isApproved).toBeTruthy();
  }, 60000);
  // it("Transfer with Market Contract", async () => {
  //   await instance.contract.setApprovalForAll(instance.settings.market.address, true);
  //   await Utils.sleep(4000);
  //   await instance.settings.market.addOperators([wallet.address, ...wallets.map((w) => w.address)]);
  //   await instance.transfer(wallet.address, wallets[0].address, tokenIds[0]);
  // }, 20000);
  it("Get Snapshot", async () => {
    const snapshot = await instance.snapshot();
    snapshot.map((s) => {
      expect(s.address).toBeDefined();
      expect(s.uri).toBeDefined();
      expect(s.value).toEqual(1);
      expect(s.tokenId).toBeDefined();
    });
  }, 1200000);
});
