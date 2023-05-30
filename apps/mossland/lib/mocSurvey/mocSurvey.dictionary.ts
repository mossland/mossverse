import { MocSurvey, MocSurveySummary } from "./mocSurvey.fetch";
import { Translate, baseTrans } from "@util/client";

export const mocSurveyTrans = {
  ...baseTrans,
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
  status: ["Status", "상태"],
  isVoted: ["Is Voted", "투표여부"],
  isExpired: ["Is Expired", "만료여부"],
  totalMocSurvey: ["Total MocSurvey", "총 MocSurvey"],
  appliedMocSurvey: ["Applied MocSurvey", "요청 중인 MocSurvey"],
  surveyingMocSurvey: ["Surveying MocSurvey", "진행 중인 MocSurvey"],
  closedMocSurvey: ["Closed MocSurvey", "종료된 MocSurvey"],
} satisfies Translate<MocSurvey & MocSurveySummary>;
