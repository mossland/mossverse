import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const snapshotInput = (): gql.SnapshotInput => ({
  targetType: "contract",
  target: new Id(),
  ownerships: [],
});

export const createSnapshot = async (app: TestingModule) => {
  const snapshotService = app.get<srv.SnapshotService>(srv.SnapshotService);
  const snapshot = await snapshotService.create(snapshotInput());
  return snapshot;
};
