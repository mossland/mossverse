// import { db, srv, fetch, modules } from "@platform/server";
// import { MocWalletEmployee } from "./mocWallet.employee";
import { TestSystem } from "@shared/test-server";

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
