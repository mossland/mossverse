import { Nullable } from "@shared/util-client";
import gql from "graphql-tag";
import * as types from "../types";
export type CharacterInput = {
  token: types.ID | null;
  thing: types.ID | null;
  file: types.ID;
  name: string | null;
  tileSize: [number, number];
  totalSize: [number, number];
  size: [number, number];
  right: types.Sprite;
  left: types.Sprite | null;
  up: types.Sprite | null;
  down: types.Sprite | null;
};

export type Character = {
  id: string;
  token: types.shared.Token | null;
  thing: types.shared.Thing | null;
  file: types.shared.File;
  name: string | null;
  tileSize: [number, number];
  totalSize: [number, number];
  size: [number, number];
  right: types.Sprite;
  left: types.Sprite | null;
  up: types.Sprite | null;
  down: types.Sprite | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
export const defaultCharacter: types.Character = {
  id: "",
  token: null,
  thing: null,
  name: null,
  file: {
    id: "",
    url: "https://asset.ayias.io/decentverse/character/00/dcnt-1660132657788-char2.png",
    imageSize: [0, 0],
    // url: "https://asset.ayias.io/decentverse/character/chinchin.png",
  },
  tileSize: [240, 330],
  totalSize: [388, 581],
  size: [120 / 5, 165 / 5],
  right: {
    idle: {
      row: 4,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 5,
      column: 4,
      duration: 500,
    },
  },
  left: {
    idle: {
      row: 6,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 7,
      column: 4,
      duration: 500,
    },
  },
  up: {
    idle: {
      row: 2,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 3,
      column: 4,
      duration: 500,
    },
  },
  down: {
    idle: {
      row: 0,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 1,
      column: 4,
      duration: 500,
    },
  },
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const purifyCharacter = (character: Character): CharacterInput => ({
  token: character.token?.id ?? null,
  thing: character.thing?.id ?? null,
  file: character.file.id,
  name: character.name,
  tileSize: character.tileSize,
  totalSize: character.totalSize,
  size: character.size,
  right: character.right && types.purifySprite(character.right),
  left: character.left && types.purifySprite(character.left),
  up: character.up && types.purifySprite(character.up),
  down: character.down && types.purifySprite(character.down),
});

export const characterFragment = gql`
  ${types.shared.tokenFragment}
  ${types.shared.thingFragment}
  ${types.shared.fileFragment}
  ${types.spriteFragment}
  fragment characterFragment on Character {
    id
    token {
      ...tokenFragment
    }
    thing {
      ...thingFragment
    }
    file {
      ...fileFragment
    }
    name
    tileSize
    totalSize
    size
    right {
      ...spriteFragment
    }
    left {
      ...spriteFragment
    }
    up {
      ...spriteFragment
    }
    down {
      ...spriteFragment
    }
    status
    createdAt
    updatedAt
  }
`;
