import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
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
  const mapService = app.get<srv.MapService>(srv.MapService);
  const map = await mapService.create(mapInput(fileId));
  return map;
};
