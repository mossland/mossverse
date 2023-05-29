import { LiveEmployee } from "./live.employee";
import { TestSystem } from "@shared/test-server";

import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Live Service", () => {
  const system = new TestSystem();
  let liveEmployee: LiveEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    liveEmployee = app.get<LiveEmployee>(LiveEmployee);
  });
  afterAll(async () => await system.terminate());
  let live: db.Live.Doc;

  let input: cnst.LiveInput;
  it("Create Live", async () => {
    input = sample.liveInput();
    live = await liveEmployee.create(input);
    expect(live.status).toEqual("active");
  });
  it("Update Live", async () => {
    input = sample.liveInput();
    live = await liveEmployee.update(live._id, input);
  });
  it("Remove Live", async () => {
    live = await liveEmployee.remove(live._id);
    expect(live.status).toEqual("inactive");
  });
});
