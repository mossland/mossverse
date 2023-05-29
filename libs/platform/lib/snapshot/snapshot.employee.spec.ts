import { SnapshotEmployee } from "./snapshot.employee";
import { TestSystem } from "@shared/test-server";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Snapshot Service", () => {
  const system = new TestSystem();
  let snapshotEmployee: SnapshotEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    snapshotEmployee = app.get<SnapshotEmployee>(SnapshotEmployee);
  });
  afterAll(async () => await system.terminate());
  let snapshot: db.Snapshot.Doc;

  let input: cnst.SnapshotInput;
  it("Create Snapshot", async () => {
    input = sample.snapshotInput();
    snapshot = await snapshotEmployee.create(input);
    expect(snapshot.status).toEqual("active");
  });
  it("Update Snapshot", async () => {
    input = sample.snapshotInput();
    snapshot = await snapshotEmployee.update(snapshot._id, input);
  });
  it("Remove Snapshot", async () => {
    snapshot = await snapshotEmployee.remove(snapshot._id);
    expect(snapshot.status).toEqual("inactive");
  });
});
