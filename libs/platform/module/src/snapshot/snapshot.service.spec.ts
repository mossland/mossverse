import { SnapshotService } from "./snapshot.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Snapshot Service", () => {
  const system = new TestSystem();
  let snapshotService: SnapshotService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    snapshotService = app.get<SnapshotService>(SnapshotService);
  });
  afterAll(async () => await system.terminate());
  let snapshot: db.Snapshot.Doc;

  let input: gql.SnapshotInput;
  it("Create Snapshot", async () => {
    input = sample.snapshotInput();
    snapshot = await snapshotService.create(input);
    expect(snapshot.status).toEqual("active");
  });
  it("Update Snapshot", async () => {
    input = sample.snapshotInput();
    snapshot = await snapshotService.update(snapshot._id, input);
  });
  it("Remove Snapshot", async () => {
    snapshot = await snapshotService.remove(snapshot._id);
    expect(snapshot.status).toEqual("inactive");
  });
});
