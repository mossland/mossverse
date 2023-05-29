import { TestSystem } from "@shared/test-server";
import { TokenEmployee } from "./token.employee";
import { environment } from "../env/environment";

import * as cnst from "../cnst";
import * as db from "../db";
import { registerModules } from "../server";
describe("Token Service", () => {
  const system = new TestSystem();
  let tokenEmployee: TokenEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    tokenEmployee = app.get<TokenEmployee>(TokenEmployee);
  });
  afterAll(async () => await system.terminate());
  let token: db.Token.Doc;
  let input: cnst.TokenInput;
  it("Generate ERC20 Token", async () => {
    //
  });
  it("Generate ERC721 Token", async () => {
    //
  });
  it("Generate ERC1155 Token", async () => {
    //
  });
  it("Send ERC20 token to wallet", async () => {
    //
  });
  it("Approve ERC20 token to wallet", async () => {
    //
  });
  it("Send ERC721 token to wallet", async () => {
    //
  });
  it("Approve ERC721 token to wallet", async () => {
    //
  });
  it("ApproveForAll ERC721 tokens to wallet", async () => {
    //
  });
  it("Send ERC1155 tokens to wallet", async () => {
    //
  });
  it("ApproveForAll ERC721 tokens to wallet", async () => {
    //
  });
  // it("Update Token", async () => {
  //   input = sample.tokenInput();
  //   token = await tokenEmployee.update(token._id, input);
  //   expect(token).toEqual(expect.objectContaining(input));
  // });
  // it("Remove Token", async () => {
  //   token = await tokenEmployee.remove(token._id);
  //   expect(token.status).toEqual("inactive");
  // });
});
