import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const callRoomInput = (): gql.CallRoomInput => ({} as any);

export const createCallRoom = async (app: TestingModule) => {
  const callRoomService = app.get<srv.CallRoomService>(srv.CallRoomService);
  const callRoom = await callRoomService.create(callRoomInput());
  return callRoom;
};
