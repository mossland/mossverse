import { Admin, AdminSummary } from "./admin.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const adminLocale = {
  ...baseLocale,
  accountId: ["AccountId", "어카운트아이디"],
  password: ["Password", "패스워드"],
  roles: ["Roles", "역할"],
  totalAdmin: ["Total Admin", "총 어드민수"],
} as const;

export type AdminLocale = Locale<"admin", Admin & AdminSummary, typeof adminLocale>;
