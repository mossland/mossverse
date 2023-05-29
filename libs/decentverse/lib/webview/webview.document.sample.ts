import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const webviewInput = (): cnst.WebviewInput => ({} as any);

export const createWebview = async (app: TestingModule) => {
  const webviewEmployee = app.get<emp.WebviewEmployee>(emp.WebviewEmployee);
  const webview = await webviewEmployee.create(webviewInput());
  return webview;
};
