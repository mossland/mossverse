import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { DialogEmployee } from "./dialog.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";
import { registerModules } from "../server";

describe("Dialog Service", () => {
  const system = new TestSystem();
  let dialogEmployee: DialogEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    dialogEmployee = app.get<DialogEmployee>(DialogEmployee);
  });
  afterAll(async () => await system.terminate());
  let dialog: db.Dialog.Doc;
  let input: cnst.DialogInput;
  it("Create Dialog", async () => {
    input = sample.dialogInput([]);
    dialog = await dialogEmployee.create(input);
    expect(dialog.status).toEqual("active");
    expect(dialog).toEqual(expect.objectContaining(input));
  });
  it("Update Dialog", async () => {
    input = sample.dialogInput([]);
    dialog = await dialogEmployee.update(dialog._id, input);
    expect(dialog).toEqual(expect.objectContaining(input));
  });
  // it("Fabricate Dialogs", async () => {});
  it("Remove Dialog", async () => {
    dialog = await dialogEmployee.remove(dialog._id);
    expect(dialog.status).toEqual("inactive");
  });
});
