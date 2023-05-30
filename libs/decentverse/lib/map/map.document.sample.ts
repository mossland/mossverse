import Chance from "chance";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
const c = new Chance();
export const mapInput = (file: Id): any => {
  return {
    name: c.word(),
    startPosition: [0, 0],
    // tileSize: 250,
    // top: file,
    // bottom: file,
    // lighting: file,
    // billboards: [],
    // placements: [],
    // collisions: [],
    // webviews: [],
    // lives: [],
    // callRooms: [],
    // dialogues: [],
    config: {
      dayNight: true,
    },
  };
};
export const createMap = async (app: TestingModule, fileId: Id) => {
  const mapEmployee = app.get<emp.MapEmployee>(emp.MapEmployee);
  const map = await mapEmployee.create(mapInput(fileId));
  return map;
};
