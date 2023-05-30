import { TestSystem } from "@shared/test-server";
import { WebviewEmployee } from "./webview.employee";

import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Webview Service", () => {
  const system = new TestSystem();
  let webviewEmployee: WebviewEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    webviewEmployee = app.get<WebviewEmployee>(WebviewEmployee);
  });
  afterAll(async () => await system.terminate());
  let webview: db.Webview.Doc;

  let input: cnst.WebviewInput;
  it("Create Webview", async () => {
    input = sample.webviewInput();
    webview = await webviewEmployee.create(input);
    expect(webview.status).toEqual("active");
  });
  it("Update Webview", async () => {
    input = sample.webviewInput();
    webview = await webviewEmployee.update(webview._id, input);
  });
  it("Remove Webview", async () => {
    webview = await webviewEmployee.remove(webview._id);
    expect(webview.status).toEqual("inactive");
  });
});
