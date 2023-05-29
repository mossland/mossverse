import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const callRoomInput = (): cnst.CallRoomInput => ({} as any);

export const createCallRoom = async (app: TestingModule) => {
  const callRoomEmployee = app.get<emp.CallRoomEmployee>(emp.CallRoomEmployee);
  const callRoom = await callRoomEmployee.create(callRoomInput());
  return callRoom;
};
