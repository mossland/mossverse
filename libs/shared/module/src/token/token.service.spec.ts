import { TokenService } from "./token.service";
import { TestSystem } from "@shared/test-server";
import { TokenModule } from "./token.module";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../modules";
describe("Token Service", () => {
  const system = new TestSystem();
  let tokenService: TokenService;
  beforeAll(async () => {
    const app = await system.init(registerModules);
    tokenService = app.get<TokenService>(TokenService);
  });
  afterAll(async () => await system.terminate());
  let token: db.Token.Doc;
  let input: gql.TokenInput;
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
  //   token = await tokenService.update(token._id, input);
  //   expect(token).toEqual(expect.objectContaining(input));
  // });
  // it("Remove Token", async () => {
  //   token = await tokenService.remove(token._id);
  //   expect(token.status).toEqual("inactive");
  // });
});
