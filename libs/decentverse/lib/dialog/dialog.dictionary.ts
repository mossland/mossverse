import { Dialog, DialogSummary } from "./dialog.fetch";
import { Translate, baseTrans } from "@util/client";

export const dialogTrans = {
  ...baseTrans,
  title: ["Title", "제목"],
  characters: ["Characters", "캐릭터"],
  flows: ["Flows", "Flows"],
  totalDialog: ["Total Dialog", "총 다이얼로그"],
} satisfies Translate<Dialog & DialogSummary>;
