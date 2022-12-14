import React from "react";
import styled from "styled-components";
import { gql, store, utils } from "@platform/data-access";
import { SurveyIcon } from "@shared/ui-web";
import { Survey } from "@platform/ui-web";
import { cnst } from "@shared/util";
import { useMocSurvey } from "./services/useMocSurvey";

export const DetailHeader = () => {
  const mocSurveyService = useMocSurvey();
  if (!mocSurveyService.mocSurvey) return <></>;
  return (
    <StyledDetailHeader>
      <Survey.Wrapper className="title-container">
        <SurveyIcon />

        <Survey.Text className="title">{mocSurveyService.mocSurvey.title}</Survey.Text>
      </Survey.Wrapper>
      <Survey.Wrapper className="sub-title-container">
        {utils.checkIsActiveSurvey(mocSurveyService.mocSurvey.status, mocSurveyService.mocSurvey.closeAt) && (
          <Survey.ActiveTag />
        )}
        <Survey.Period openAt={mocSurveyService.mocSurvey.openAt} closeAt={mocSurveyService.mocSurvey.closeAt} />
      </Survey.Wrapper>
    </StyledDetailHeader>
  );
};

const StyledDetailHeader = styled.div`
  padding: 18px 22px;
  .title-container {
    display: flex;
    svg {
      margin-top: 5px;
    }

    .title {
      font-family: Ubuntu Mono;
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
      margin-left: 8px;
      margin-bottom: 30px;
    }
  }
  .period {
    font-family: Ubuntu Mono;
    text-align: end;
    font-style: normal;
    justify-content: flex-end;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
  }
  .sub-title-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;
