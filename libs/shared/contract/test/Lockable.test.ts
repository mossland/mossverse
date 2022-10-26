// /* eslint-disable no-undef */
// import * as chai from "chai";
// import { constants } from "@openzeppelin/test-helpers";
// import { current } from "@openzeppelin/test-helpers/src/balance";

// const etherToWei = (number) => {
//   return (number * Math.pow(10, 18)).toString();
// };
// const should = chai.should();
// const expect = chai.expect;

// describe("Lockable", function () {
//   const currentTokenIdx = 0;
//   const maxBatchSize = 5;
//   const collectionSize = 26;
//   const amountForAuctionAndDev = 14;
//   const amountForDev = 5;
//   before(async function () {
//     this.Akamir = await ethers.getContractFactory("Akamir");
//     this.ERC721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
//     this.akamir = await this.Akamir.deploy(maxBatchSize, collectionSize, amountForAuctionAndDev, amountForDev);
//     await this.akamir.deployed();
//   });

//   context("unlock", async function () {
//     const publicSalekey = "1";

//     before(async function () {
//       const [owner, , , , , , , addr7, addr8, addr9, addr10] = await ethers.getSigners();
//       this.owner = owner;
//       this.addr7 = addr7;
//       this.addr8 = addr8;
//       this.addr9 = addr9;
//       this.addr10 = addr10;
//       // this.akamir.setPublicSaleKey(publicSalekey);
//     });
//     it("can unlock by owner", async function () {
//       const tokenId = 0;
//       const lockUntil = Math.floor(new Date().getTime() / 1000) + 1000;
//       await expect(this.akamir.devMint(5, 0)).not.to.be.reverted;
//       await expect(this.akamir.lock(tokenId, lockUntil)).not.to.be.reverted;
//       const boforeLockedData = await this.akamir.getOwnershipData(tokenId);
//       expect(BigInt(boforeLockedData[2]).toString()).to.equal(lockUntil.toString());
//       await expect(this.akamir.unlockToken(tokenId)).not.to.be.reverted;

//       const unlocktokenData = await this.akamir.getOwnershipData(tokenId);
//       expect(BigInt(unlocktokenData[2]).toString()).to.equal("0");
//     });
//     it("cannot unlock by user", async function () {
//       const tokenId = 0;
//       const lockUntil = Math.floor(new Date().getTime() / 1000) + 1000;
//       await expect(this.akamir.lock(tokenId, lockUntil)).not.to.be.reverted;
//       await expect(this.akamir.connect(this.addr7).unlockToken(tokenId)).to.be.revertedWith(
//         "Ownable: caller is not the owner"
//       );
//     });
//   });
// });
