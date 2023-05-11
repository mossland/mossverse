import { SkinManagerService } from "./skinManager.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("SkinManager Service", () => {
  // const system = new TestSystem();
  // let skinManagerService: SkinManagerService;
  // beforeAll(async () => {
  //   const app = await system.init(registerModules(environment));
  //   skinManagerService = app.get<SkinManagerService>(SkinManagerService);
  // });
  // afterAll(async () => await system.terminate());
  // let skinManager: db.SkinManager.Doc;
  // let input: gql.SkinManagerInput;
  // it("Create SkinManager", async () => {
  //   input = sample.skinManagerInput();
  //   skinManager = await skinManagerService.create(input);
  //   expect(skinManager.status).toEqual("active");
  // });
  // it("Update SkinManager", async () => {
  //   input = sample.skinManagerInput();
  //   skinManager = await skinManagerService.update(skinManager._id, input);
  // });
  // it("Remove SkinManager", async () => {
  //   skinManager = await skinManagerService.remove(skinManager._id);
  //   expect(skinManager.status).toEqual("inactive");
  // });
});
