import { cnst } from "@shared/util";

export const checkIsActiveSurvey = (status: cnst.SurveyStatus, closeAt: Date) =>
  status === "opened" && new Date(closeAt).getTime() > Date.now();
