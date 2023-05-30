import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const notificationInput = (): cnst.NotificationInput => ({} as any);

export const createNotification = async (app: TestingModule) => {
  const notificationEmployee = app.get<emp.NotificationEmployee>(emp.NotificationEmployee);
  const notification = await notificationEmployee.create(notificationInput());
  return notification;
};
