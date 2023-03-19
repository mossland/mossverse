import { Thing, ThingSummary } from "./thing.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const thingLocale = {
  ...baseLocale,
  root: ["Root", "루트"],
  rootType: ["RootType", "루트 타입"],
  name: ["Name", "이름"],
  description: ["Description", "설명"],
  image: ["Image", "이미지"],
  purpose: ["Purpose", "목적"],
  totalThing: ["Total Thing", "총 Thing수"],
} as const;

export type ThingLocale = Locale<"thing", Thing & ThingSummary, typeof thingLocale>;
