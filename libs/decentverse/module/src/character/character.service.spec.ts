import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
import { CharacterService } from "./character.service";
import { TestSystem } from "@shared/test-server";
import { CharacterModule } from "./character.module";
describe("Character Service", () => {
  const system = new TestSystem();
  let characterService: CharacterService;
  let file: db.shared.File.Doc;
  let keyring: db.shared.Keyring.Doc;
  let wallet: db.shared.Wallet.Doc;
  let user: db.User.Doc;
  let token: db.shared.Token.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules);
    characterService = app.get<CharacterService>(CharacterService);
    keyring = await sample.shared.createKeyring(app);
    user = await sample.createUser(app, keyring._id);
    file = await sample.shared.createFile(app);
  });
  afterAll(async () => await system.terminate());
  let character: db.Character.Doc;
  let input: gql.CharacterInput;
  it("Create Character", async () => {
    input = sample.characterInput(file._id);
    character = await characterService.create(input);
    expect(character.status).toEqual("active");
    expect(character.name).toEqual(input.name);
  });
  it("Update Character", async () => {
    input = sample.characterInput(file._id);
    character = await characterService.update(character._id, input);
    expect(character.name).toEqual(input.name);
  });
  it("Query Character With Inventory", async () => {
    await characterService.myCharacters(keyring._id);
  });
  it("Remove Character", async () => {
    character = await characterService.remove(character._id);
    expect(character.status).toEqual("inactive");
  });
});
