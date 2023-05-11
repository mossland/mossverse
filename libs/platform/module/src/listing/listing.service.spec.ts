import { environment } from "../_environments/environment";
import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
import { TestingModule } from "@nestjs/testing";
import { Utils } from "@shared/util";
import * as ethers from "ethers";
import { ListingService } from "./listing.service";
import { Erc1155, Erc20, Erc721, Id } from "@shared/util-server";
import { TestSystem } from "@shared/test-server";
import { ListingModule } from "./listing.module";

describe("Listing Service", () => {
  const system = new TestSystem();
  let listingService: ListingService;
  let networkService: srv.shared.NetworkService;
  let contractService: srv.shared.ContractService;
  let tokenService: srv.shared.TokenService;
  let walletService: srv.shared.WalletService;
  let ownershipService: srv.shared.OwnershipService;
  let seller: db.User.Doc;
  let sellerWallet: db.shared.Wallet.Doc;
  let network: db.shared.Network.Doc;
  let contract: db.shared.Contract.Doc;
  let thing: db.shared.Thing.Doc;
  let token: db.shared.Token.Doc;
  let product: db.shared.Product.Doc;
  let image: db.shared.File.Doc;
  let buyer: db.User.Doc;
  let buyerKeyring: db.shared.Keyring.Doc;
  let buyerWallet: db.shared.Wallet.Doc;
  let app: TestingModule;
  const provider = new ethers.providers.JsonRpcProvider(environment.ethereum.endpoint);
  const buyerSigner = new ethers.Wallet(environment.ethereum.testWallets[0].privateKey, provider);
  let erc20: Erc20;
  let erc721: Erc721;
  let erc1155: Erc1155;
  beforeAll(async () => {
    app = await system.init(registerModules(environment));
    // listingService = app.get<ListingService>(ListingService);
    // networkService = app.get<srv.shared.NetworkService>(srv.shared.NetworkService);
    // contractService = app.get<srv.shared.ContractService>(srv.shared.ContractService);
    // tokenService = app.get<srv.shared.TokenService>(srv.shared.TokenService);
    // walletService = app.get<srv.shared.WalletService>(srv.shared.WalletService);
    // ownershipService = app.get<srv.shared.OwnershipService>(srv.shared.OwnershipService);
    // image = await sample.shared.createFile(app);
    // network = await sample.shared.createNetwork(app, "ethereum");
    // [seller, , sellerWallet] = await sample.createUser(app, network._id, environment.ethereum.root.address);
    // [buyer, buyerKeyring, buyerWallet] = await sample.createUser(
    //   app,
    //   network._id,
    //   environment.ethereum.testWallets[0].address
    // );
    // thing = await sample.shared.createThing(app, image._id);
    // product = await sample.shared.createProduct(app, image._id);
    // contract = await sample.shared.createContract(app, network._id, environment.ethereum.erc721);
    // erc721 = (await networkService.loadContract(contract)) as Erc721;
    // // sellerWallet = await contractService.inventory(sellerWallet);
    // await contractService.inventory(sellerWallet);
    // const tokenOwnership = await ownershipService.pick({ contract: contract._id, user: seller._id, num: { $gt: 0 } });
    // token = await tokenService.get(tokenOwnership.token as Id);
  }, 300000);
  afterAll(async () => await system.terminate());
  it("Create Listing", async () => {
    Utils.sleep(100);
  });

  // describe("Listing With Thing Currency", () => {
  //   let thingListing: db.Listing.Doc;
  //   let tokenListing: db.Listing.Doc;
  //   let productListing: db.Listing.Doc;
  //   let input: gql.ListingInput;
  //   let receipt: db.Receipt.Doc;
  //   let receiptInput: db.Receipt.Input;
  //   let currency: db.shared.Thing.Doc;
  //   let priceTag: gql.PriceTagInput;

  //   beforeAll(async () => {
  //     currency = await sample.shared.createThing(app, image._id);
  //     await ownershipService.setThings({type: "thing", user: seller._id, value: 10, thing: })
  //     await seller.merge({ items: [{ thing: thing._id, num: 10 }] }).save();
  //     await buyer.merge({ items: [{ thing: currency._id, num: 10000 }] }).save();
  //   });
  //   it("Create Thing Listing", async () => {
  //     input = sample.thingListingInput(seller._id, sellerWallet._id, thing._id, currency._id);
  //     thingListing = await listingService.create(input, { address: sellerWallet.address });
  //     expect(thingListing.status).toEqual("active");
  //     expect(thingListing.priceTags[0].price).toEqual(input.priceTags[0].price);
  //   });
  //   it("Cannot Create Duplicated Thing Listing", async () => {
  //     await expect(listingService.create(input, { address: sellerWallet.address })).rejects.toThrow();
  //   });
  //   it("Update Thing Listing", async () => {
  //     input = sample.thingListingInput(seller._id, sellerWallet._id, thing._id, currency._id);
  //     thingListing = await listingService.update(thingListing._id, input);
  //     expect(thingListing.priceTags[0].price).toEqual(input.priceTags[0].price);
  //   });
  //   it("Purchase Thing Listing with Thing", async () => {
  //     const num = 5;
  //     priceTag = thingListing.priceTags.find((tag) => tag.thing?.equals(currency._id)) as gql.PriceTag;
  //     const beforeBalance = buyer.items.find((item) => item.thing.equals(currency._id))?.num ?? 0;
  //     const beforeNum = buyer.items.find((item) => item.thing.equals(thing._id))?.num ?? 0;
  //     const beforeSellerBalance = seller.items.find((item) => item.thing.equals(currency._id))?.num ?? 0;
  //     const beforeSellerNum = seller.items.find((item) => item.thing.equals(thing._id))?.num ?? 0;
  //     receipt = await listingService.purchaseListing(
  //       thingListing._id,
  //       priceTag,
  //       num,
  //       null,
  //       buyerKeyring._id,
  //       buyerWallet.address
  //     );
  //     expect(receipt.status).toEqual("success");
  //     await seller.refresh();
  //     await buyer.refresh();
  //     const afterBalance = buyer.items.find((item) => item.thing.equals(currency._id))?.num ?? 0;
  //     const afterNum = buyer.items.find((item) => item.thing.equals(thing._id))?.num ?? 0;
  //     const afterSellerNum = seller.items.find((item) => item.thing.equals(thing._id))?.num ?? 0;
  //     const afterSellerBalance = seller.items.find((item) => item.thing.equals(currency._id))?.num ?? 0;
  //     expect(afterBalance).toEqual(beforeBalance - thingListing.priceTags[0].price * num);
  //     expect(beforeNum + num).toEqual(afterNum);
  //     expect(afterSellerBalance).toEqual(beforeSellerBalance + thingListing.priceTags[0].price * num);
  //     expect(beforeSellerNum - num).toEqual(afterSellerNum);
  //   });
  //   it("Cannot purchase Thing Listing with exceed amount", async () => {
  //     await expect(
  //       listingService.purchaseListing(thingListing._id, priceTag, 10, null, buyerKeyring._id, buyerWallet.address)
  //     ).rejects.toThrow();
  //   });
  //   it("Cannot purchase Thing Listing without thing balance", async () => {
  //     buyer.items[0].num = 0;
  //     await buyer.save();
  //     await expect(
  //       listingService.purchaseListing(thingListing._id, priceTag, 1, null, buyerKeyring._id, buyerWallet.address)
  //     ).rejects.toThrow();
  //     buyer.items[0].num = 10000;
  //     await buyer.save();
  //   });

  //   it("Remove Thing Listing", async () => {
  //     thingListing = await listingService.remove(thingListing._id);
  //     expect(thingListing.status).toEqual("inactive");
  //   });

  // it("Cannot Create Token Listing Without approval", async () => {
  //   input = sample.tokenListingInput(seller._id, sellerWallet._id, token._id, currency._id);
  //   await erc721.contract.setApprovalForAll(erc721.settings.market.address, false);
  //   await Utils.sleep(4000);
  //   await expect(listingService.create(input, { address: sellerWallet.address })).rejects.toThrow();
  // }, 10000);
  // it("Create Token Listing", async () => {
  //   await erc721.contract.setApprovalForAll(erc721.settings.market.address, true);
  //   await Utils.sleep(4000);
  //   tokenListing = await listingService.create(input, { address: sellerWallet.address });
  //   expect(tokenListing.status).toEqual("active");
  //   expect(tokenListing.priceTags[0].price).toEqual(input.priceTags[0].price);
  // }, 60000);
  // it("Cannot Create Duplicated Token Listing", async () => {
  //   await expect(listingService.create(input, { address: sellerWallet.address })).rejects.toThrow();
  // });
  // it("Update Token Listing", async () => {
  //   input = sample.tokenListingInput(seller._id, sellerWallet._id, token._id, currency._id);
  //   tokenListing = await listingService.update(tokenListing._id, input);
  //   expect(tokenListing.priceTags[0].price).toEqual(input.priceTags[0].price);
  // });
  // it("Purchase Token Listing with Thing", async () => {
  //   const num = 1;
  //   priceTag = tokenListing.priceTags.find((tag) => tag.thing?.equals(currency._id)) as gql.PriceTag;
  //   const beforeBalance = buyer.items.find((item) => item.thing.equals(currency._id))?.num ?? 0;
  //   const beforeNum = buyerWallet.items.find((item) => item.token.equals(token._id))?.num ?? 0;
  //   const beforeSellerBalance = seller.items.find((item) => item.thing.equals(currency._id))?.num ?? 0;
  //   const beforeSellerNum = sellerWallet.items.find((item) => item.token.equals(token._id))?.num ?? 0;
  //   // ! add operator needed in first
  //   receipt = await listingService.purchaseListing(
  //     tokenListing._id,
  //     priceTag,
  //     1,
  //     null,
  //     buyerKeyring._id,
  //     buyerWallet.address
  //   );
  //   await Utils.sleep(8000);
  //   // await listingService.processTokenListings();
  //   expect(receipt.status).toEqual("success");
  //   await sellerWallet.refresh();
  //   await buyerWallet.refresh();
  //   await buyer.refresh();
  //   await seller.refresh();
  //   const afterBalance = buyer.items.find((item) => item.thing.equals(currency._id))?.num ?? 0;
  //   const afterNum = buyerWallet.items.find((item) => item.token.equals(token._id))?.num ?? 0;
  //   const afterSellerBalance = seller.items.find((item) => item.thing.equals(currency._id))?.num ?? 0;
  //   const afterSellerNum = sellerWallet.items.find((item) => item.token.equals(token._id))?.num ?? 0;
  //   expect(afterSellerBalance).toEqual(beforeSellerBalance + tokenListing.priceTags[0].price * num);
  //   expect(beforeSellerNum - num).toEqual(afterSellerNum);
  //   expect(afterBalance).toEqual(beforeBalance - tokenListing.priceTags[0].price * num);
  //   expect(beforeNum + num).toEqual(afterNum);
  //   expect((await erc721.contract.ownerOf(token.tokenId as number)) === buyerWallet.address);
  // }, 300000);
  // it("Cannot purchase Token Listing with exceed amount", async () => {
  //   await expect(
  //     listingService.purchaseListing(tokenListing._id, priceTag, 1, null, buyerKeyring._id, buyerWallet.address)
  //   ).rejects.toThrow();
  // }, 15000);
  // it("Cannot purchase Token Listing without thing balance", async () => {
  //   buyer.items[0].num = 0;
  //   await buyer.save();
  //   await expect(
  //     listingService.purchaseListing(tokenListing._id, priceTag, 1, null, buyerKeyring._id, buyerWallet.address)
  //   ).rejects.toThrow();
  //   buyer.items[0].num = 10000;
  //   await buyer.save();
  // });
  // it("Close Token Listing", async () => {
  //   tokenListing = await listingService.closeListing(tokenListing._id);
  //   expect(tokenListing.status).toEqual("closed");
  // });
  // it("Remove Token Listing", async () => {
  //   tokenListing = await listingService.remove(tokenListing._id);
  //   expect(tokenListing.status).toEqual("inactive");
  //   await erc721.contract
  //     .connect(buyerSigner)
  //     .transferFrom(buyerWallet.address, sellerWallet.address, token.tokenId as number, { gasLimit: 100000 });
  // });
  // });
});
