import React from "react";
import styled, { css } from "styled-components";
import { DefaultButton } from "@platform/ui-web";
import { gql, utils, store } from "../../stores";
import { ExchangeItem, Survey } from "@platform/ui-web";
import { darken } from "polished";
import { useMocSurvey } from "./services/useMocSurvey";

export const CreateButton = () => {
  const mocSurveyService = useMocSurvey();
  if (mocSurveyService.isWriteMode || !mocSurveyService.self) return null;

  return (
    <CreateButtonContainer>
      <Survey.Button
        backgroundColor={"#FFE177"}
        onClick={mocSurveyService.openCreateBox}
        disabled={!mocSurveyService.hasMmoc()}
      >
        Create a new propsal
      </Survey.Button>
    </CreateButtonContainer>
  );
};

const CreateButtonContainer = styled.div`
  position: absolute;
  display: flex;
  bottom: 10px;
  right: 0px;
  width: 50%;
  padding: 0 23px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
  button {
    min-height: 60px;
    padding: 13px;
    border-radius: 10px;
    font-weight: 400;
    font-size: 22px;
    line-height: 22px;
    transition: all 0.5s;
    width: 100%;
  }
`;
