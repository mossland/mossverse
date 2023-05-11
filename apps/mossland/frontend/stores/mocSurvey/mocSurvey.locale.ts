import { MocSurvey, MocSurveySummary } from "./mocSurvey.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const mocSurveyLocale = {
  ...baseLocale,
  title: ["Title", "제목"],
  description: ["Description", "설명"],
  selections: ["Selections", "선택지"],
  creator: ["Creator", "작성자"],
  type: ["Type", "타입"],
  policy: ["Policy", "정책"],
  closeAt: ["Close At", "종료일"],
  openAt: ["Open At", "시작일"],
  responses: ["Responses", "응답"],
  thing: ["Thing", "물건"],
  mocNum: ["Moc Num", "Moc수"],
  userNum: ["User Num", "사용자수"],
  selectMocNum: ["Select Moc Num", "선택 Moc수"],
  selectUserNum: ["Select User Num", "선택 사용자수"],
  snapshotAt: ["Snapshot At", "스냅샷일"],
  isVoted: ["Is Voted", "투표여부"],
  isExpired: ["Is Expired", "만료여부"],
  totalMocSurvey: ["Total MocSurvey", "총 MocSurvey"],
} as const;

export type MocSurveyLocale = Locale<"mocSurvey", MocSurvey & MocSurveySummary, typeof mocSurveyLocale>;
