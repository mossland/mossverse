import { cnst } from "@shared/util";
import { types } from "..";

export const checkIsActiveSurvey = (status: cnst.SurveyStatus, closeAt: Date) =>
  status === "opened" && new Date(closeAt).getTime() > Date.now();
