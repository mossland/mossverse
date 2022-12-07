import { environment } from "../_environments/environment";
import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
import { DialogService } from "./dialog.service";
import { TestSystem } from "@shared/test-server";
import { DialogModule } from "./dialog.module";

describe("Dialog Service", () => {
  const system = new TestSystem();
  let dialogService: DialogService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    dialogService = app.get<DialogService>(DialogService);
  });
  afterAll(async () => await system.terminate());
  let dialog: db.Dialog.Doc;
  let input: gql.DialogInput;
  it("Create Dialog", async () => {
    input = sample.dialogInput([]);
    dialog = await dialogService.create(input);
    expect(dialog.status).toEqual("active");
    expect(dialog).toEqual(expect.objectContaining(input));
  });
  it("Update Dialog", async () => {
    input = sample.dialogInput([]);
    dialog = await dialogService.update(dialog._id, input);
    expect(dialog).toEqual(expect.objectContaining(input));
  });
  // it("Fabricate Dialogs", async () => {});
  it("Remove Dialog", async () => {
    dialog = await dialogService.remove(dialog._id);
    expect(dialog.status).toEqual("inactive");
  });
});
