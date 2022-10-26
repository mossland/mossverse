// import { db, srv, gql, modules } from "@platform/module";
import * as sample from "../sample";
import { TestingModule } from "@nestjs/testing";
import { Utils } from "@shared/util";
// import { MocWalletService } from "./mocWallet.service";
import { Erc1155, Erc20, Erc721 } from "@shared/util-server";
import { TestSystem } from "@shared/test-server";
import { registerModules } from "./../modules";

describe("Listing Service", () => {
  const system = new TestSystem();
  beforeAll(async () => {
    //
  }, 30000);
  afterAll(async () => await system.terminate());

  describe("MocWallet Test", () => {
    beforeAll(async () => {
      // wip
    });
  });
});
