import { Dialog, DialogSummary } from "./dialog.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const dialogLocale = {
  ...baseLocale,
  title: ["Title", "제목"],
  characters: ["Characters", "캐릭터"],
  flows: ["Flows", "Flows"],
  totalDialog: ["Total Dialog", "총 다이얼로그"],
} as const;

export type DialogLocale = Locale<"dialog", Dialog & DialogSummary, typeof dialogLocale>;
