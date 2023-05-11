import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  ObjectType,
  BaseGql,
  Int,
  Float,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";

@InputType("NotificationInput")
export class NotificationInput {
  @Field(() => String)
  field: string;
}

@ObjectType("Notification", { _id: "id" })
export class Notification extends BaseGql(NotificationInput) {
  @Field(() => String)
  status: cnst.NotificationStatus;
}

@ObjectType("LightNotification", { _id: "id", gqlRef: "Notification" })
export class LightNotification extends PickType(Notification, ["status"] as const) {}

@ObjectType("NotificationSummary")
export class NotificationSummary {
  @Field(() => Int)
  totalNotification: number;
}

export const notificationQueryMap: { [key in keyof NotificationSummary]: any } = {
  totalNotification: { status: { $ne: "inactive" } },
};

export const notificationGraphQL = createGraphQL(
  "notification" as const,
  Notification,
  NotificationInput,
  LightNotification
);
export const {
  getNotification,
  listNotification,
  notificationCount,
  notificationExists,
  createNotification,
  updateNotification,
  removeNotification,
  notificationFragment,
  lightNotificationFragment,
  purifyNotification,
  crystalizeNotification,
  lightCrystalizeNotification,
  defaultNotification,
  mergeNotification,
} = notificationGraphQL;
