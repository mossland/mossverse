import { Admin, AdminSummary } from "./admin.fetch";
import { Translate, baseTrans } from "@util/client";

export const adminTrans = {
  ...baseTrans,
  accountId: ["AccountId", "어카운트아이디"],
  password: ["Password", "패스워드"],
  roles: ["Roles", "역할"],
  totalAdmin: ["Total Admin", "총 어드민수"],
} satisfies Translate<Admin & AdminSummary>;
