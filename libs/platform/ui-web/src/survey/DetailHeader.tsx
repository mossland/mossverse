import React from "react";
import styled from "styled-components";
import { types, checkIsActiveSurvey } from "@platform/data-access";
import { SurveyIcon } from "@shared/ui-web";
import { ActiveTag, Period } from "./";
import { cnst } from "@shared/util";

type SurveyDetailProps = {
  title: string;
  openAt: Date;
  closeAt: Date;
  voted: boolean;
  status: cnst.SurveyStatus;
};

export const DetailHeader = ({ title, openAt, closeAt, status, voted }: SurveyDetailProps) => {
  return (
    <StyledDetailHeader>
      <div className="title-container">
        <SurveyIcon />
        <Title text={title} />
      </div>
      <div className="sub-title-container">
        {checkIsActiveSurvey(status, closeAt) && <ActiveTag />}
        <Period openAt={openAt} closeAt={closeAt} />
      </div>
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
