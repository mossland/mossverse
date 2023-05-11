import { Building, BuildingSummary } from "./building.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const buildingLocale = {
  ...baseLocale,
  field: ["Field", "필드"],
  totalBuilding: ["Total Building", "Building 총합"],
} as const;

export type BuildingLocale = Locale<"building", Building & BuildingSummary, typeof buildingLocale>;
