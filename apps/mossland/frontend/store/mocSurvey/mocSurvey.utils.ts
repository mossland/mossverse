import { types } from "../index";

export const checkIsActiveSurvey = (survey: types.MocSurvey) =>
  survey.status === "opened" && new Date(survey.closeAt).getTime() > Date.now();

export const isVoted = (mocSurveys: types.MocSurvey[], mocSurveyId: string, userId?: string) => {
  if (!userId) return false;
  const mocSurvey = mocSurveys.find((mocSurvey) => mocSurvey.id === mocSurveyId);
  if (!mocSurvey) return false;
  const response = mocSurvey.responses.find((response) => response.user.id === userId);
  return response ? true : false;
};
