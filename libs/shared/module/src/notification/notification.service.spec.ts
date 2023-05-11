import { NotificationService } from "./notification.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Notification Service", () => {
  const system = new TestSystem();
  let notificationService: NotificationService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    notificationService = app.get<NotificationService>(NotificationService);
  });
  afterAll(async () => await system.terminate());
  let notification: db.Notification.Doc;

  let input: gql.NotificationInput;
  it("Create Notification", async () => {
    input = sample.notificationInput();
    notification = await notificationService.create(input);
    expect(notification.status).toEqual("active");
  });
  it("Update Notification", async () => {
    input = sample.notificationInput();
    notification = await notificationService.update(notification._id, input);
  });
  it("Remove Notification", async () => {
    notification = await notificationService.remove(notification._id);
    expect(notification.status).toEqual("inactive");
  });
});
