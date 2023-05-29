import { Thing, ThingSummary } from "./thing.fetch";
import { Translate, baseTrans } from "@util/client";

export const thingTrans = {
  ...baseTrans,
  root: ["Root", "루트"],
  rootType: ["RootType", "루트 타입"],
  name: ["Name", "이름"],
  description: ["Description", "설명"],
  image: ["Image", "이미지"],
  purpose: ["Purpose", "목적"],
  totalThing: ["Total Thing", "총 Thing수"],
} satisfies Translate<Thing & ThingSummary>;
