import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../modules";
import { EmojiService } from "./emoji.service";
import { TestSystem } from "@shared/test-server";
import { EmojiModule } from "./emoji.module";
describe("Emoji Service", () => {
  const system = new TestSystem();
  let emojiService: EmojiService;
  let file: db.shared.File.Doc;
  let keyring: db.shared.Keyring.Doc;
  let user: db.User.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules);
    emojiService = app.get<EmojiService>(EmojiService);
    file = await sample.shared.createFile(app);
    keyring = await sample.shared.createKeyring(app);
    user = await sample.createUser(app, keyring._id);
  });
  afterAll(async () => await system.terminate());
  let emoji: db.Emoji.Doc;
  let input: gql.EmojiInput;
  it("Create Emoji", async () => {
    input = sample.emojiInput(file._id);
    emoji = await emojiService.create(input);
    expect(emoji.status).toEqual("active");
    expect(emoji.file.equals(input.file)).toBeTruthy();
  });
  it("Update Emoji", async () => {
    input = sample.emojiInput(file._id);
    emoji = await emojiService.update(emoji._id, input);
    expect(emoji.file.equals(input.file)).toBeTruthy();
  });
  it("Apply Emoji to Hotkey", async () => {
    user.merge({ hotkeys: [{ emoji: emoji._id, key: "1" }] }).save();
    expect(user.hotkeys.length).toEqual(1);
  });
  it("Remove Emoji", async () => {
    emoji = await emojiService.remove(emoji._id);
    expect(emoji.status).toEqual("inactive");
  });
});
