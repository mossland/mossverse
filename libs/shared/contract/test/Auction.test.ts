// /* eslint-disable no-undef */
// const chai = require("chai");

// const { constants } = require("@openzeppelin/test-helpers");
// const { current } = require("@openzeppelin/test-helpers/src/balance");

// const etherToWei = (number) => {
//   return (number * Math.pow(10, 18)).toString();
// };
// const should = chai.should();
// const expect = chai.expect;

// describe("Auction", function () {
//   let currentTokenIdx = 0;
//   const maxBatchSize = 5;
//   const collectionSize = 29;
//   const amountForAuctionAndDev = 14;
//   const amountForDev = 5;
//   before(async function () {
//     this.Akamir = await ethers.getContractFactory("Akamir");
//     this.ERC721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
//     this.akamir = await this.Akamir.deploy(maxBatchSize, collectionSize, amountForAuctionAndDev, amountForDev);
//     await this.akamir.deployed();
//   });

//   context("mint for dev", async function () {
//     before(async function () {
//       const [owner, , , , , , , addr7, addr8, addr9, addr10] = await ethers.getSigners();
//       this.owner = owner;
//       this.addr7 = addr7;
//       this.addr8 = addr8;
//       this.addr9 = addr9;
//       this.addr10 = addr10;
//     });
//     it("non-owner cannot mint", async function () {
//       await expect(this.akamir.connect(this.addr7).devMint(1, 0)).to.be.revertedWith(
//         "Ownable: caller is not the owner"
//       );
//     });
//     it("owner can mint", async function () {
//       const mintNum = 5;
//       await expect(this.akamir.devMint(mintNum, 0)).not.to.be.reverted;
//       (await this.akamir.balanceOf(this.owner.address)).should.be.equal(5);
//       currentTokenIdx += mintNum;
//     });

//     it("cannot exceed dev limit", async function () {
//       await expect(this.akamir.devMint(5, 0)).to.be.revertedWith("too many already minted before dev mint");
//     });
//   });

//   context("auction sale", async function () {
//     before(async function () {
//       const [owner, addr1, addr2, addr3] = await ethers.getSigners();
//       this.owner = owner;
//       this.addr1 = addr1;
//       this.addr2 = addr2;
//       this.addr3 = addr3;
//       this.akamir.setSaleLimit(1000);
//     });
//     it("cannot mint before setup", async function () {
//       await expect(this.akamir.connect(this.addr1).auctionMint(1, 0)).to.be.revertedWith(
//         "auction sale has not begun yet"
//       );
//       (await this.akamir.balanceOf(this.addr1.address)).should.be.equal("0");
//     });
//     it("cannot mint before start time", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000 + 60);
//       const startPrice = 1;
//       const endPrice = 1;
//       const auctionSaleLimit = 9;
//       const dropCurve = 340;
//       const dropInterval = 20;
//       await this.akamir.setAuctionSaleOptions(
//         startTime,
//         etherToWei(startPrice),
//         etherToWei(endPrice),
//         auctionSaleLimit,
//         dropCurve,
//         dropInterval
//       );
//       await expect(this.akamir.connect(this.addr1).auctionMint(1, 0, { value: etherToWei(1) })).to.be.revertedWith(
//         "auction sale has not begun yet"
//       );
//       (await this.akamir.balanceOf(this.addr1.address)).should.be.equal("0");
//     });
//     it("cannot mint setup zero price", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000 - 60);
//       const startPrice = 0;
//       const endPrice = 1;
//       const auctionSaleLimit = 9;
//       const dropCurve = 340;
//       const dropInterval = 20;
//       await this.akamir.setAuctionSaleOptions(
//         startTime,
//         etherToWei(startPrice),
//         etherToWei(endPrice),
//         auctionSaleLimit,
//         dropCurve,
//         dropInterval
//       );
//       await expect(this.akamir.connect(this.addr1).auctionMint(1, 0, { value: etherToWei(1) })).to.be.revertedWith(
//         "auction sale has not begun yet"
//       );
//       (await this.akamir.balanceOf(this.addr1.address)).should.be.equal("0");
//     });
//     it("cannot mint setup zero auction sale limit", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000 - 60);
//       const startPrice = 1;
//       const endPrice = 1;
//       const auctionSaleLimit = 0;
//       const dropCurve = 340;
//       const dropInterval = 20;
//       await this.akamir.setAuctionSaleOptions(
//         startTime,
//         etherToWei(startPrice),
//         etherToWei(endPrice),
//         auctionSaleLimit,
//         dropCurve,
//         dropInterval
//       );
//       await expect(this.akamir.connect(this.addr1).auctionMint(1, 0, { value: etherToWei(1) })).to.be.revertedWith(
//         "auction sale has not begun yet"
//       );
//       (await this.akamir.balanceOf(this.addr1.address)).should.be.equal("0");
//     });
//     it("cannot mint setup zero sale limit", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000 - 60);
//       const startPrice = 1;
//       const endPrice = 1;
//       const auctionSaleLimit = 9;
//       const dropCurve = 340;
//       const dropInterval = 20;
//       await this.akamir.setSaleLimit(0);
//       await this.akamir.setAuctionSaleOptions(
//         startTime,
//         etherToWei(startPrice),
//         etherToWei(endPrice),
//         auctionSaleLimit,
//         dropCurve,
//         dropInterval
//       );
//       await expect(this.akamir.connect(this.addr1).auctionMint(1, 0, { value: etherToWei(1) })).to.be.revertedWith(
//         "auction sale has not begun yet"
//       );
//       (await this.akamir.balanceOf(this.addr1.address)).should.be.equal("0");
//     });
//     it("can mint in auction sale", async function () {
//       this.akamir.setSaleLimit(1000);
//       const startTime = Math.floor(new Date().getTime() / 1000 - 10);
//       const startPrice = 1;
//       const endPrice = 1;
//       const auctionSaleLimit = 9;
//       const dropCurve = 340;
//       const dropInterval = 20;
//       await this.akamir.setAuctionSaleOptions(
//         startTime,
//         etherToWei(startPrice),
//         etherToWei(endPrice),
//         auctionSaleLimit,
//         dropCurve,
//         dropInterval
//       );
//       await expect(this.akamir.setDiscountlist([10, 30, 40])).not.to.be.reverted;
//       const mintNum = 3;
//       await expect(
//         this.akamir.connect(this.addr1).auctionMint(mintNum, 0, { value: etherToWei(mintNum) })
//       ).not.to.be.reverted;
//       (await this.akamir.balanceOf(this.addr1.address)).should.be.equal(`${mintNum}`);
//       currentTokenIdx += mintNum;
//     });
//     it("can mint in auction sale with lockUntil 12 month", async function () {
//       const currentTime = Math.floor(new Date().getTime() / 1000);
//       const lockUntil1 = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 30 * 1);
//       const lockUntil2 = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 30 * 12);
//       const mintNum = 1;
//       await expect(
//         this.akamir.connect(this.addr1).auctionMint(mintNum, lockUntil1, { value: "1000000000000000000" })
//       ).to.be.revertedWith("does not match discountList and lockUntil");
//       await expect(
//         this.akamir.connect(this.addr1).auctionMint(mintNum, lockUntil2, { value: "1000000000000000000" })
//       ).not.to.be.reverted;
//       currentTokenIdx += mintNum;
//       (await this.akamir.balanceOf(this.addr1.address)).should.be.equal("4");
//       const from = this.addr1.address;
//       const to = this.addr2.address;

//       const tokenId = currentTokenIdx - 1;
//       await expect(this.akamir.connect(this.addr1).transferFrom(from, to, tokenId)).to.be.revertedWith(
//         "TransferLockedToken"
//       );
//     });
//     it("cannot exceed mint limit at auction sale limit", async function () {
//       await expect(
//         this.akamir.connect(this.addr2).auctionMint(5, 0, { value: "10000000000000000000" })
//       ).to.be.revertedWith("cannot mint over sale limit");
//     });
//     it("cannot exceed mint limit at once", async function () {
//       await expect(
//         this.akamir.connect(this.addr1).auctionMint(10, 0, { value: "10000000000000000000" })
//       ).to.be.reverted;
//     });
//     it("cannot mint max per address", async function () {
//       await expect(this.akamir.connect(this.addr1).auctionMint(5, 0, { value: "5000000000000000000" })).to.be.reverted;
//     });
//     it("cannot mint when depleted", async function () {
//       const mintNum = 2;

//       // await this.akamir.connect(this.addr2).auctionMint(mintNum, 0, { value: "5000000000000000000" });
//       await expect(this.akamir.connect(this.addr3).auctionMint(5, 0, { value: "5000000000000000000" })).to.be.reverted;
//     });
//   });

//   context("allowlist sale", async function () {
//     before(async function () {
//       const [owner, , , , addr4, addr5, addr6, addr7] = await ethers.getSigners();
//       this.owner = owner;
//       this.addr4 = addr4;
//       this.addr5 = addr5;
//       this.addr6 = addr6;
//       this.addr7 = addr7;
//     });
//     it("seeds allowlist", async function () {
//       await expect(this.akamir.seedAllowlist([this.addr4.address, this.addr5.address], [1, 2])).not.to.be.reverted;
//     });
//     it("cannot mint allowlist before setup", async function () {
//       //before setup case
//       await expect(
//         this.akamir.connect(this.addr4).allowlistMint(1, 0, { value: "1000000000000000000" })
//       ).to.be.revertedWith("allowlist sale has not begun yet");
//     });
//     it("cannot mint allowlist beofre start price", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000 + 120);
//       //time zero case
//       await this.akamir.endAuctionAndSetupMintlistSaleInfo("1000000000000000000", startTime);
//       await expect(
//         this.akamir.connect(this.addr4).allowlistMint(1, 0, { value: "1000000000000000000" })
//       ).to.be.revertedWith("allowlist sale has not begun yet");
//     });

//     it("cannot mint allowlist zero start time", async function () {
//       //time zero case
//       await this.akamir.endAuctionAndSetupMintlistSaleInfo("1000000000000000000", 0);
//       await expect(
//         this.akamir.connect(this.addr4).allowlistMint(1, 0, { value: "1000000000000000000" })
//       ).to.be.revertedWith("allowlist sale has not begun yet");
//     });

//     it("cannot mint allowlist zero price", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000);
//       //time zero case
//       await this.akamir.endAuctionAndSetupMintlistSaleInfo(0, startTime);
//       await expect(
//         this.akamir.connect(this.addr4).allowlistMint(1, 0, { value: "1000000000000000000" })
//       ).to.be.revertedWith("allowlist sale has not begun yet");
//     });
//     it("cannot mint allowlist zero sale limit", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000);
//       //time zero case
//       await this.akamir.endAuctionAndSetupMintlistSaleInfo("1000000000000000000", startTime);
//       await this.akamir.setSaleLimit(0);
//       await expect(
//         this.akamir.connect(this.addr4).allowlistMint(1, 0, { value: "1000000000000000000" })
//       ).to.be.revertedWith("allowlist sale has not begun yet");
//       await this.akamir.setSaleLimit(1000);
//     });

//     it("can mint in allowlist sale", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000 - 1);
//       await this.akamir.endAuctionAndSetupMintlistSaleInfo("500000000000000000", startTime);
//       const mintNum1 = 1,
//         mintNum2 = 2;
//       await expect(
//         this.akamir.connect(this.addr4).allowlistMint(1, 0, { value: "500000000000000000" })
//       ).not.to.be.reverted;
//       await expect(
//         this.akamir.connect(this.addr5).allowlistMint(2, 0, { value: "1000000000000000000" })
//       ).not.to.be.reverted;

//       expect(await this.akamir.balanceOf(this.addr4.address)).to.equal("1");
//       expect(await this.akamir.balanceOf(this.addr5.address)).to.equal("2");
//       currentTokenIdx += mintNum1 + mintNum2;
//     });
//     it("can mint in allow sale without discount", async function () {
//       const currentTime = Math.floor(new Date().getTime() / 1000);
//       const lockUntil1 = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 30 * 1);
//       const lockUntilWith12Month = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 30 * 4);
//       const mintNum = 1;

//       await expect(this.akamir.seedAllowlist([this.addr7.address], [1])).not.to.be.reverted;
//       await expect(this.akamir.setDiscountlist([0])).not.to.be.reverted;
//       await expect(
//         this.akamir.connect(this.addr7).allowlistMint(mintNum, lockUntilWith12Month, { value: "500000000000000000" })
//       ).not.to.be.reverted;
//       expect(await this.akamir.balanceOf(this.addr7.address)).to.equal("1");
//       currentTokenIdx += mintNum;

//       const from = this.addr7.address;
//       const to = this.addr6.address;

//       const tokenId = currentTokenIdx - 1;
//       await expect(this.akamir.connect(this.addr7).transferFrom(from, to, tokenId)).to.be.revertedWith(
//         "TransferLockedToken"
//       );
//     });
//     it("can mint in allow sale with lockUntil 4 month", async function () {
//       const currentTime = Math.floor(new Date().getTime() / 1000);
//       const lockUntil1 = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 30 * 1);
//       const lockUntilWith12Month = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 30 * 4);
//       const mintNum = 1;
//       await expect(this.akamir.setDiscountlist([10, 30, 40])).not.to.be.reverted;
//       await expect(this.akamir.seedAllowlist([this.addr7.address], [2])).not.to.be.reverted;
//       await expect(
//         this.akamir.connect(this.addr7).allowlistMint(mintNum, lockUntil1, { value: "500000000000000000" })
//       ).to.be.revertedWith("does not match discountList and lockUntil");
//       await expect(
//         this.akamir.connect(this.addr7).allowlistMint(mintNum, lockUntilWith12Month, { value: "500000000000000000" })
//       ).not.to.be.reverted;
//       expect(await this.akamir.balanceOf(this.addr7.address)).to.equal("2");
//       currentTokenIdx += mintNum;

//       const from = this.addr7.address;
//       const to = this.addr6.address;

//       const tokenId = currentTokenIdx - 1;
//       await expect(this.akamir.connect(this.addr7).transferFrom(from, to, tokenId)).to.be.revertedWith(
//         "TransferLockedToken"
//       );
//     });
//     it("cannot mint without allowlist", async function () {
//       await expect(
//         this.akamir.connect(this.addr6).allowlistMint(2, 0, { value: "1000000000000000000" })
//       ).to.be.reverted;
//       expect(await this.akamir.balanceOf(this.addr6.address)).to.equal("0");
//     });
//     it("cannot mint exceed mint sale limit", async function () {
//       const totalSupply = await this.akamir.totalSupply();
//       await this.akamir.setSaleLimit(totalSupply);
//       await expect(this.akamir.seedAllowlist([this.addr6.address], [1])).not.to.be.reverted;
//       // const totalSupply = await this.akamir.totalSupply();
//       await expect(
//         this.akamir.connect(this.addr6).allowlistMint(1, 0, { value: "1000000000000000000" })
//       ).to.be.revertedWith("can not mint over sale limit");
//     });
//     it("clear allow list", async function () {
//       await expect(this.akamir.seedAllowlist([this.addr6.address], [3])).not.to.be.reverted;
//       await expect(this.akamir.clearAllowlist()).not.to.be.reverted;
//       // expect(await this.akamir.connect(this.addr6).allowSlot()).to.equal("0");
//       await expect(
//         this.akamir.connect(this.addr6).allowlistMint(1, 0, { value: "1000000000000000000" })
//       ).to.be.revertedWith("not eligible for allowlist mint");
//     });
//     it("cannot mint close after allowlist mint", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000);
//       await expect(this.akamir.seedAllowlist([this.addr6.address], [3])).not.to.be.reverted;
//       await this.akamir.endMintlistAndSetupPublicSaleInfo("1000000000000000000", startTime);
//       await expect(
//         this.akamir.connect(this.addr6).allowlistMint(1, 0, { value: "1000000000000000000" })
//       ).to.be.revertedWith("allowlist sale has not begun yet");
//       await this.akamir.setSaleLimit(1000);
//     });
//   });

//   context("public sale", async function () {
//     const publicSalekey = "1";

//     before(async function () {
//       const [owner, , , , , , , addr7, addr8, addr9, addr10] = await ethers.getSigners();
//       this.owner = owner;
//       this.addr7 = addr7;
//       this.addr8 = addr8;
//       this.addr9 = addr9;
//       this.addr10 = addr10;
//       this.akamir.setPublicSaleKey(publicSalekey);
//     });
//     it("cannot mint before setup", async function () {
//       await this.akamir.endMintlistAndSetupPublicSaleInfo(0, 0);
//       await expect(
//         this.akamir.connect(this.addr7).publicSaleMint(1, 0, publicSalekey, { value: "1000000000000000000" })
//       ).to.be.revertedWith("public sale has not begun yet");
//     });
//     it("cannot mint zero price", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000 - 120);
//       await this.akamir.endMintlistAndSetupPublicSaleInfo(0, startTime);
//       await expect(
//         this.akamir.connect(this.addr7).publicSaleMint(1, 0, publicSalekey, { value: "1000000000000000000" })
//       ).to.be.revertedWith("public sale has not begun yet");
//     });
//     it("cannot mint zero start time", async function () {
//       await this.akamir.endMintlistAndSetupPublicSaleInfo("1000000000000000000", 0);
//       await expect(
//         this.akamir.connect(this.addr7).publicSaleMint(1, 0, publicSalekey, { value: "1000000000000000000" })
//       ).to.be.revertedWith("public sale has not begun yet");
//     });
//     it("cannot mint before start time", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 30);
//       await this.akamir.endMintlistAndSetupPublicSaleInfo("1000000000000000000", startTime);
//       await expect(
//         this.akamir.connect(this.addr7).publicSaleMint(1, 0, publicSalekey, { value: "1000000000000000000" })
//       ).to.be.revertedWith("public sale has not begun yet");
//     });
//     it("cannot mint zero sale limit", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 30);
//       await this.akamir.endMintlistAndSetupPublicSaleInfo("1000000000000000000", startTime);
//       await this.akamir.setSaleLimit(0);
//       await expect(
//         this.akamir.connect(this.addr7).publicSaleMint(1, 0, publicSalekey, { value: "1000000000000000000" })
//       ).to.be.revertedWith("public sale has not begun yet");
//       await this.akamir.setSaleLimit(1000);
//     });
//     it("can mint in public sale", async function () {
//       const mintNum = 2;
//       const startTime = Math.floor(new Date().getTime() / 1000 - 60);
//       await this.akamir.endMintlistAndSetupPublicSaleInfo("1000000000000000000", startTime);

//       await this.akamir.connect(this.addr7).publicSaleMint(mintNum, 0, publicSalekey, { value: "2000000000000000000" });

//       expect(await this.akamir.balanceOf(this.addr7.address)).to.equal("4");
//       currentTokenIdx += mintNum;
//     });

//     it("can mint in public sale with lockUntil 8 month", async function () {
//       const mintNum = 1;
//       const startTime = Math.floor(new Date().getTime() / 1000 - 60);
//       // await expect(this.akamir.setDiscountlist([10, 30, 40])).not.to.be.reverted;
//       const lockUntilWith8Month = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24 * 30 * 8);
//       await this.akamir
//         .connect(this.addr7)
//         .publicSaleMint(mintNum, lockUntilWith8Month, publicSalekey, { value: "2000000000000000000" });

//       expect(await this.akamir.balanceOf(this.addr7.address)).to.equal("5");
//       currentTokenIdx += mintNum;
//     });

//     it("does not match public Sale key", async function () {
//       const key = "2";
//       await expect(
//         this.akamir.connect(this.addr8).publicSaleMint(1, 0, key, { value: "1000000000000000000" })
//       ).to.be.revertedWith("called with incorrect public sale key");
//     });
//     it("cannot exceed mint limit at once", async function () {
//       await expect(
//         this.akamir.connect(this.addr8).publicSaleMint(6, 0, publicSalekey, { value: "6000000000000000000" })
//       ).to.be.revertedWith("can not mint this many");
//     });
//     it("cannot exceed total mint total supply", async function () {
//       await expect(
//         this.akamir
//           .connect(this.addr7)
//           .publicSaleMint(collectionSize, 0, publicSalekey, { value: "1000000000000000000" })
//       ).to.be.revertedWith("reached max supply");
//     });
//     it("cannot exceed total mint sale mint", async function () {
//       this.akamir.setSaleLimit(10);
//       await expect(
//         this.akamir.connect(this.addr8).publicSaleMint(1, 0, publicSalekey, { value: "1000000000000000000" })
//       ).to.be.revertedWith("can not mint over sale limit");
//     });
//     it("cannot mint when depleted", async function () {
//       await this.akamir.setSaleLimit(collectionSize);
//       await this.akamir.connect(this.addr10).publicSaleMint(1, 0, publicSalekey, { value: "2000000000000000000" });
//       await this.akamir.connect(this.addr8).publicSaleMint(5, 0, publicSalekey, { value: "5000000000000000000" });
//       await this.akamir.connect(this.addr9).publicSaleMint(5, 0, publicSalekey, { value: "5000000000000000000" });
//       await expect(
//         this.akamir.connect(this.addr10).publicSaleMint(4, 0, publicSalekey, { value: "2000000000000000000" })
//       ).to.be.revertedWith("reached max supply");
//     });
//   });
//   context("end Sale", async function () {
//     const publicSalekey = "1";
//     before(async function () {
//       const [owner, , , , , , , addr7, addr8, addr9, addr10] = await ethers.getSigners();
//       this.owner = owner;
//       this.addr7 = addr7;
//       this.addr8 = addr8;
//       this.addr9 = addr9;
//       this.addr10 = addr10;
//     });

//     it("End sale", async function () {
//       await this.akamir.endSale();
//       await expect(
//         this.akamir.connect(this.addr10).auctionMint(1, 0, { value: "2000000000000000000" })
//       ).to.be.revertedWith("auction sale has not begun yet");
//       await expect(this.akamir.seedAllowlist([this.addr10.address], [1])).not.to.be.reverted;

//       await expect(
//         this.akamir.connect(this.addr10).allowlistMint(1, 0, { value: "2000000000000000000" })
//       ).to.be.revertedWith("allowlist sale has not begun yet");
//       await expect(
//         this.akamir.connect(this.addr10).publicSaleMint(1, 0, publicSalekey, { value: "2000000000000000000" })
//       ).to.be.revertedWith("public sale has not begun yet");
//     });
//   });
//   context("URI TEST", async function () {
//     const publicSalekey = "1";

//     before(async function () {
//       const [owner, , , , , , , addr7, addr8, addr9, addr10] = await ethers.getSigners();
//       this.owner = owner;
//       this.addr7 = addr7;
//       this.addr8 = addr8;
//       this.addr9 = addr9;
//       this.addr10 = addr10;
//     });
//     it("reveal uri rink", async function () {
//       await this.akamir.setNotRevealedURI("aaa");
//       await this.akamir.setBaseURI("bbb");
//       await this.akamir.setRevealLimit(10);
//       expect(await this.akamir.tokenURI(11)).to.be.equal("aaa");
//       expect(await this.akamir.tokenURI(1)).to.be.equal("bbb1.json");
//     });
//   });
// });
