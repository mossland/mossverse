import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const notificationInput = (): gql.NotificationInput => ({} as any);

export const createNotification = async (app: TestingModule) => {
  const notificationService = app.get<srv.NotificationService>(srv.NotificationService);
  const notification = await notificationService.create(notificationInput());
  return notification;
};
