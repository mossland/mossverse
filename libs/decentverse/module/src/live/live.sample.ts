import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const liveInput = (): gql.LiveInput => ({} as any);

export const createLive = async (app: TestingModule) => {
  const liveService = app.get<srv.LiveService>(srv.LiveService);
  const live = await liveService.create(liveInput());
  return live;
};
