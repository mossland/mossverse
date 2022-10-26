import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const emojiInput = (file: Id, token?: Id): gql.EmojiInput => ({
  name: c.name(),
  file,
  token,
});
export const createEmoji = async (app: TestingModule, fileId: Id, tokenId?: Id) => {
  const emojiService = app.get<srv.EmojiService>(srv.EmojiService);
  const emoji = await emojiService.create(emojiInput(fileId, tokenId));
  return emoji;
};
