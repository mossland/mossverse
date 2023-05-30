import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const snapshotInput = (): cnst.SnapshotInput => ({
  targetType: "contract",
  target: new Id(),
  ownerships: [],
});

export const createSnapshot = async (app: TestingModule) => {
  const snapshotEmployee = app.get<emp.SnapshotEmployee>(emp.SnapshotEmployee);
  const snapshot = await snapshotEmployee.create(snapshotInput());
  return snapshot;
};
