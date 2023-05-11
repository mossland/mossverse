import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";

const c = new Chance();
export const characterInput = (file: Id): gql.CharacterInput => ({
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
  const characterService = app.get<srv.CharacterService>(srv.CharacterService);
  const character = await characterService.create(characterInput(fileId));
  return character;
};
