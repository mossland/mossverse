import React from "react";
import styled from "styled-components";
import { gql, store, utils } from "@platform/data-access";
import { SurveyIcon } from "@shared/ui-web";
import { Wrapper, Period, ActiveTag, Text } from "./";
import { cnst } from "@shared/util";
import { useSurvey } from "./services/useSurvey";

export const DetailHeader = () => {
  const surveyService = useSurvey();
  if (!surveyService.survey) return <></>;
  return (
    <StyledDetailHeader>
      <Wrapper className="title-container">
        <SurveyIcon />

        <Text className="title">{surveyService.survey.title}</Text>
      </Wrapper>
      <Wrapper className="sub-title-container">
        {utils.checkIsActiveSurvey(surveyService.survey.status, surveyService.survey.closeAt) && <ActiveTag />}
        <Period openAt={surveyService.survey.openAt} closeAt={surveyService.survey.closeAt} />
      </Wrapper>
    </StyledDetailHeader>
  );
};

type TitleProps = {
  text: string;
};

const Title = ({ text }: TitleProps) => {
  return <div className={"title"}>{text}</div>;
};

// type PeriodProps = {
//   openAt: Date;
//   closeAt: Date;
// };
// const Period = ({ openAt, closeAt }: PeriodProps) => {
//   return (
//     <div className={"period"}>
//       {Utils.toIsoString(openAt)} ~ {Utils.toIsoString(closeAt)}
//     </div>
//   );
// };

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
