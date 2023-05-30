import { CallRoomEmployee } from "./callRoom.employee";
import { TestSystem } from "@shared/test-server";

import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("CallRoom Service", () => {
  const system = new TestSystem();
  let callRoomEmployee: CallRoomEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    callRoomEmployee = app.get<CallRoomEmployee>(CallRoomEmployee);
  });
  afterAll(async () => await system.terminate());
  let callRoom: db.CallRoom.Doc;

  let input: cnst.CallRoomInput;
  it("Create CallRoom", async () => {
    input = sample.callRoomInput();
    callRoom = await callRoomEmployee.create(input);
    expect(callRoom.status).toEqual("active");
  });
  it("Update CallRoom", async () => {
    input = sample.callRoomInput();
    callRoom = await callRoomEmployee.update(callRoom._id, input);
  });
  it("Remove CallRoom", async () => {
    callRoom = await callRoomEmployee.remove(callRoom._id);
    expect(callRoom.status).toEqual("inactive");
  });
});
