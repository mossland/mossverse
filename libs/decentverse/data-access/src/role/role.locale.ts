import { Role, RoleSummary } from "./role.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const roleLocale = {
  ...baseLocale,
  name: ["Name", "이름"],
  areas: ["areas", "지역"],
  totalRole: ["Total Role", "총 역할수"],
} as const;

export type RoleLocale = Locale<"role", Role & RoleSummary, typeof roleLocale>;
