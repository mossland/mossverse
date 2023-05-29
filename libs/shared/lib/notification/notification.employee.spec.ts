import { NotificationEmployee } from "./notification.employee";
import { TestSystem } from "@shared/test-server";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Notification Service", () => {
  const system = new TestSystem();
  let notificationEmployee: NotificationEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    notificationEmployee = app.get<NotificationEmployee>(NotificationEmployee);
  });
  afterAll(async () => await system.terminate());
  let notification: db.Notification.Doc;

  let input: cnst.NotificationInput;
  it("Create Notification", async () => {
    input = sample.notificationInput();
    notification = await notificationEmployee.create(input);
    expect(notification.status).toEqual("active");
  });
  it("Update Notification", async () => {
    input = sample.notificationInput();
    notification = await notificationEmployee.update(notification._id, input);
  });
  it("Remove Notification", async () => {
    notification = await notificationEmployee.remove(notification._id);
    expect(notification.status).toEqual("inactive");
  });
});
