import { LiveService } from "./live.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Live Service", () => {
  const system = new TestSystem();
  let liveService: LiveService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    liveService = app.get<LiveService>(LiveService);
  });
  afterAll(async () => await system.terminate());
  let live: db.Live.Doc;

  let input: gql.LiveInput;
  it("Create Live", async () => {
    input = sample.liveInput();
    live = await liveService.create(input);
    expect(live.status).toEqual("active");
  });
  it("Update Live", async () => {
    input = sample.liveInput();
    live = await liveService.update(live._id, input);
  });
  it("Remove Live", async () => {
    live = await liveService.remove(live._id);
    expect(live.status).toEqual("inactive");
  });
});
