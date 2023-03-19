import React from "react";
import { Utils } from "@shared/util";
import { SurveyIcon } from "@shared/ui-web";
import { st, gql } from "../../stores";
import { MocSurveyItem } from "./MocSurveyItem";
import { ActiveTag } from "./";

type SurveyItemProps = {
  survey: gql.LightMocSurvey;
};

export const Item = ({ survey }: SurveyItemProps) => {
  const self = st.use.self();
  const mocSurvey = st.use.mocSurvey();

  return (
    <>
      <MocSurveyItem
        active={survey.status === "opened" && !survey.isVoted(self) && survey.isExpired()}
        selected={mocSurvey !== "loading" && mocSurvey.id === survey.id}
        onClick={() => st.do.viewMocSurvey(survey as gql.MocSurvey)}
      >
        <MocSurveyItem.TitleWrapper>
          <SurveyIcon />
          <MocSurveyItem.Title
            active={survey.status === "opened" && !survey.isVoted(self) && survey.isExpired()}
            selected={mocSurvey !== "loading" && mocSurvey.id === survey.id}
          >
            {survey.title}
          </MocSurveyItem.Title>
        </MocSurveyItem.TitleWrapper>
        <MocSurveyItem.SubTitleWrapper>
          {survey.status === "opened" && survey.isExpired() && <ActiveTag />}
          <MocSurveyItem.Period>
            {survey.openAt.format("YYYY-MM-DD")} ~ {survey.closeAt.format("YYYY-MM-DD")}
          </MocSurveyItem.Period>
        </MocSurveyItem.SubTitleWrapper>
      </MocSurveyItem>
    </>
  );
};
