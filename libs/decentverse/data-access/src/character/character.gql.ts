import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import { Field, InputType, mutate, query, ObjectType, BaseGql, Int, createGraphQL } from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Sprite } from "../_scalar/scalar.gql";

@InputType("CharacterInput")
export class CharacterInput {
  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | null;

  @Field(() => shared.Thing, { nullable: true })
  thing: shared.Thing | null;

  @Field(() => shared.File, { nullable: true })
  file: shared.File;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => [Int])
  tileSize: [number, number];

  @Field(() => [Int])
  totalSize: [number, number];

  @Field(() => [Int])
  size: [number, number];

  @Field(() => Sprite)
  right: Sprite;

  @Field(() => Sprite, { nullable: true })
  left: Sprite | null;

  @Field(() => Sprite, { nullable: true })
  up: Sprite | null;

  @Field(() => Sprite, { nullable: true })
  down: Sprite | null;
}

@ObjectType("Character", { _id: "id" })
export class Character extends BaseGql(CharacterInput) {
  @Field(() => String)
  status: cnst.CharacterStatus;
}
export const characterGraphQL = createGraphQL<"character", Character, CharacterInput>(Character, CharacterInput);
export const {
  getCharacter,
  listCharacter,
  characterCount,
  characterExists,
  createCharacter,
  updateCharacter,
  removeCharacter,
  characterFragment,
  purifyCharacter,
  // defaultCharacter,
} = characterGraphQL;

// * Add CharacterFiles Mutation
export type AddCharacterFilesMutation = { addCharacterFiles: shared.File[] };
export const addCharacterFilesMutation = graphql`
  ${shared.fileFragment}
  mutation addCharacterFiles($files: [Upload!]!, $characterId: String) {
    addCharacterFiles(files: $files, characterId: $characterId) {
      ...fileFragment
    }
  }
`;
export const addCharacterFiles = async (files: FileList, characterId?: string | null) =>
  (await mutate<AddCharacterFilesMutation>(addCharacterFilesMutation, { files, characterId })).addCharacterFiles;
