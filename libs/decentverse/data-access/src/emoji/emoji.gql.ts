import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";

@InputType("EmojiInput")
export class EmojiInput {
  @Field(() => String)
  name: string;

  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | null;

  @Field(() => shared.File)
  file: shared.File;
}

@ObjectType("Emoji", { _id: "id" })
export class Emoji extends BaseGql(EmojiInput) {
  @Field(() => String)
  status: cnst.EmojiStatus;
}

@ObjectType("LightEmoji", { _id: "id", gqlRef: "Emoji" })
export class LightEmoji extends PickType(Emoji, ["status"] as const) {}

export const emojiGraphQL = createGraphQL("emoji" as const, Emoji, EmojiInput, LightEmoji);
export const {
  getEmoji,
  listEmoji,
  emojiCount,
  emojiExists,
  createEmoji,
  updateEmoji,
  removeEmoji,
  emojiFragment,
  purifyEmoji,
  defaultEmoji,
} = emojiGraphQL;
export type EmojiSlice = SliceModel<"emoji", Emoji, LightEmoji>;

// * Add EmojiFiles Mutation
export type AddEmojiFilesMutation = { addEmojiFiles: shared.File[] };
export const addEmojiFilesMutation = graphql`
  ${shared.fileFragment}
  mutation addEmojiFiles($files: [Upload!]!, $emojiId: String) {
    addEmojiFiles(files: $files, emojiId: $emojiId) {
      ...fileFragment
    }
  }
`;
export const addEmojiFiles = async (files: FileList, emojiId?: string | null) =>
  (await mutate<AddEmojiFilesMutation>(addEmojiFilesMutation, { files, emojiId })).addEmojiFiles;
