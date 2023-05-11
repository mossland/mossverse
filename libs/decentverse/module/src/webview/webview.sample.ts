import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const webviewInput = (): gql.WebviewInput => ({} as any);

export const createWebview = async (app: TestingModule) => {
  const webviewService = app.get<srv.WebviewService>(srv.WebviewService);
  const webview = await webviewService.create(webviewInput());
  return webview;
};
