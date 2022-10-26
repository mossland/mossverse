// /* eslint-disable no-undef */
// const chai = require("chai");

// const { constants } = require("@openzeppelin/test-helpers");
// const { current } = require("@openzeppelin/test-helpers/src/balance");
// const { contextType } = require("google-map-react");

// const etherToWei = (number) => {
//   return (number * Math.pow(10, 18)).toString();
// };
// const should = chai.should();
// const expect = chai.expect;

// describe("Akamir Fraction test", function () {
//   before(async function () {
//     const [owner, fractionOwner, signer] = await ethers.getSigners();
//     this.owner = owner;
//     this.signer = signer;
//     this.fractionOwner = fractionOwner;

//     this.fractionTokenId = 0;

//     this.Akamir = await ethers.getContractFactory("Akamir");
//     this.AkamirFraction = await ethers.getContractFactory("Fraction");
//     this.ERC721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");

//     this.akamir = await this.Akamir.deploy(5, 10000, 9800, 1000);
//     this.akamirFraction = await this.AkamirFraction.connect(this.fractionOwner).deploy(this.akamir.address);

//     expect(await this.akamir.deployed()).not.to.be.undefined;
//     expect(await this.akamirFraction.deployed()).not.to.be.undefined;
//   });

//   context("mint dev akamir", async function () {
//     before(async function () {
//       const [owner] = await ethers.getSigners();
//       this.owner = owner;
//     });

//     it("mint for test akamir", async function () {
//       await expect(this.akamir.connect(this.owner).devMint(500, 0)).not.to.be.reverted;
//     });
//   });

//   context("start fraction", async function () {
//     before(async function () {
//       const [owner, fractionOwner, signer] = await ethers.getSigners();
//       this.owner = owner;
//       this.fractionOwner = fractionOwner;
//       this.signer = signer;
//     });

//     it("cannot fraction non-ownerble sender", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000);
//       await expect(
//         this.akamirFraction
//           .connect(this.signer)
//           .fraction(this.owner.address, 0, ethers.utils.parseEther("0.1"), 10, startTime)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });
//     it("cannot fraction before approve ", async function () {
//       const startTime = Math.floor(new Date().getTime() / 1000);
//       await expect(
//         this.akamirFraction
//           .connect(this.fractionOwner)
//           .fraction(this.owner.address, this.fractionTokenId, ethers.utils.parseEther("0.1"), 10, startTime)
//       ).to.be.revertedWith("TransferCallerNotOwnerNorApproved");
//     });

//     it("can fraction 0 token", async function () {
//       await expect(this.akamir.connect(this.owner).approve(this.akamirFraction.address, 0)).not.to.be.reverted;
//       const startTime = Math.floor(new Date().getTime() / 1000);
//       await expect(
//         this.akamirFraction
//           .connect(this.fractionOwner)
//           .fraction(this.owner.address, this.fractionTokenId, ethers.utils.parseEther("0.1"), 10, startTime)
//       ).not.to.be.reverted;
//     });
//     expect(await this.akamir.getOwnershipData(this.fractionTokenId).addr).to.be.equal(this.akamirFraction.address);
//   });
//   context("mint test", async function () {
//     before(async function () {
//       this.amount = 10;
//     });

//     it("cannot mint approval", async function () {
//       const anotherTokenId = 1;

//       await expect(
//         this.akamirFraction
//           .connect(this.signer)
//           .mint(anotherTokenId, this.amount, { value: ethers.utils.parseEther((0.1 * this.amount).toString()) })
//       ).to.be.revertedWith("this token is not approved.");
//     });
//     it("cannot mint before startTime", async function () {
//       let startTime = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24);

//       await expect(
//         this.akamirFraction.connect(this.fractionOwner).setSaleStartTime(this.fractionTokenId, startTime)
//       ).not.to.be.reverted;
//       await expect(
//         this.akamirFraction
//           .connect(this.signer)
//           .mint(this.fractionTokenId, this.amount, { value: ethers.utils.parseEther((0.1 * this.amount).toString()) })
//       ).to.be.revertedWith("sale has not begun yet");
//       startTime = Math.floor(new Date().getTime() / 1000 - 60 * 60 * 24);
//       await expect(
//         this.akamirFraction.connect(this.fractionOwner).setSaleStartTime(this.fractionTokenId, startTime)
//       ).not.to.be.reverted;
//     });
//     it("cannot mint lower than config price", async function () {
//       await expect(
//         this.akamirFraction
//           .connect(this.signer)
//           .mint(this.fractionTokenId, this.amount, { value: ethers.utils.parseEther((0.01 * this.amount).toString()) })
//       ).to.be.revertedWith("Need to send more ETH.");
//     });
//     it("cannot mint higher than config this.amount", async function () {
//       await expect(
//         this.akamirFraction.connect(this.signer).mint(this.fractionTokenId, this.amount + 3, {
//           value: ethers.utils.parseEther((0.1 * this.amount + 3).toString()),
//         })
//       ).to.be.revertedWith("cannot mint higher than config amount.");
//     });
//     it("can mint One token", async function () {
//       await expect(
//         this.akamirFraction
//           .connect(this.signer)
//           .mint(this.fractionTokenId, this.amount, { value: ethers.utils.parseEther((0.1 * this.amount).toString()) })
//       ).not.to.be.reverted;
//     });

//     expext(await this.akamirFraction.balanceOf(this.signer.address, this.fractionTokenId)).to.be.equal(this.amount);
//   });

//   context("combine test", async function () {
//     before(async function () {
//       const [owner, fractionOwner, signer, signer2] = await ethers.getSigners();
//       this.owner = owner;
//       this.fractionOwner = fractionOwner;
//       this.signer = signer;
//       this.signer2 = signer2;
//     });

//     it("cannot combine to by non-owner", async function () {
//       await expect(
//         this.akamirFraction
//           .connect(this.signer)
//           .safeTransferFrom(this.signer.address, this.signer2.address, this.fractionTokenId, 1, 0)
//       ).not.to.be.reverted;

//       await expect(this.akamirFraction.connect(this.fractionOwner).combine(this.signer.address, 0)).to.be.revertedWith(
//         "Insufficient number of tokens to combine."
//       );
//     });

//     it("can combine", async function () {
//       await expect(
//         this.akamirFraction
//           .connect(this.signer2)
//           .safeTransferFrom(this.signer2.address, this.signer.address, this.fractionTokenId, 1, 0)
//       ).not.to.be.reverted;
//       await this.akamirFraction.connect(this.fractionOwner).setURI(this.fractionTokenId, "test uri");
//       expect(await this.akamirFraction.tokenURI(this.fractionTokenId)).to.be.equal("test uri");

//       await expect(this.akamirFraction.connect(this.fractionOwner).combine(this.signer.address, 0)).not.to.be.reverted;

//       const fraction = await this.akamirFraction.fractions(0);

//       expect(fraction.approval).to.be.false;
//       expect(fraction.price).to.be.equal(0);
//       expect(fraction.amount).to.be.equal(0);
//       expect(fraction.saleStartTime).to.be.equal(0);
//       expect(fraction.totalSupply).to.be.equal(0);
//       expect(await this.akamirFraction.tokenURI(this.fractionTokenId)).to.be.equal("");
//     });
//   });
// });
