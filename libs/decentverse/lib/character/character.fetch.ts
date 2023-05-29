import {
  BaseGql,
  Field,
  InputOf,
  InputType,
  Int,
  ObjectType,
  PickType,
  cnst,
  createGraphQL,
  graphql,
  mutate,
} from "@util/client";
import { Sprite } from "../_decentverse/decentverse.fetch";
import { fetch as shared } from "@shared/client";

@InputType("CharacterInput")
export class CharacterInput {
  @Field(() => shared.File, { nullable: true })
  file: shared.File;

  @Field(() => shared.User, { nullable: true })
  creator?: shared.User | null;

  @Field(() => shared.Thing, { nullable: true })
  thing?: shared.Thing | null;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

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

@ObjectType("LightCharacter", { _id: "id", gqlRef: "Character" })
export class LightCharacter extends PickType(Character, [
  "status",
  "name",
  "description",
  "file",
  "size",
  "left",
  "up",
  "down",
  "right",
  "tileSize",
  "totalSize",
] as const) {}

@ObjectType("CharacterSummary")
export class CharacterSummary {
  @Field(() => Int)
  totalCharacter: number;
}

export const characterQueryMap = {
  totalCharacter: { status: { $ne: "inactive" } },
};

export const characterGraphQL = createGraphQL("character" as const, Character, CharacterInput, LightCharacter);
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
  crystalizeCharacter,
  lightCrystalizeCharacter,
  defaultCharacter,
  addCharacterFiles,
  mergeCharacter,
  initCharacter,
  viewCharacter,
  editCharacter,
} = characterGraphQL;

export type ApplyCharacterMutation = { applyCharacter: Character };
export const applyCharacterMutation = graphql`
  ${characterFragment}
  mutation applyCharacter($data: CharacterInput!) {
    applyCharacter(data: $data) {
      ...characterFragment
    }
  }
`;

export const applyCharacter = async (data: InputOf<CharacterInput>) =>
  (await mutate<ApplyCharacterMutation>(applyCharacterMutation, { data })).applyCharacter;

export type ReapplyCharacterMutation = { reapplyCharacter: Character };
export const reapplyCharacterMutation = graphql`
  ${characterFragment}
  mutation reapplyCharacter($characterId: ID!, $data: CharacterInput!) {
    reapplyCharacter(characterId: $characterId, data: $data) {
      ...characterFragment
    }
  }
`;

export const reapplyCharacter = async (characterId: string, data: InputOf<CharacterInput>) =>
  (
    await mutate<ReapplyCharacterMutation>(reapplyCharacterMutation, {
      characterId,
      data,
    })
  ).reapplyCharacter;

export type RejectCharacterMutation = { rejectCharacter: Character };
export const rejectCharacterMutation = graphql`
  ${characterFragment}
  mutation rejectCharacter($characterId: ID!) {
    rejectCharacter(characterId: $characterId) {
      ...characterFragment
    }
  }
`;

export const rejectCharacter = async (characterId: string) =>
  (
    await mutate<RejectCharacterMutation>(rejectCharacterMutation, {
      characterId,
    })
  ).rejectCharacter;

export type ApproveCharacterMutation = { approveCharacter: Character };
export const approveCharacterMutation = graphql`
  ${characterFragment}
  mutation approveCharacter($characterId: ID!) {
    approveCharacter(characterId: $characterId) {
      ...characterFragment
    }
  }
`;

export const approveCharacter = async (characterId: string) =>
  (
    await mutate<ApproveCharacterMutation>(approveCharacterMutation, {
      characterId,
    })
  ).approveCharacter;
