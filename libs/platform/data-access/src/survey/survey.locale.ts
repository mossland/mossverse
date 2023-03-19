import { Survey, SurveySummary } from "./survey.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const surveyLocale = {
  ...baseLocale,
  responses: ["Responses", "응답"],
  walletNum: ["Wallet Number", "지갑 번호"],
  tokenNum: ["Token Number", "토큰 번호"],
  selectTokenNum: ["Select Token Number", "토큰 번호 선택"],
  selectWalletNum: ["Select Wallet Number", "지갑 번호 선택"],
  snapshotAt: ["Snapshot At", "스냅샷 시간"],
  isActive: ["Is Active", "활성화 여부"],
  title: ["Title", "제목"],
  content: ["Content", "내용"],
  selections: ["Selections", "선택지"],
  contract: ["Contract", "컨트랙트"],
  creator: ["Creator", "생성자"],
  type: ["Type", "타입"],
  policy: ["Policy", "정책"],
  closeAt: ["Close At", "종료일"],
  openAt: ["Open At", "시작일"],
  totalSurvey: ["Total Survey", "총 설문"],
} as const;

export type SurveyLocale = Locale<"survey", Survey & SurveySummary, typeof surveyLocale>;
