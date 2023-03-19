import { WebviewService } from "./webview.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Webview Service", () => {
  const system = new TestSystem();
  let webviewService: WebviewService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    webviewService = app.get<WebviewService>(WebviewService);
  });
  afterAll(async () => await system.terminate());
  let webview: db.Webview.Doc;

  let input: gql.WebviewInput;
  it("Create Webview", async () => {
    input = sample.webviewInput();
    webview = await webviewService.create(input);
    expect(webview.status).toEqual("active");
  });
  it("Update Webview", async () => {
    input = sample.webviewInput();
    webview = await webviewService.update(webview._id, input);
  });
  it("Remove Webview", async () => {
    webview = await webviewService.remove(webview._id);
    expect(webview.status).toEqual("inactive");
  });
});
