import { Building, BuildingSummary } from "./building.fetch";
import { Translate, baseTrans } from "@util/client";

export const buildingTrans = {
  ...baseTrans,
  field: ["Field", "필드"],
  totalBuilding: ["Total Building", "Building 총합"],
} satisfies Translate<Building & BuildingSummary>;
