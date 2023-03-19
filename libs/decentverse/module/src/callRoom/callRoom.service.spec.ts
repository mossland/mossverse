import { CallRoomService } from "./callRoom.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("CallRoom Service", () => {
  const system = new TestSystem();
  let callRoomService: CallRoomService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    callRoomService = app.get<CallRoomService>(CallRoomService);
  });
  afterAll(async () => await system.terminate());
  let callRoom: db.CallRoom.Doc;

  let input: gql.CallRoomInput;
  it("Create CallRoom", async () => {
    input = sample.callRoomInput();
    callRoom = await callRoomService.create(input);
    expect(callRoom.status).toEqual("active");
  });
  it("Update CallRoom", async () => {
    input = sample.callRoomInput();
    callRoom = await callRoomService.update(callRoom._id, input);
  });
  it("Remove CallRoom", async () => {
    callRoom = await callRoomService.remove(callRoom._id);
    expect(callRoom.status).toEqual("inactive");
  });
});
