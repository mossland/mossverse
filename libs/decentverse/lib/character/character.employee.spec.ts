import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { CharacterEmployee } from "./character.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";
import { registerModules } from "../server";
describe("Character Service", () => {
  const system = new TestSystem();
  let characterEmployee: CharacterEmployee;
  let file: db.shared.File.Doc;
  let keyring: db.shared.Keyring.Doc;
  let wallet: db.shared.Wallet.Doc;
  let user: db.User.Doc;
  let token: db.shared.Token.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    characterEmployee = app.get<CharacterEmployee>(CharacterEmployee);
    keyring = await sample.shared.createKeyring(app);
    user = await sample.createUser(app, keyring._id);
    file = await sample.shared.createFile(app);
  });
  afterAll(async () => await system.terminate());
  let character: db.Character.Doc;
  let input: cnst.CharacterInput;
  it("Create Character", async () => {
    input = sample.characterInput(file._id);
    character = await characterEmployee.create(input);
    expect(character.status).toEqual("active");
    expect(character.name).toEqual(input.name);
  });
  it("Update Character", async () => {
    input = sample.characterInput(file._id);
    character = await characterEmployee.update(character._id, input);
    expect(character.name).toEqual(input.name);
  });
  it("Query Character With Inventory", async () => {
    await characterEmployee.myCharacters(keyring._id);
  });
  it("Remove Character", async () => {
    character = await characterEmployee.remove(character._id);
    expect(character.status).toEqual("inactive");
  });
});
