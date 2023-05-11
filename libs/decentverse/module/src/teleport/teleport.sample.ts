import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const teleportInput = (): gql.TeleportInput => ({
} as any);

export const createTeleport = async (app: TestingModule) => {
  const teleportService = app.get<srv.TeleportService>(srv.TeleportService);
  const teleport = await teleportService.create(teleportInput());
  return teleport;
};
