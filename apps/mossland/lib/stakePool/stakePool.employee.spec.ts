import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { StakePoolEmployee } from "./stakePool.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../../environments/environment";
import { registerModules } from "../server";
describe("StakePool Service", () => {
  const system = new TestSystem();
  let stakePoolEmployee: StakePoolEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    stakePoolEmployee = app.get<StakePoolEmployee>(StakePoolEmployee);
  });
  afterAll(async () => await system.terminate());
  let stakePool: db.StakePool.Doc;

  let input: cnst.StakePoolInput;
  it("Create StakePool", async () => {
    input = sample.stakePoolInput();
    stakePool = await stakePoolEmployee.create(input);
    expect(stakePool.status).toEqual("active");
  });
  it("Update StakePool", async () => {
    input = sample.stakePoolInput();
    stakePool = await stakePoolEmployee.update(stakePool._id, input);
  });
  it("Remove StakePool", async () => {
    stakePool = await stakePoolEmployee.remove(stakePool._id);
    expect(stakePool.status).toEqual("inactive");
  });
});
