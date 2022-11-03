import React from "react";
import styled from "styled-components";
import { Utils } from "@shared/util";
import { SurveyIcon } from "@shared/ui-web";
import { useMocSurvey } from "./services/useMocSurvey";
import { Survey } from "@platform/ui-web";
import { gql } from "../../stores";
type SurveyItemProps = {
  mocSurvey: gql.MocSurvey;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

export const ListItem = ({ mocSurvey }: SurveyItemProps) => {
  const mocSurveyService = useMocSurvey();
  return (
    <SurveyItemContainer
      onClick={() => mocSurveyService.openDetail(mocSurvey)}
      selected={mocSurvey === mocSurveyService.mocSurvey}
      voted={mocSurvey.status !== "opened" || mocSurveyService.isVoted(mocSurvey.id)}
    >
      <Survey.Wrapper className="title-container">
        <SurveyIcon />
        <Survey.Text className="title">{mocSurvey.title}</Survey.Text>
      </Survey.Wrapper>
      <Survey.Wrapper className={"sub-title-container"}>
        {mocSurvey.status === "opened" && new Date(mocSurvey.closeAt).getTime() > Date.now() && <Survey.ActiveTag />}
        <Survey.Period openAt={mocSurvey.openAt} closeAt={mocSurvey.closeAt} />
      </Survey.Wrapper>
    </SurveyItemContainer>
  );
};

const SurveyItemContainer = styled.div<{ selected: boolean; voted: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 18px;
  height: 92px;
  width: 100%;
  border: 0px;
  border-top: 2px solid;
  border-bottom: 2px solid;
  background-color: ${(props) => (props.voted ? "#E8E8E8" : "#fff")};
  border-color: ${(props) => (props.selected ? `${props.theme.color.black}` : `${props.theme.color.grayD}`)};
  z-index: ${(props) => (!props.voted && props.selected ? 2 : 0)};

  transition-duration: 0.5s;

  position: relative;
  margin-top: -2px;

  .title-container {
    display: flex;
    .title {
      margin-left: 8px;
      font-family: Ubuntu Mono;
      text-align: left;
      font-style: normal;
      font-size: 16px;
      line-height: 16px;
      font-weight: ${(props) => (!props.voted && props.selected ? 700 : 400)};
      color: ${(props) => (!props.voted && props.selected ? "#000" : "#555")};

      /* margin-bottom: 30px; */
    }
  }
  .sub-title-container {
    display: flex;
    align-items: self-end;
    .tag {
      margin-bottom: -2px;
    }
  }
  .period {
    font-weight: ${(props) => (!props.voted && props.selected ? 700 : 400)};
  }
  :hover {
    background-color: #f4f4f4;
  }
  cursor: pointer;
`;
