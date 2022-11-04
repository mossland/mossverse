// import "@nomiclabs/hardhat-ethers";
// import "@nomicfoundation/hardhat-toolbox";
// // import { HardhatUserConfig, task } from "hardhat/config";
// import { ethers } from "hardhat";

// import chai from "chai";
// const etherToWei = (number: number) => {
//   return (number * Math.pow(10, 18)).toString();
// };
// describe("Akamir Collection test", function () {
//   before(async function () {
//     const [owner, collectionOwner, signer] = await ethers.getSigners();
//     this.owner = owner;
//     this.signer = signer;
//     this.collectionOwner = collectionOwner;

//     this.collectionId = 0;

//     this.AkamirCollection = await ethers.getContractFactory("Collection");
//     this.ERC721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");

//     this.akamirCollection = await this.AkamirCollection.connect(this.collectionOwner).deploy();

//     expect(await this.akamirCollection.deployed()).not.to.be.undefined;
//   });

//   context("add collection", async function () {
//     before(async function () {
//       const [owner, collectionOwner, signer] = await ethers.getSigners();
//       this.owner = owner;
//       this.collectionOwner = collectionOwner;
//       this.signer = signer;
//       this.uri = "test uri";
//     });

//     it("cannot add collection non-owner", async function () {
//       const saleStartTime = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 10);
//       await expect(
//         this.akamirCollection
//           .connect(this.signer)
//           .addCollection(ethers.utils.parseEther("0.1"), 10, saleStartTime, this.uri)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });
//     it("can add collection", async function () {
//       const saleStartTime = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 10);
//       await expect(
//         this.akamirCollection
//           .connect(this.collectionOwner)
//           .addCollection(ethers.utils.parseEther("0.1"), 10, saleStartTime, this.uri)
//       ).not.to.be.reverted;
//     });
//   });

//   context("start mint", async function () {
//     before(async function () {
//       const [owner, collectionOwner, signer] = await ethers.getSigners();
//       this.owner = owner;
//       this.collectionOwner = collectionOwner;
//       this.signer = signer;
//     });
//     it("cannot mint not added token", async function () {
//       await expect(
//         this.akamirCollection.connect(this.signer).mint(1, 1, { value: ethers.utils.parseEther("0.1") })
//       ).to.be.revertedWith("mint not ready.");
//     });

//     it("cannot mint before sale start time", async function () {
//       await expect(
//         this.akamirCollection.connect(this.signer).mint(0, 1, { value: ethers.utils.parseEther("0.1") })
//       ).to.be.revertedWith("sale has not begun yet.");

//       const saleStartTime = Math.floor(new Date().getTime() / 1000 - 60 * 60 * 24);
//       await expect(
//         this.akamirCollection.connect(this.collectionOwner).setSaleStartTime(0, saleStartTime)
//       ).not.to.be.reverted;
//     });
//     it("cannot mint over config amount", async function () {
//       await expect(
//         this.akamirCollection.connect(this.signer).mint(0, 20, { value: ethers.utils.parseEther("2.0") })
//       ).to.be.revertedWith("cannot mint over than config amount.");
//     });
//     it("cannot mint lower than config price ", async function () {
//       await expect(
//         this.akamirCollection.connect(this.signer).mint(0, 5, { value: ethers.utils.parseEther("0.1") })
//       ).to.be.revertedWith("Need to send more ETH.");
//     });
//     it("can mint", async function () {
//       await expect(
//         this.akamirCollection.connect(this.signer).mint(0, 5, { value: ethers.utils.parseEther("0.5") })
//       ).not.to.be.reverted;
//     });
//   });
// });
