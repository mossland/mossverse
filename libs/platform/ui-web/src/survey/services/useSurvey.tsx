import { gql, utils, store } from "@platform/data-access";

export const useSurvey = () => {
  const self = store.user.use.self();
  const survey = store.survey.use.survey();

  return {
    self,
    survey,
  };
};
