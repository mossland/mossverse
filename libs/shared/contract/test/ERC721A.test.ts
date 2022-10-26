// /* eslint-disable no-undef */

// import { expect } from "chai";
// import { constants } from "@openzeppelin/test-helpers";
// import { ethers } from "hardhat";
// const { ZERO_ADDRESS } = constants;

// const RECEIVER_MAGIC_VALUE = "0x150b7a02";
// const GAS_MAGIC_VALUE = 20000;

// describe("ERC721A", function () {
//   beforeEach(async function () {
//     this.ERC721A = await ethers.getContractFactory("ERC721AMock");
//     this.ERC721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
//     this.erc721a = await this.ERC721A.deploy("Akamir", "AM");
//     await this.erc721a.deployed();
//   });
//   context("with no minted tokens", async function () {
//     it("has 0 totalSupply", async function () {
//       const supply = await this.erc721a.totalSupply();
//       expect(supply).to.equal(0);
//     });
//   });
//   context("with minted tokens", async function () {
//     beforeEach(async function () {
//       const [owner, addr1, addr2, addr3] = await ethers.getSigners();
//       this.owner = owner;
//       this.addr1 = addr1;
//       this.addr2 = addr2;
//       this.addr3 = addr3;
//       await this.erc721a["safeMint(address,uint256,uint256)"](addr1.address, 1, 0);
//       await this.erc721a["safeMint(address,uint256,uint256)"](addr2.address, 2, 0);
//       await this.erc721a["safeMint(address,uint256,uint256)"](addr3.address, 3, 0);
//     });
//     describe("exists", async function () {
//       it("verifies valid tokens", async function () {
//         for (let tokenId = 0; tokenId < 6; tokenId++) {
//           const exists = await this.erc721a.exists(tokenId);
//           expect(exists).to.be.true;
//         }
//       });
//       it("verifies invalid tokens", async function () {
//         const exists = await this.erc721a.exists(6);
//         expect(exists).to.be.false;
//       });
//     });
//     describe("balanceOf", async function () {
//       it("returns the amount for a given address", async function () {
//         expect(await this.erc721a.balanceOf(this.owner.address)).to.equal("0");
//         expect(await this.erc721a.balanceOf(this.addr1.address)).to.equal("1");
//         expect(await this.erc721a.balanceOf(this.addr2.address)).to.equal("2");
//         expect(await this.erc721a.balanceOf(this.addr3.address)).to.equal("3");
//       });
//       it("throws an exception for the 0 address", async function () {
//         await expect(this.erc721a.balanceOf(ZERO_ADDRESS)).to.be.revertedWith("BalanceQueryForZeroAddress");
//       });
//     });
//     describe("_numberMinted", async function () {
//       it("returns the amount for a given address", async function () {
//         expect(await this.erc721a.numberMinted(this.owner.address)).to.equal("0");
//         expect(await this.erc721a.numberMinted(this.addr1.address)).to.equal("1");
//         expect(await this.erc721a.numberMinted(this.addr2.address)).to.equal("2");
//         expect(await this.erc721a.numberMinted(this.addr3.address)).to.equal("3");
//       });
//     });
//     describe("aux", async function () {
//       it("get and set works correctly", async function () {
//         const uint64Max = "18446744073709551615";
//         expect(await this.erc721a.getAux(this.owner.address)).to.equal("0");
//         await this.erc721a.setAux(this.owner.address, uint64Max);
//         expect(await this.erc721a.getAux(this.owner.address)).to.equal(uint64Max);
//         expect(await this.erc721a.getAux(this.addr1.address)).to.equal("0");
//         await this.erc721a.setAux(this.addr1.address, "1");
//         expect(await this.erc721a.getAux(this.addr1.address)).to.equal("1");
//         await this.erc721a.setAux(this.addr3.address, "5");
//         expect(await this.erc721a.getAux(this.addr3.address)).to.equal("5");
//         expect(await this.erc721a.getAux(this.addr1.address)).to.equal("1");
//       });
//       it("get and set rejects the zero address", async function () {
//         await expect(this.erc721a.getAux(ZERO_ADDRESS)).to.be.revertedWith("AuxQueryForZeroAddress");
//         await expect(this.erc721a.setAux(ZERO_ADDRESS, "1")).to.be.revertedWith("AuxQueryForZeroAddress");
//       });
//     });
//     describe("ownerOf", async function () {
//       it("returns the right owner", async function () {
//         expect(await this.erc721a.ownerOf(0)).to.equal(this.addr1.address);
//         expect(await this.erc721a.ownerOf(1)).to.equal(this.addr2.address);
//         expect(await this.erc721a.ownerOf(5)).to.equal(this.addr3.address);
//       });
//       it("reverts for an invalid token", async function () {
//         await expect(this.erc721a.ownerOf(10)).to.be.revertedWith("OwnerQueryForNonexistentToken");
//       });
//     });
//     describe("approve", async function () {
//       const tokenId = 0;
//       const tokenId2 = 1;
//       const tokenId3 = 5;
//       it("sets approval for the target address", async function () {
//         await this.erc721a.connect(this.addr1).approve(this.addr2.address, tokenId);
//         const approval = await this.erc721a.getApproved(tokenId);
//         expect(approval).to.equal(this.addr2.address);
//       });
//       it("rejects an invalid token owner", async function () {
//         await expect(this.erc721a.connect(this.addr1).approve(this.addr2.address, tokenId2)).to.be.revertedWith(
//           "ApprovalToCurrentOwner"
//         );
//       });
//       it("rejects an unapproved caller", async function () {
//         await expect(this.erc721a.approve(this.addr2.address, tokenId)).to.be.revertedWith(
//           "ApprovalCallerNotOwnerNorApproved"
//         );
//       });
//       it("does not get approved for invalid tokens", async function () {
//         await expect(this.erc721a.getApproved(10)).to.be.revertedWith("ApprovalQueryForNonexistentToken");
//       });
//       it("rejects try to locked token", async function () {
//         const lockUntil = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 60);

//         await expect(this.erc721a.connect(this.addr3).lock(tokenId3, lockUntil)).not.to.be.reverted;
//         await expect(this.erc721a.connect(this.addr3).approve(this.addr1.address, tokenId3)).to.be.revertedWith(
//           "ApproveLockedToken"
//         );
//       });
//     });
//     describe("setApprovalForAll", async function () {
//       it("sets approval for all properly", async function () {
//         const approvalTx = await this.erc721a.setApprovalForAll(this.addr1.address, true);
//         await expect(approvalTx)
//           .to.emit(this.erc721a, "ApprovalForAll")
//           .withArgs(this.owner.address, this.addr1.address, true);
//         expect(await this.erc721a.isApprovedForAll(this.owner.address, this.addr1.address)).to.be.true;
//       });
//       it("sets rejects approvals for non msg senders", async function () {
//         await expect(this.erc721a.connect(this.addr1).setApprovalForAll(this.addr1.address, true)).to.be.revertedWith(
//           "ApproveToCaller"
//         );
//       });
//     });
//     context("test transfer functionality", function () {
//       const testSuccessfulTransfer = function (transferFn) {
//         const tokenId = 1;
//         let from;
//         let to;
//         beforeEach(async function () {
//           const sender = this.addr2;
//           from = sender.address;
//           this.receiver = await this.ERC721Receiver.deploy(RECEIVER_MAGIC_VALUE);
//           to = this.receiver.address;
//           await this.erc721a.connect(sender).setApprovalForAll(to, true);
//           this.transferTx = await this.erc721a.connect(sender)[transferFn](from, to, tokenId);
//         });
//         it("transfers the ownership of the given token ID to the given address", async function () {
//           expect(await this.erc721a.ownerOf(tokenId)).to.be.equal(to);
//         });
//         it("emits a Transfer event", async function () {
//           await expect(this.transferTx).to.emit(this.erc721a, "Transfer").withArgs(from, to, tokenId);
//         });
//         it("clears the approval for the token ID", async function () {
//           expect(await this.erc721a.getApproved(tokenId)).to.be.equal(ZERO_ADDRESS);
//         });
//         it("emits an Approval event", async function () {
//           await expect(this.transferTx).to.emit(this.erc721a, "Approval").withArgs(from, ZERO_ADDRESS, tokenId);
//         });
//         it("adjusts owners balances", async function () {
//           expect(await this.erc721a.balanceOf(from)).to.be.equal(1);
//         });
//       };
//       const testUnsuccessfulTransfer = function (transferFn) {
//         const tokenId = 1;
//         it("rejects unapproved transfer", async function () {
//           await expect(
//             this.erc721a.connect(this.addr1)[transferFn](this.addr2.address, this.addr1.address, tokenId)
//           ).to.be.revertedWith("TransferCallerNotOwnerNorApproved");
//         });
//         it("rejects transfer from incorrect owner", async function () {
//           await this.erc721a.connect(this.addr2).setApprovalForAll(this.addr1.address, true);
//           await expect(
//             this.erc721a.connect(this.addr1)[transferFn](this.addr3.address, this.addr1.address, tokenId)
//           ).to.be.revertedWith("TransferFromIncorrectOwner");
//         });
//         it("rejects transfer to zero address", async function () {
//           await this.erc721a.connect(this.addr2).setApprovalForAll(this.addr1.address, true);
//           await expect(
//             this.erc721a.connect(this.addr1)[transferFn](this.addr2.address, ZERO_ADDRESS, tokenId)
//           ).to.be.revertedWith("TransferToZeroAddress");
//         });
//       };
//       context("successful transfers", function () {
//         describe("transferFrom", function () {
//           testSuccessfulTransfer("transferFrom");
//         });
//         describe("safeTransferFrom", function () {
//           testSuccessfulTransfer("safeTransferFrom(address,address,uint256)");
//           it("validates ERC721Received", async function () {
//             await expect(this.transferTx)
//               .to.emit(this.receiver, "Received")
//               .withArgs(this.addr2.address, this.addr2.address, 1, "0x", GAS_MAGIC_VALUE);
//           });
//         });
//       });
//       context("unsuccessful transfers", function () {
//         describe("transferFrom", function () {
//           testUnsuccessfulTransfer("transferFrom");
//         });
//         describe("safeTransferFrom", function () {
//           testUnsuccessfulTransfer("safeTransferFrom(address,address,uint256)");
//         });
//       });
//     });
//   });
//   context("mint", async function () {
//     beforeEach(async function () {
//       const [owner, addr1, addr2] = await ethers.getSigners();
//       this.owner = owner;
//       this.addr1 = addr1;
//       this.addr2 = addr2;
//       this.receiver = await this.ERC721Receiver.deploy(RECEIVER_MAGIC_VALUE);
//     });
//     describe("safeMint", function () {
//       it("successfully mints a single token", async function () {
//         const mintTx = await this.erc721a["safeMint(address,uint256,uint256)"](this.receiver.address, 1, 0);
//         await expect(mintTx).to.emit(this.erc721a, "Transfer").withArgs(ZERO_ADDRESS, this.receiver.address, 0);
//         await expect(mintTx)
//           .to.emit(this.receiver, "Received")
//           .withArgs(this.owner.address, ZERO_ADDRESS, 0, "0x", GAS_MAGIC_VALUE);
//         expect(await this.erc721a.ownerOf(0)).to.equal(this.receiver.address);
//       });
//       it("successfully mints multiple tokens", async function () {
//         const mintTx = await this.erc721a["safeMint(address,uint256,uint256)"](this.receiver.address, 5, 0);
//         for (let tokenId = 0; tokenId < 5; tokenId++) {
//           await expect(mintTx).to.emit(this.erc721a, "Transfer").withArgs(ZERO_ADDRESS, this.receiver.address, tokenId);
//           await expect(mintTx)
//             .to.emit(this.receiver, "Received")
//             .withArgs(this.owner.address, ZERO_ADDRESS, 0, "0x", GAS_MAGIC_VALUE);
//           expect(await this.erc721a.ownerOf(tokenId)).to.equal(this.receiver.address);
//         }
//       });
//       it("rejects mints to the zero address", async function () {
//         await expect(this.erc721a["safeMint(address,uint256,uint256)"](ZERO_ADDRESS, 1, 0)).to.be.revertedWith(
//           "MintToZeroAddress"
//         );
//       });
//       it("requires quantity to be greater than 0", async function () {
//         await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 0, 0)).to.be.revertedWith(
//           "MintZeroQuantity"
//         );
//       });
//       it("reverts for non-receivers", async function () {
//         const nonReceiver = this.erc721a;
//         await expect(this.erc721a["safeMint(address,uint256,uint256)"](nonReceiver.address, 1, 0)).to.be.revertedWith(
//           "TransferToNonERC721ReceiverImplementer"
//         );
//       });
//     });
//     describe("mint", function () {
//       const data = "0x42";
//       it("successfully mints a single token", async function () {
//         const mintTx = await this.erc721a.mint(this.receiver.address, 1, 0, data, false);
//         await expect(mintTx).to.emit(this.erc721a, "Transfer").withArgs(ZERO_ADDRESS, this.receiver.address, 0);
//         await expect(mintTx).to.not.emit(this.receiver, "Received");
//         expect(await this.erc721a.ownerOf(0)).to.equal(this.receiver.address);
//       });
//       it("successfully mints multiple tokens", async function () {
//         const mintTx = await this.erc721a.mint(this.receiver.address, 5, 0, data, false);
//         for (let tokenId = 0; tokenId < 5; tokenId++) {
//           await expect(mintTx).to.emit(this.erc721a, "Transfer").withArgs(ZERO_ADDRESS, this.receiver.address, tokenId);
//           await expect(mintTx).to.not.emit(this.receiver, "Received");
//           expect(await this.erc721a.ownerOf(tokenId)).to.equal(this.receiver.address);
//         }
//       });
//       it("does not revert for non-receivers", async function () {
//         const nonReceiver = this.erc721a;
//         await this.erc721a.mint(nonReceiver.address, 1, 0, data, false);
//         expect(await this.erc721a.ownerOf(0)).to.equal(nonReceiver.address);
//       });
//       it("rejects mints to the zero address", async function () {
//         await expect(this.erc721a.mint(ZERO_ADDRESS, 1, 0, data, false)).to.be.revertedWith("MintToZeroAddress");
//       });
//       it("requires quantity to be greater than 0", async function () {
//         await expect(this.erc721a.mint(this.owner.address, 0, 0, data, false)).to.be.revertedWith("MintZeroQuantity");
//       });
//     });
//   });
//   context("lock up", async function () {
//     const publicSalekey = "1";

//     before(async function () {
//       const [owner, addr9, addr10] = await ethers.getSigners();

//       this.owner = owner;
//       this.addr9 = addr9;
//       this.addr10 = addr10;
//       this.receiver = await this.ERC721Receiver.deploy(RECEIVER_MAGIC_VALUE);
//     });
//     it("can lock token", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil)).not.to.be.reverted;
//     });
//     it("can lock token upper than current lock until", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil)).not.to.be.reverted;
//       await expect(
//         this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil + 60 * 60 * 24 * 365 * 1)
//       ).not.to.be.reverted;
//     });
//     it("can lock token upper than current lock until", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil)).not.to.be.reverted;
//       await expect(
//         this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil + 60 * 60 * 24 * 365 * 1)
//       ).not.to.be.reverted;
//     });
//     it("can lock token upper than current lock until_23", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 60 * 60 * 24 * 30);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       this.erc721a["lockTransferFrom(address,address,uint256,uint256)"](
//         this.owner.address,
//         this.addr10.address,
//         tokenId,
//         lockUntil
//       );

//       await expect(this.erc721a.connect(this.addr10)["lock(uint256,uint256)"](tokenId, lockUntil)).not.to.be.reverted;
//       // await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil)).not.to.be.reverted;
//       await expect(
//         this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil + 60 * 60 * 24 * 365 * 1)
//       ).not.to.be.reverted;
//     });

//     it("cannot lock upper than current lock until", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil)).not.to.be.reverted;
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil - 30)).to.be.revertedWith(
//         "LockUntilMustBeUpperThanCurrentValue"
//       );
//       await expect(
//         this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil + 60 * 60 * 24 * 365 * 2)
//       ).to.be.revertedWith("LockNotUpperThanTwoYear");
//     });
//     it("cannot lock upper than two year", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       await expect(
//         this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil + 60 * 60 * 24 * 365 * 2 + 60 * 60 * 24)
//       ).to.be.revertedWith("LockNotUpperThanTwoYear");
//     });
//     it("can locks token", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenIds1 = [0, 1, 2];
//       const tokenIds2 = [3, 4, 5];
//       const tokenIds3 = [6, 7, 8];
//       const tokenIds4 = [9];

//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;

//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       await expect(this.erc721a["locks(uint256[],uint256)"](tokenIds1, lockUntil)).not.to.be.reverted;
//       await expect(this.erc721a["locks(uint256[],uint256)"](tokenIds2, lockUntil)).not.to.be.reverted;
//       await expect(this.erc721a["locks(uint256[],uint256)"](tokenIds3, lockUntil)).not.to.be.reverted;
//       await expect(this.erc721a["locks(uint256[],uint256)"](tokenIds4, lockUntil)).not.to.be.reverted;
//     });
//     it("cannot lock with a lower or same value", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil)).not.to.be.reverted;
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil)).to.be.revertedWith(
//         "LockUntilMustBeUpperThanCurrentValue"
//       );
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil - 10)).to.be.revertedWith(
//         "LockUntilMustBeUpperThanCurrentValue"
//       );
//     });
//     it("cannot lock zero", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, lockUntil)).not.to.be.reverted;
//       await expect(this.erc721a["lock(uint256,uint256)"](tokenId, 0)).to.be.revertedWith("LockUntilZero");
//     });
//     it("cannot lock only owner", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       const anotherUser = this.erc721a.connect(this.addr9);
//       await expect(anotherUser["lock(uint256,uint256)"](tokenId, lockUntil)).to.be.revertedWith(
//         "LockCallerNotOwnerNorApproved"
//       );
//     });

//     it("can lock and transfer", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, 0)).not.to.be.reverted;
//       await expect(
//         this.erc721a["lockTransferFrom(address,address,uint256,uint256)"](
//           this.owner.address,
//           this.addr10.address,
//           tokenId,
//           lockUntil
//         )
//       ).not.to.be.reverted;

//       (await this.erc721a.ownerOf(tokenId)).should.be.equal(this.addr10.address);
//       await expect(
//         this.erc721a.connect(this.addr10).transferFrom(this.addr10.address, this.addr9.address, tokenId)
//       ).to.be.revertedWith("TransferLockedToken");
//     });

//     it("can lock and transfer many", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       await expect(this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 5, 0)).not.to.be.reverted;
//       // let tokenIds;
//       let tokenIds = [];
//       for (let i = 0; i < 5; i++) tokenIds.push(i);
//       await expect(
//         this.erc721a["lockTransferFromMany(address,address,uint256[],uint256)"](
//           this.owner.address,
//           this.addr10.address,
//           tokenIds,
//           lockUntil
//         )
//       ).not.to.be.reverted;

//       for (let i = 0; i < tokenIds.length; i++) {
//         (await this.erc721a.ownerOf(tokenIds[i])).should.be.equal(this.addr10.address);
//         await expect(
//           this.erc721a.connect(this.addr10).transferFrom(this.addr10.address, this.addr9.address, tokenIds[i])
//         ).to.be.revertedWith("TransferLockedToken");
//       }
//     });

//     it("cannot lockTransfer for already locked token", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(
//         this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, lockUntil)
//       ).not.to.be.reverted;

//       await expect(
//         this.erc721a["lockTransferFrom(address,address,uint256,uint256)"](
//           this.owner.address,
//           this.addr10.address,
//           tokenId,
//           lockUntil - 300
//         )
//       ).to.be.revertedWith("TransferLockedToken");
//       await expect(
//         this.erc721a["lockTransferFrom(address,address,uint256,uint256)"](
//           this.owner.address,
//           this.addr10.address,
//           tokenId,
//           0
//         )
//       ).to.be.revertedWith("LockUntilZero");
//       await expect(
//         this.erc721a["lockTransferFrom(address,address,uint256,uint256)"](
//           this.owner.address,
//           this.addr10.address,
//           tokenId,
//           lockUntil + 300
//         )
//       ).to.be.revertedWith("TransferLockedToken");
//     });
//     it("cannot lockTransfer for zero address", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(
//         this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, lockUntil)
//       ).not.to.be.reverted;

//       await expect(
//         this.erc721a["lockTransferFrom(address,address,uint256,uint256)"](
//           this.owner.address,
//           ZERO_ADDRESS,
//           tokenId,
//           lockUntil
//         )
//       ).to.be.revertedWith("TransferToZeroAddress");
//     });
//     it("cannot lockTransfer for not approved", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(
//         this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, lockUntil)
//       ).not.to.be.reverted;
//       const contract = this.erc721a.connect(this.addr9);
//       await expect(
//         contract["lockTransferFrom(address,address,uint256,uint256)"](
//           this.owner.address,
//           this.addr10.address,
//           tokenId,
//           lockUntil
//         )
//       ).to.be.revertedWith("TransferCallerNotOwnerNorApproved");
//     });
//     it("cannot lockTransfer for difference from and owner", async function () {
//       const currnet = new Date();
//       const lockUntil = Math.floor(currnet.getTime() / 1000 + 600);
//       const tokenId = 0;
//       await expect(
//         this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, 1, lockUntil)
//       ).not.to.be.reverted;

//       await expect(
//         this.erc721a["lockTransferFrom(address,address,uint256,uint256)"](
//           this.addr9.address,
//           this.addr10.address,
//           tokenId,
//           lockUntil
//         )
//       ).to.be.revertedWith("TransferFromIncorrectOwner");
//     });
//     context("view functions", async function () {
//       const publicSalekey = "1";

//       before(async function () {
//         const [owner, addr9, addr10] = await ethers.getSigners();

//         this.owner = owner;
//         this.addr9 = addr9;
//         this.addr10 = addr10;
//         this.receiver = await this.ERC721Receiver.deploy(RECEIVER_MAGIC_VALUE);
//       });

//       it("tokens of owner", async function () {
//         const quentity = 5;
//         await expect(
//           this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, quentity, 0)
//         ).not.to.be.reverted;
//         const tokens = await this.erc721a["tokensOfOwner(address)"](this.owner.address);
//         for (let i = 0; i < tokens.length; i++) {
//           expect(tokens[i].addr).to.be.equal(this.owner.address);
//         }
//       });
//       it("check after got another token ", async function () {
//         const quentity = 5;
//         await expect(
//           this.erc721a["safeMint(address,uint256,uint256)"](this.owner.address, quentity, 0)
//         ).not.to.be.reverted;

//         await expect(
//           this.erc721a["safeMint(address,uint256,uint256)"](this.addr9.address, quentity, 0)
//         ).not.to.be.reverted;
//         const contract = this.erc721a.connect(this.addr9);
//         await expect(
//           contract["safeTransferFrom(address,address,uint256)"](this.addr9.address, this.owner.address, 9)
//         ).not.to.be.reverted;
//         const tokens = await this.erc721a["tokensOfOwner(address)"](this.owner.address);
//         // const token = await this.erc721a.ownershipOf(9);
//         expect(tokens.length).to.be.equal(quentity + 1);
//         for (let i = 0; i < tokens.length; i++) {
//           expect(tokens[i].addr).to.be.equal(this.owner.address);
//         }
//       });
//     });
//   });
// });
