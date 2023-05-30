import { Role, RoleSummary } from "./role.fetch";
import { Translate, baseTrans } from "@util/client";

export const roleTrans = {
  ...baseTrans,
  name: ["Name", "이름"],
  areas: ["areas", "지역"],
  totalRole: ["Total Role", "총 역할수"],
} satisfies Translate<Role & RoleSummary>;
