import Chance from "chance";
import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";

const c = new Chance();
export const characterInput = (file: Id): cnst.CharacterInput => ({
  name: c.word(),
  file,
  tileSize: [20, 20],
  totalSize: [100, 100],
  description: c.sentence(),
  size: [10, 10],
  right: {
    idle: {
      row: 4,
      column: 2,
      duration: 300,
    },
    walk: {
      row: 4,
      column: 2,
      duration: 300,
    },
  }, //! need to change
});

export const createCharacter = async (app: TestingModule, fileId: Id) => {
  const characterEmployee = app.get<emp.CharacterEmployee>(emp.CharacterEmployee);
  const character = await characterEmployee.create(characterInput(fileId));
  return character;
};
