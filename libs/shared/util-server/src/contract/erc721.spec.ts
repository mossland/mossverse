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
} from "@shared/contract";
import { Utils } from "@shared/util";
import { env } from "@shared/test-server";
describe("ERC721 Instance", () => {
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
  const contract = new ethers.Contract(env.network.ethereum.erc721, erc721.abi, wallet) as unknown as ERC721A;
  const instance = new Erc721(env.network.ethereum.erc721, contract, {
    abi: erc721.abi,
    multicall,
    market,
    intf: new ethers.utils.Interface(erc721.abi),
  });
  const wallets = env.network.ethereum.testWallets.map((w) => new ethers.Wallet(w.privateKey, provider));

  // beforeAll(async () => {});
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
  }, 20000);
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
  }, 15000);
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
      expect(s.num).toEqual(1);
      expect(s.tokenId).toBeDefined();
    });
  });
});
