import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
// import { HardhatUserConfig, task } from "hardhat/config";
import { ethers } from "hardhat";
import { expect } from "chai";
import { ERC721AToken } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, utils } from "ethers";
import { Utils } from "@shared/util";
import { SaleInfo, saleInfosToArrays } from "../utils";
const etherToWei = (number: number) => {
  return (number * Math.pow(10, 18)).toString();
};
describe("Akamir Collection test", function () {
  let contract: ERC721AToken;
  let root: SignerWithAddress;
  let operator: SignerWithAddress;
  let wlUser: SignerWithAddress;
  let nonwlUser: SignerWithAddress;
  let generalUser: SignerWithAddress;
  let saleInfos: SaleInfo[];

  before(async function () {
    [root, operator, wlUser, nonwlUser, generalUser] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("ERC721AToken");
    contract = (await factory
      .connect(root)
      .deploy("Akamir", "AKA", 1000, "https://asset.akamir.com/tokenuri/akamir/", false)) as ERC721AToken;
    expect(await contract.deployed()).not.be.undefined;
    saleInfos = [
      {
        // admin Mint
        amount: 300,
        price: 0,
        startTime: new Date(),
        endTime: Utils.getNextYears(),
        merkleRoot: Utils.getMerkleTree([root.address]).root,
        perTx: 0,
        perWallet: 0,
        maxLimit: 0,
        minted: 0,
      },
      {
        // wl mint
        amount: 500,
        price: 1,
        startTime: new Date(),
        endTime: Utils.getNextYears(),
        merkleRoot: Utils.getMerkleTree([operator.address, wlUser.address]).root,
        perTx: 10,
        perWallet: 10,
        maxLimit: 0,
        minted: 0,
      },
      {
        // public mint
        amount: 300,
        price: 1,
        startTime: new Date(),
        endTime: Utils.getNextYears(),
        merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        perTx: 10,
        perWallet: 10,
        maxLimit: 0,
        minted: 0,
      },
    ];
  });

  context("Mint Event", async function () {
    it("Cannot Mint without mint registration", async function () {
      await expect(contract.connect(generalUser).mint(0, 1, [])).to.be.reverted;
    });
    it("can add collection", async function () {
      await contract.connect(root).setSaleInfoList(...saleInfosToArrays(saleInfos), 0);
      const saleInfo = await contract.saleInfos(0);
      expect(saleInfo.amount).to.be.equal(saleInfos[0].amount);
    });
    it("Admin Mint", async function () {
      const amount = saleInfos[0].amount; // 300
      const proof = Utils.getMerkleProof([root.address], root.address);
      const badProof = Utils.getMerkleProof([root.address], generalUser.address);
      await expect(contract.connect(generalUser).mint(0, amount, badProof)).to.be.reverted;
      await expect(contract.connect(root).mint(0, amount, proof)).not.to.be.reverted;
      await expect(contract.connect(root).mint(0, 1, proof)).to.be.reverted;
      expect(await contract.totalSupply()).to.be.equal(amount);
      expect(await contract.balanceOf(root.address)).to.be.equal(amount);
      const saleInfo = await contract.saleInfos(0);
      expect(saleInfo.minted).to.be.equal(amount);
    });
    it("WL Mint", async function () {
      const amount = saleInfos[1].amount; // 500
      const proof = Utils.getMerkleProof([operator.address, wlUser.address], wlUser.address);
      const badProof = Utils.getMerkleProof([operator.address, wlUser.address], nonwlUser.address);
      await expect(contract.connect(nonwlUser).mint(1, 1, badProof, { value: etherToWei(1) })).to.be.reverted;
      await expect(
        contract.connect(wlUser).mint(1, saleInfos[1].perTx + 1, proof, { value: etherToWei(saleInfos[1].perTx + 1) })
      ).to.be.reverted;
      await expect(contract.connect(wlUser).mint(1, 1, proof, { value: etherToWei(1) })).not.to.be.reverted;
      await expect(
        contract.connect(wlUser).mint(1, saleInfos[1].perWallet, proof, { value: etherToWei(saleInfos[1].perWallet) })
      ).to.be.reverted;
      expect(await contract.balanceOf(wlUser.address)).to.be.equal(1);
      const saleInfo = await contract.saleInfos(1);
      expect(saleInfo.minted).to.be.equal(1);
    });
    it("Cannot Mint Before startTime", async function () {
      saleInfos[2].startTime = Utils.getNextYears();
      await contract.connect(root).setSaleInfoList(...saleInfosToArrays([saleInfos[2]]), 2);
      await expect(contract.connect(nonwlUser).mint(2, 1, [], { value: etherToWei(1) })).to.be.reverted;
    });
    it("Cannot Mint After endTime", async function () {
      saleInfos[2].startTime = Utils.getLastMonths();
      saleInfos[2].endTime = Utils.getLastMinutes();
      await contract.connect(root).setSaleInfoList(...saleInfosToArrays([saleInfos[2]]), 2);
      await expect(contract.connect(nonwlUser).mint(2, 1, [], { value: etherToWei(1) })).to.be.reverted;
    });
    it("Public Mint", async function () {
      saleInfos[2].startTime = Utils.getLastMonths();
      saleInfos[2].endTime = Utils.getNextYears();
      await contract.connect(root).setSaleInfoList(...saleInfosToArrays([saleInfos[2]]), 2);
      await expect(
        contract.connect(nonwlUser).mint(2, saleInfos[2].perTx + 1, [], { value: etherToWei(saleInfos[2].perTx + 1) })
      ).to.be.reverted;
      await expect(contract.connect(nonwlUser).mint(2, 1, [], { value: etherToWei(1) })).not.to.be.reverted;
      await expect(
        contract.connect(nonwlUser).mint(2, saleInfos[2].perWallet, [], { value: etherToWei(saleInfos[2].perWallet) })
      ).to.be.reverted;
      expect(await contract.balanceOf(nonwlUser.address)).to.be.equal(1);
      const saleInfo = await contract.saleInfos(1);
      expect(saleInfo.minted).to.be.equal(1);
    });
    it("Cannot Exceed Sale Supply", async function () {
      saleInfos[2].perTx = 1000;
      saleInfos[2].perWallet = 1000;
      await contract.connect(root).setSaleInfoList(...saleInfosToArrays([saleInfos[2]]), 2);
      const saleInfo = await contract.saleInfos(2);
      const mintNum = saleInfo.amount.sub(saleInfo.minted).toNumber();
      await expect(contract.connect(nonwlUser).mint(2, mintNum, [], { value: etherToWei(mintNum) })).not.to.be.reverted;
      await expect(contract.connect(nonwlUser).mint(2, 1, [], { value: etherToWei(1) })).to.be.reverted;
    });
    it("Cannot Exceed Max Supply", async function () {
      saleInfos[2].amount = 1000;
      await contract.connect(root).setSaleInfoList(...saleInfosToArrays([saleInfos[2]]), 2);
      const totalSupply = await contract.totalSupply();
      const mintNum = 1000 - totalSupply.toNumber();
      await expect(contract.connect(nonwlUser).mint(2, mintNum, [], { value: etherToWei(mintNum) })).not.to.be.reverted;
      await expect(contract.connect(nonwlUser).mint(2, 1, [], { value: etherToWei(1) })).to.be.reverted;
    });
    it("Metadata", async function () {
      await contract.setMetadata("https://dummy.com/", ".json", false);
      let [contractUri, tokenUri] = [await contract.contractURI(), await contract.tokenURI(1)];
      expect(contractUri).to.be.equal("https://dummy.com/contract.json");
      expect(tokenUri).to.be.equal("https://dummy.com/prereveal.json");
      await contract.setMetadata("https://shit.com/", ".json", true);
      [contractUri, tokenUri] = [await contract.contractURI(), await contract.tokenURI(1)];
      expect(contractUri).to.be.equal("https://shit.com/contract.json");
      expect(tokenUri).to.be.equal("https://shit.com/1.json");
    });
    it("Lock", async function () {
      const lockUntil = Math.floor(Date.now()) + 1000;
      expect(await contract.lockUntil(0)).to.be.equal(0);
      await contract.lock(0, lockUntil);
      expect(await contract.lockUntil(0)).to.be.equal(lockUntil);
    });
    it("Cannot transfer when locked", async function () {
      await expect(
        contract.connect(root)["safeTransferFrom(address,address,uint256)"](root.address, generalUser.address, 0)
      ).to.be.reverted;
      expect(await contract.ownerOf(0)).to.equal(root.address);
    });
    it("Unlock", async function () {
      await expect(contract.connect(generalUser).unlock(0)).to.be.reverted;
      await contract.connect(root).approve(operator.address, 0);
      await expect(contract.connect(operator).unlock(0)).to.be.reverted;
      await contract.connect(root).setApprovalForAll(operator.address, true);
      await expect(contract.connect(operator).unlock(0)).to.be.reverted;
      await expect(contract.connect(root).unlock(0)).not.to.be.reverted;
      await expect(
        contract.connect(root)["safeTransferFrom(address,address,uint256)"](root.address, generalUser.address, 0)
      ).not.to.be.reverted;
    });
    it("Cannot transfer when not locked", async function () {
      await contract.connect(generalUser).lock(0, Math.floor(Date.now()) + 1000);
      await expect(
        contract.connect(generalUser)["safeTransferFrom(address,address,uint256)"](generalUser.address, root.address, 0)
      ).to.be.reverted;
      await expect(contract.connect(generalUser).unlock(0)).to.be.reverted;
      await expect(contract.connect(root).unlock(0)).not.to.be.reverted;
    });
    it("Lock transfer", async function () {
      const lockUntil = Math.floor(Date.now()) + 1000;
      await contract.connect(root).lockTransferFrom(root.address, generalUser.address, 1, lockUntil, "0x00");
      expect(await contract.lockUntil(1)).to.be.equal(lockUntil);
      await expect(
        contract.connect(generalUser)["safeTransferFrom(address,address,uint256)"](generalUser.address, root.address, 1)
      ).to.be.reverted;
    });
    it("Withdraw ETH", async function () {
      const contractBalance = await contract.provider.getBalance(contract.address);
      const balance = await root.getBalance();
      await contract.connect(root).withdraw(etherToWei(1));
      expect(await root.getBalance()).gt(balance.add(etherToWei(0.9)));
      expect(await contract.provider.getBalance(contract.address)).to.be.equal(contractBalance.sub(etherToWei(1)));
    });
    it("ERC721A Enumerable support", async function () {
      const [totalSupply, tokenByIndex, tokenOfOwnerByIndex] = await Promise.all([
        contract.totalSupply(),
        contract.tokenByIndex(1),
        contract.tokenOfOwnerByIndex(root.address, 0),
      ]);
      expect(totalSupply).gt(0);
      expect(tokenByIndex).to.be.equal(1);
      expect(tokenOfOwnerByIndex).to.be.equal(2);
      await expect(contract.tokenByIndex(10000)).to.be.reverted;
      await expect(contract.tokenOfOwnerByIndex(root.address, 10000)).to.be.reverted;
    });
  });
});
