import { StakePoolService } from "./stakePool.service";
import { TestSystem } from "@shared/test-server";
import { environment } from "../../environments/environment";
import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("StakePool Service", () => {
  const system = new TestSystem();
  let stakePoolService: StakePoolService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    stakePoolService = app.get<StakePoolService>(StakePoolService);
  });
  afterAll(async () => await system.terminate());
  let stakePool: db.StakePool.Doc;

  let input: gql.StakePoolInput;
  it("Create StakePool", async () => {
    input = sample.stakePoolInput();
    stakePool = await stakePoolService.create(input);
    expect(stakePool.status).toEqual("active");
  });
  it("Update StakePool", async () => {
    input = sample.stakePoolInput();
    stakePool = await stakePoolService.update(stakePool._id, input);
  });
  it("Remove StakePool", async () => {
    stakePool = await stakePoolService.remove(stakePool._id);
    expect(stakePool.status).toEqual("inactive");
  });
});
